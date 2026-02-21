// ─── Corporate Competitors ────────────────────────────────────────────────────
// 12 Companies with distinct archetypes to fill the market.

import { generateProductName } from './nameGenerator.js';
import { COMPONENTS } from './components.js';
import { getSoftwareTypeById } from './softwareTypes.js';
import { aggregateProjectStats } from './simulation.js';
import { BASE_REVENUE_PER_RATING, FANBASE_REVENUE_MULTIPLIER, PLAYER_SHARE_GAIN } from './constants.js';

const ARCHETYPES = {
    GIANT: {
        power: 9,
        releaseChance: 0.15, // Low freq, high impact
        qualityBonus: 2.0,
        revenueMult: 3.0,
        categories: ['hustle_saas', 'everyday_app', 'power_tool'],
        trendDelay: 2, // LAG
    },
    FAST: {
        power: 6,
        releaseChance: 0.40, // High freq, low impact
        qualityBonus: 0.5,
        revenueMult: 0.8,
        categories: ['indie_hit', 'everyday_app'],
        trendDelay: 1,
    },
    TREND: {
        power: 7,
        releaseChance: 0.25,
        qualityBonus: 1.0,
        revenueMult: 1.2,
        categories: ['indie_hit', 'everyday_app', 'system_toy'],
        trendDelay: 0,
    },
    NICHE: {
        power: 8,
        releaseChance: 0.20,
        qualityBonus: 2.5, // High quality in niche
        revenueMult: 1.5,
        categories: null, // Assigned specifically
        trendDelay: 99,
    },
    LEGACY: {
        power: 5,
        releaseChance: 0.10,
        qualityBonus: -0.5,
        revenueMult: 2.0, // Existing installed base
        categories: ['hustle_saas', 'system_toy'],
        trendDelay: 3,
    },
};

export const CORPORATIONS = [
    { id: 'megasoft', name: 'MegaSoft', type: 'GIANT', color: '#3b82f6', icon: '🏢' },
    { id: 'appcorp', name: 'AppCorp', type: 'FAST', color: '#ec4899', icon: '📱' },
    { id: 'novaware', name: 'NovaWare', type: 'TREND', color: '#8b5cf6', icon: '🔮' },
    { id: 'cloudify', name: 'Cloudify', type: 'TREND', color: '#06b6d4', icon: '☁️' },
    { id: 'pixelforge', name: 'PixelForge', type: 'NICHE', specificCategory: 'indie_hit', color: '#f59e0b', icon: '🎮' },
    { id: 'zensys', name: 'Zen Systems', type: 'LEGACY', color: '#64748b', icon: '📠' },
    { id: 'apexlabs', name: 'Apex Labs', type: 'FAST', color: '#ef4444', icon: '🧪' },
    { id: 'quantum', name: 'QuantumWorks', type: 'GIANT', color: '#10b981', icon: '⚛️' },
    { id: 'nimpus', name: 'Nimbus Tech', type: 'NICHE', specificCategory: 'hustle_saas', color: '#6366f1', icon: '🌩️' },
    { id: 'vertex', name: 'Vertex Studios', type: 'FAST', color: '#d946ef', icon: '🎨' },
    { id: 'strata', name: 'Strata Base', type: 'LEGACY', color: '#78716c', icon: '🗃️' },
    { id: 'echo', name: 'Echo Media', type: 'TREND', color: '#f43f5e', icon: '📡' },
];

export function initCorporations() {
    return CORPORATIONS.map(corp => {
        const archetype = ARCHETYPES[corp.type];
        return {
            ...corp,
            ...archetype,
            categories: corp.specificCategory ? [corp.specificCategory] : archetype.categories,
            totalReleases: Math.floor(Math.random() * 5),
            lifetimeRevenue: Math.floor(Math.random() * 50000), // Some starting history
            lastTrendReactionMonth: 0, // Track when they last pivoted
        };
    });
}

