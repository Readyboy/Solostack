// ─── Zustand Game Store ───────────────────────────────────────────────────────
// Single source of truth for all game state. Persists to localStorage.

import { create } from 'zustand';
import { STARTING_MONEY, STARTING_FANS, BASE_ENERGY } from '../simulation/constants.js';
import { initCorporations } from '../simulation/corporations.js';
import { TRENDS, getRandomTrend, getTrendDuration } from '../simulation/trends.js';
import { COMPONENTS, getActiveComponents } from '../simulation/components.js';
import { getSoftwareTypeById, SOFTWARE_TYPES } from '../simulation/softwareTypes.js';
import {
    resolveRelease,
    runMonthlyTick,
    checkWinConditions,
    getAvailableEnergy,
    updateMarketShare,
    generateReviews,
} from '../simulation/simulation.js';

const SAVE_KEY = 'solostack_save_v1.3'; // Bumped version

// ── Initial State Factory ─────────────────────────────────────────────────────
function createInitialState() {
    const firstTrend = getRandomTrend();
    return {
        // Player
        money: STARTING_MONEY,
        fanbase: STARTING_FANS,
        marketShare: 0.02,
        lifetimeRevenue: 0,
        monthlyIncome: 0,
        totalReleases: 0,
        month: 1,

        isPaused: false,

        // Projects (in development)
        projects: [],
        pendingReview: null,

        // Products
        products: [],
        competitorProducts: [],
        archive: [],

        // Market
        market: SOFTWARE_TYPES.reduce((acc, t) => {
            acc[t.id] = { saturation: 0.1, playerShare: 0 };
            return acc;
        }, {}),

        // Corporations
        corporations: initCorporations(),

        // Trend
        trend: { data: firstTrend },
        trendMonthsLeft: getTrendDuration(firstTrend),

        // Unlocked components (ids)
        unlockedComponents: COMPONENTS
            .filter(c => c.unlockCondition.type === 'free')
            .map(c => c.id),

        // Window open/close state
        windows: {
            builder: true,
            projects: false,
            products: false,
            market: false,
            stats: false,
            archive: false,
        },

        // Notifications
        notifications: [],

        // V3: Progression & Legacy
        pillarSlots: { Ideation: 2, Design: 3, Development: 3, Marketing: 2 },
        hasUnlockedSlotBonus: false,
        pendingSlotChoice: false,
        categoryLegacy: {}, // { categoryId: level }

        // Win state
        winState: null,

        // UI state
        projectIdCounter: 0,
    };
}