function pickAIComponents(softwareTypeId, power) {
    const count = Math.min(15, Math.floor(power * 1.5));
    const validComps = COMPONENTS.filter(c => !c.exclusiveTo || c.exclusiveTo === softwareTypeId);
    return [...validComps]
        .sort(() => Math.random() - 0.5)
        .slice(0, count)
        .map(c => c.id);
}

export function tickCorporations(corps, marketShare, currentMonth, trend) {
    const notifications = [];
    let newProducts = [];

    const updatedCorps = corps.map(corp => {
        if (Math.random() < corp.releaseChance) {
            let category = corp.categories[Math.floor(Math.random() * corp.categories.length)];

            // Trend Reaction
            const monthsSinceTrendStart = trend ? (currentMonth - trend.startMonth) : 0;
            const canReact = monthsSinceTrendStart >= corp.trendDelay;
            if (corp.type === 'TREND' && trend && canReact && corp.categories.includes(trend.category)) {
                category = trend.category;
            }

            const type = getSoftwareTypeById(category);
            const isBlockbuster = Math.random() < 0.12;

            // V3: Component-driven AI Stats
            const componentIds = pickAIComponents(category, corp.power);
            const stats = aggregateProjectStats(componentIds);

            const synergyCriticBoost = stats.synergies.reduce((sum, s) => sum + (s.bonus.criticsScore || 0), 0);
            const synergyPlayerBoost = stats.synergies.reduce((sum, s) => sum + (s.bonus.playerScore || 0), 0);
            const synergyLifespan = stats.synergies.reduce((sum, s) => sum + (s.bonus.lifespan || 0), 0);

            const baseRating = 5.0 + (corp.power / 3) + (Math.random() * 2.5) + (isBlockbuster ? 0.8 : 0);
            const rating = Math.min(10, Math.max(3, baseRating + (synergyCriticBoost + synergyPlayerBoost) * 0.4 + (corp.qualityBonus || 0)));

            const revenueMultiplier = (stats.revenueMultiplier || 1.0) * (corp.revenueMult || 1.0);
            const virtualFanMult = 1 + (corp.lifetimeRevenue / 150000) * FANBASE_REVENUE_MULTIPLIER;

            const baseRev = BASE_REVENUE_PER_RATING * rating * virtualFanMult * revenueMultiplier;
            const revenue = Math.round(Math.min(type.demandPool * 0.45, baseRev));

            const newProd = {
                id: `corp_${corp.id}_${Date.now()}_${Math.random()}`,
                name: generateProductName(corp.name, category, corp.totalReleases),
                owner: corp.name,
                ownerId: corp.id,
                isPlayer: false,
                softwareTypeId: category,
                rating: parseFloat(rating.toFixed(1)),
                monthlyRevenue: revenue,
                currentRevenue: revenue,
                lifetimeRevenue: 0,
                monthsLive: 0,
                maxMonths: type.baseLifespan + synergyLifespan + (isBlockbuster ? 12 : 0),
                releasedAt: currentMonth,
                marketShare: (revenue / (type.demandPool * 4)), // Rough share estimate
                color: corp.color,
                isBlockbuster,
                synergies: stats.synergies.map(s => s.label)
            };

            newProducts.push(newProd);

            if (isBlockbuster || rating > 8.8) {
                notifications.push({
                    id: `corp_notif_${Date.now()}`,
                    type: isBlockbuster ? 'corp_blockbuster' : 'corp_release',
                    message: isBlockbuster
                        ? `💥 ${corp.name} dropped a BLOCKBUSTER: "${newProd.name}"!`
                        : `⚠️ ${corp.name} released "${newProd.name}" (${rating.toFixed(1)}/10)`,
                });
            }

            return {
                ...corp,
                totalReleases: corp.totalReleases + 1,
                recentRelease: true,
            };
        }
        return { ...corp, recentRelease: false };
    });

    return { corps: updatedCorps, notifications, newProducts };
}