// ── Store ─────────────────────────────────────────────────────────────────────
const useGameStore = create((set, get) => ({
    ...createInitialState(),

    // ── Window Management ──────────────────────────────────────────────────────
    toggleWindow: (windowKey) => set(s => ({
        windows: { ...s.windows, [windowKey]: !s.windows[windowKey] }
    })),
    openWindow: (windowKey) => set(s => ({
        windows: { ...s.windows, [windowKey]: true }
    })),
    closeWindow: (windowKey) => set(s => ({
        windows: { ...s.windows, [windowKey]: false }
    })),

    // ── Core Actions ───────────────────────────────────────────────────────────
    pauseGame: () => set({ isPaused: true }),
    resumeGame: () => set({ isPaused: false }),

    addNotification: (notification) => set(s => ({
        notifications: [
            { id: `notif_${Date.now()}_${Math.random()}`, ...notification },
            ...s.notifications,
        ].slice(0, 10),
    })),
    dismissNotification: (id) => set(s => ({
        notifications: s.notifications.filter(n => n.id !== id),
    })),

    // ── Start Project ──────────────────────────────────────────────────────────
    startProject: ({ name, softwareTypeId, componentIds }) => {
        const state = get();
        const softwareType = getSoftwareTypeById(softwareTypeId);
        const comps = getActiveComponents(componentIds);
        const totalCost = comps.reduce((s, c) => s + c.cost, 0);
        const totalDevTime = Math.max(1, Math.ceil(comps.reduce((s, c) => s + c.devTime, 0)));

        if (state.money < totalCost) return { error: 'Not enough money!' };
        const energyAvail = getAvailableEnergy(state.projects, state.products);
        if (energyAvail < softwareType.energyCost) return { error: 'Not enough energy!' };

        const id = `proj_${state.projectIdCounter + 1}`;

        // V3: Apply Legacy Bonus
        const legacyLevel = state.categoryLegacy[softwareTypeId] || 0;
        const legacyRatingBonus = legacyLevel * 0.1;

        const project = {
            id,
            name,
            softwareTypeId,
            componentIds,
            totalCost,
            monthsLeft: totalDevTime,
            totalMonths: totalDevTime,
            startMonth: state.month,
            legacyRatingBonus, // Store for later
        };

        set(s => ({
            projects: [...(s.projects || []), project],
            money: s.money - totalCost,
            projectIdCounter: s.projectIdCounter + 1,
            windows: { ...s.windows, projects: true },
        }));

        get().addNotification({
            type: 'project_started',
            message: `🛠️ "${name}" is now in development! (${totalDevTime} months)`,
        });

        return { success: true };
    },

    // ── Prepare Review (Auto-Triggered) ────────────────────────────────────────
    prepareReview: (projectId) => {
        const state = get();
        const project = state.projects.find(p => p.id === projectId);
        if (!project) return;

        const reviews = generateReviews(project, state, state.trend.data);

        set(s => ({
            projects: s.projects.filter(p => p.id !== projectId),
            pendingReview: { ...project, reviews },
            isPaused: true,
        }));
    },

    // ── Publish Project (Conversion from Project → Product) ───────────────────
    publishProject: (projectId) => {
        const state = get();
        console.log(`🚀 Attempting to publish: ${projectId}`);

        let project = state.pendingReview && state.pendingReview.id === projectId ? state.pendingReview : null;
        if (!project) project = state.projects.find(p => p.id === projectId);

        if (!project) {
            console.error(`❌ Project not found: ${projectId}`);
            return;
        }

        const result = resolveRelease(project, state, state.trend.data);
        get().addNotification({ type: result.isFail ? 'fail' : (result.isViral ? 'viral' : 'release'), message: result.message });

        if (result.isFail) {
            set(s => ({
                pendingReview: null,
                isPaused: false,
                projects: s.projects.filter(p => p.id !== projectId),
            }));
            return;
        }

        const { product, launchRevenue, fanGain, shareGain } = result;

        // V3: Add Legacy Rating Bonus to product
        if (project.legacyRatingBonus) {
            product.rating = parseFloat((product.rating + project.legacyRatingBonus).toFixed(1));
        }

        const newShare = updateMarketShare(state.marketShare, shareGain, {});

        // V3: Check for Slot Bonus Unlock
        let unlockSlot = false;
        if (!state.hasUnlockedSlotBonus) {
            const defeatedGiant = state.competitorProducts.some(cp =>
                cp.softwareTypeId === product.softwareTypeId &&
                cp.rating < product.rating &&
                state.corporations.find(c => c.id === cp.ownerId)?.type === 'GIANT'
            );

            if (newShare >= 0.25 || defeatedGiant) unlockSlot = true;
        }

        // ATOMIC COMMIT: Clear review, unpause, add product, move money, update share
        set(s => ({
            pendingReview: null,
            isPaused: false,
            totalReleases: s.totalReleases + 1,
            projects: s.projects.filter(p => p.id !== projectId),
            products: [...(s.products || []), product],
            money: s.money + launchRevenue,
            fanbase: s.fanbase + fanGain,
            marketShare: newShare,
            lifetimeRevenue: s.lifetimeRevenue + launchRevenue,
            windows: { ...s.windows, products: true },
            hasUnlockedSlotBonus: unlockSlot ? true : s.hasUnlockedSlotBonus,
            pendingSlotChoice: unlockSlot ? true : s.pendingSlotChoice,
        }));

        console.assert(!get().isPaused, '❌ Game still paused after publish');
        console.assert(!get().pendingReview, '❌ Review modal state still active');

        if (unlockSlot) {
            get().addNotification({
                type: 'unlock',
                message: '🏆 LEGENDARY STATUS! Market dominance grants you a permanent +1 Slot! Choose in the Builder.',
            });
        }

        const newState = get();
        const win = checkWinConditions(newState);
        if (win && !newState.winState) set({ winState: win });
    },

    archiveProduct: (productId) => {
        const state = get();
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        // V3: Legacy Memory
        const catId = product.softwareTypeId;
        const currentLegacy = state.categoryLegacy[catId] || 0;

        set(s => ({
            products: s.products.filter(p => p.id !== productId),
            archive: [...(s.archive || []), {
                ...product,
                ownerName: 'YOU',
                archivedAt: s.month,
                archiveReason: 'Manual Retirement'
            }],
            categoryLegacy: {
                ...s.categoryLegacy,
                [catId]: Math.min(5, currentLegacy + 1), // Max level 5
            }
        }));
        get().addNotification({ type: 'archive', message: `📦 "${product.name}" archived. Legacy established for ${catId}!` });
    },

    chooseSlotBonus: (pillar) => {
        set(s => ({
            pillarSlots: {
                ...s.pillarSlots,
                [pillar]: s.pillarSlots[pillar] + 1
            },
            pendingSlotChoice: false
        }));
        get().addNotification({ type: 'unlock', message: `✨ Permanent upgrade: +1 Slot for ${pillar}!` });
    },

    acknowledgeWin: () => set({ winState: null, isPaused: false }),

    // ── Monthly Tick ───────────────────────────────────────────────────────────
    advanceTick: () => {
        const state = get();
        if (state.isPaused) return;

        const readyProject = state.projects.find(p => p.monthsLeft <= 0);
        if (readyProject) {
            get().prepareReview(readyProject.id);
            return;
        }

        const result = runMonthlyTick(state);
        result.notifications?.forEach(n => get().addNotification(n));

        // V3: Auto-Archive Player Products only
        const playerExpired = (result.playerExpired || []).map(p => ({
            ...p,
            ownerName: 'YOU',
            archivedAt: state.month,
            archiveReason: p.archiveReason || 'Market Exit'
        }));

        // V3: Update Corporation Lifetime Revenue for Worth calculation
        const updatedCorps = result.corporations.map(corp => {
            const corpRevenue = result.competitorProducts
                .filter(p => p.ownerId === corp.id)
                .reduce((sum, p) => sum + p.currentRevenue, 0);
            return {
                ...corp,
                lifetimeRevenue: (corp.lifetimeRevenue || 0) + corpRevenue
            };
        });

        set(s => ({
            ...result,
            corporations: updatedCorps,
            archive: [...(s.archive || []), ...playerExpired],
            isPaused: s.isPaused,
            pendingReview: s.pendingReview,
            winState: s.winState,
            unlockedComponents: s.unlockedComponents,
        }));

        get().saveGame();
    },

    newGame: () => {
        localStorage.removeItem(SAVE_KEY);
        set(createInitialState());
    },

    saveGame: () => {
        const state = get();
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(state));
        } catch { }
    },

    loadGame: () => {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return false;
            const saved = JSON.parse(raw);
            const initial = createInitialState();

            // Comprehensive merge with array safety
            set(s => ({
                ...initial,
                ...saved,
                projects: Array.isArray(saved.projects) ? saved.projects : [],
                products: Array.isArray(saved.products) ? saved.products : [],
                competitorProducts: Array.isArray(saved.competitorProducts) ? saved.competitorProducts : [],
                archive: Array.isArray(saved.archive) ? saved.archive : [],
                unlockedComponents: Array.isArray(saved.unlockedComponents) ? saved.unlockedComponents : initial.unlockedComponents,
                windows: initial.windows, // Always reset layout to avoid ghost windows
                notifications: [],
                isPaused: !!saved.pendingReview,
            }));
            return true;
        } catch {
            return false;
        }
    },
}));

export default useGameStore;
