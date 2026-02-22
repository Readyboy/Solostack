// ─── Core Simulation Engine ──────────────────────────────────────────────────
// Pure functions: no side effects, no UIs.

import {
    RATING_QUALITY_WEIGHT,
    RATING_INNOVATION_WEIGHT,
    RATING_TREND_WEIGHT,
    RATING_MARKETING_WEIGHT,
    BASE_REVENUE_PER_RATING,
    FANBASE_REVENUE_MULTIPLIER,
    REVENUE_DECAY_RATE,
    MAX_PRODUCT_LIFESPAN,
    VIRAL_BASE_CHANCE,
    VIRAL_MULTIPLIER,
    SEVERE_FAIL_CHANCE,
    FAN_BASE_MULTIPLIER,
    FAN_VIRAL_BONUS,
    FAN_TREND_BONUS,
    CORP_AGGRESSION,
    PLAYER_SHARE_GAIN,
    BASE_ENERGY,
    PRODUCT_PASSIVE_ENERGY,
} from './constants.js';
import { getActiveComponents, detectSynergies, getComponentById } from './components.js';
import { getTrendAlignment, getRandomTrend, getTrendDuration } from './trends.js';
import { tickCorporations } from './corporations.js';
import { SOFTWARE_TYPES, getSoftwareTypeById } from './softwareTypes.js';

// ── Stat Aggregation ──────────────────────────────────────────────────────────
export function aggregateProjectStats(componentIds) {
    const comps = getActiveComponents(componentIds);
    const synergies = detectSynergies(componentIds);

    const base = comps.reduce(
        (acc, c) => ({
            quality: acc.quality + (c.quality || 0),
            innovation: acc.innovation + (c.innovation || 0),
            retention: acc.retention + (c.retention || 0),
            marketingPower: acc.marketingPower + (c.marketingPower || 0),
            risk: acc.risk + (c.risk || 0),
            devTime: acc.devTime + (c.devTime || 0),
            cost: acc.cost + (c.cost || 0),
            revenueMultiplier: acc.revenueMultiplier * (c.revenueMultiplier || 1.0),
            tags: [...acc.tags, ...(c.tags || [])],
        }),
        { quality: 0, innovation: 0, retention: 0, marketingPower: 0, risk: 0, devTime: 0, cost: 0, revenueMultiplier: 1.0, tags: [] }
    );

    // Apply synergy bonuses defensively
    const activeSynergies = synergies.map(syn => {
        if (!syn.bonus) return syn;
        Object.keys(syn.bonus).forEach(key => {
            if (base[key] !== undefined) {
                if (key === 'revenueMultiplier') base[key] *= (syn.bonus[key] || 1.0);
                else base[key] += (syn.bonus[key] || 0);
            }
        });
        return syn;
    });

    return { ...base, synergies: activeSynergies };
}


// ── Rating Calculation ─────────────────────────────────────────────────────────
export function calculateRating(componentIds, softwareTypeId, trend, fanbase) {
    const stats = aggregateProjectStats(componentIds);
    const softwareType = getSoftwareTypeById(softwareTypeId);

    // Synergies can explicitly boost scores
    const synergyCriticBoost = stats.synergies.reduce((sum, s) => sum + (s.bonus.criticsScore || 0), 0);
    const synergyPlayerBoost = stats.synergies.reduce((sum, s) => sum + (s.bonus.playerScore || 0), 0);

    const qualityScore = Math.min(10, (stats.quality / 10) * 10);
    const innovationScore = Math.min(10, (stats.innovation / 10) * 10);
    const marketingScore = Math.min(10, (stats.marketingPower / 10) * 10);

    const trendAlignment = getTrendAlignment(
        getActiveComponents(componentIds).map(c => c.tags),
        softwareTypeId,
        trend
    );
    const trendScore = Math.min(10, (trendAlignment / 2) * 10);

    let rawRating =
        qualityScore * RATING_QUALITY_WEIGHT +
        innovationScore * RATING_INNOVATION_WEIGHT +
        trendScore * RATING_TREND_WEIGHT +
        marketingScore * RATING_MARKETING_WEIGHT;

    // Apply synergy impact
    rawRating += (synergyCriticBoost * 0.4 + synergyPlayerBoost * 0.6);

    const fanResistance = Math.min(1.5, 1 + (fanbase / 50000) * 0.5);
    const fanRating = rawRating * fanResistance;

    const totalRisk = Math.max(0, softwareType.baseRisk + stats.risk);
    const volatility = (Math.random() - 0.5) * totalRisk * 4;

    return Math.max(0.5, Math.min(10, fanRating + volatility));
}

// ── Failure & Viral Chances ────────────────────────────────────────────────────
export function calcFailureChance(componentIds, softwareTypeId) {
    const stats = aggregateProjectStats(componentIds);
    const softwareType = getSoftwareTypeById(softwareTypeId);
    if (!softwareType) return 0.5; // Failsafe
    const risk = Math.max(0, (softwareType.baseRisk || 0) + (stats.risk || 0));
    return Math.min(0.5, SEVERE_FAIL_CHANCE + risk * 0.8);
}


export function calcViralChance(componentIds, trendAlignment, softwareTypeId) {
    const stats = aggregateProjectStats(componentIds);
    const softwareType = getSoftwareTypeById(softwareTypeId);

    // Hustle SaaS has extremely low virality
    const typeViralMult = softwareTypeId === 'hustle_saas' ? 0.2 : 1.0;

    const marketingBonus = stats.marketingPower * 0.02;
    const synViralBonus = stats.synergies
        .reduce((sum, s) => sum + (s.bonus.viralChance || 0), 0);

    return Math.min(0.8, (VIRAL_BASE_CHANCE + marketingBonus + synViralBonus + (trendAlignment - 1) * 0.05) * typeViralMult);
}

// ── Revenue Calculation ────────────────────────────────────────────────────────
export function calculateMonthlyRevenue(rating, fanbase, marketShare, trend, softwareTypeId, revenueMultiplier = 1.0) {
    const softwareType = getSoftwareTypeById(softwareTypeId);
    const baseRev = BASE_REVENUE_PER_RATING * rating;

    const effectiveFans = fanbase <= 10000
        ? fanbase
        : 10000 + Math.log10(Math.max(1, fanbase - 10000)) * 2500;

    const fanMult = 1 + effectiveFans * FANBASE_REVENUE_MULTIPLIER;
    const shareMult = 0.5 + marketShare * 2;
    const trendMult = trend ? (trend.categoryBoosts[softwareTypeId] || 1.0) : 1.0;

    // System Toy is trend resistant
    const finalTrendMult = softwareTypeId === 'system_toy' ? 1.0 + (trendMult - 1.0) * 0.2 : trendMult;

    const demandCap = softwareType.demandPool;

    const revenue = Math.min(demandCap, baseRev * fanMult * shareMult * finalTrendMult * revenueMultiplier);
    return Math.round(revenue);
}

// ── Fan Gain ──────────────────────────────────────────────────────────────────
export function calculateFanGain(rating, isViral, trendAlignment, fanGainMultiplier = 1.0) {
    const base = Math.round(rating * FAN_BASE_MULTIPLIER);
    const viralBonus = isViral ? FAN_VIRAL_BONUS : 0;
    const trendBonus = trendAlignment >= 1.3 ? FAN_TREND_BONUS : 1.0;
    return Math.round((base + viralBonus) * trendBonus * fanGainMultiplier);
}

// ── Review Generation (Pure) ──────────────────────────────────────────────────
export function generateReviews(project, playerState, trend) {
    const { componentIds, softwareTypeId } = project;
    const { fanbase, marketShare } = playerState;

    const stats = aggregateProjectStats(componentIds);
    const softwareType = getSoftwareTypeById(softwareTypeId);
    const trendAlignment = getTrendAlignment(
        getActiveComponents(componentIds).map(c => c.tags),
        softwareTypeId,
        trend
    );

    const synergyCriticBoost = stats.synergies.reduce((sum, s) => sum + (s.bonus?.criticsScore || 0), 0);
    const synergyPlayerBoost = stats.synergies.reduce((sum, s) => sum + (s.bonus?.playerScore || 0), 0);

    const rawCritics =
        (stats.quality || 0) * 1.0 +
        (stats.innovation || 0) * 0.8 +
        synergyCriticBoost -
        Math.max(0, (softwareType?.baseRisk || 0) + (stats.risk || 0)) * 2.0;

    const criticsScore = parseFloat(
        Math.max(3.0, Math.min(9.9, 4.0 + rawCritics * 0.6 + (Math.random() - 0.5) * 0.8)).toFixed(1)
    );

    const fanbonusScore = Math.min(1.2, 1 + (fanbase / 30000) * 0.4);
    const marketingBonus = Math.min(1.5, (stats.marketingPower || 0) * 0.2);
    const trendBonus = (trendAlignment - 1) * 0.5;

    const rawPlayer = (criticsScore * fanbonusScore + marketingBonus + trendBonus + synergyPlayerBoost);
    const playerScore = parseFloat(
        Math.max(criticsScore - 1.0, Math.min(10.0, rawPlayer + (Math.random() - 0.4) * 0.6)).toFixed(1)
    );

    const finalRating = parseFloat(((criticsScore * 0.4 + playerScore * 0.6)).toFixed(1));

    const viralChance = calcViralChance(componentIds, trendAlignment, softwareTypeId);
    const failChance = calcFailureChance(componentIds, softwareTypeId);

    const viralLabel = viralChance > 0.4 ? 'Extreme' : viralChance > 0.25 ? 'High' : viralChance > 0.1 ? 'Medium' : 'Low';
    const failLabel = failChance < 0.05 ? 'Very Low' : failChance < 0.12 ? 'Low' : failChance < 0.25 ? 'Medium' : 'High';

    const revenueMultiplier = stats.revenueMultiplier || 1.0;
    const baseEstimate = calculateMonthlyRevenue(finalRating, fanbase, marketShare, trend, softwareTypeId, revenueMultiplier);

    const lowEst = Math.round(baseEstimate * 0.7);
    const highEst = Math.round(baseEstimate * (viralChance > 0.3 ? 3.0 : 1.5));

    const criticsLines = [
        criticsScore >= 9.0 ? 'A masterpiece. Every solo dev dreams of this.' : null,
        criticsScore >= 7.5 ? 'Clean, professional, and targeted.' : null,
        criticsScore < 6.0 ? 'A bit amateurish. It needs more focus.' : null,
        stats.innovation > 3.0 ? 'Shocking innovation for a solo effort.' : null,
        stats.synergies.length >= 2 ? `The combo of ${stats.synergies[0].label} and ${stats.synergies[1].label} is brilliant.` :
            stats.synergies.length > 0 ? `The ${stats.synergies[0].label} vibe really works here.` : null,
    ].filter(Boolean);

    return {
        criticsScore,
        criticsText: criticsLines.slice(0, 3).join(' ') || 'Standard release.',
        playerScore,
        playerText: playerScore >= 8.0 ? 'The community is buzzing!' : 'A quiet reception.',
        finalRating,
        viralChance,
        viralLabel,
        failChance,
        failLabel,
        revenueEstimateMin: lowEst,
        revenueEstimateMax: highEst,
        trendAlignment,
        trendLabel: trendAlignment > 1.5 ? 'Perfect Match' : trendAlignment > 1.1 ? 'Good' : 'Weak',
        trendPercent: Math.round((trendAlignment - 1) * 100),
    };
}

// ── Release Resolution ─────────────────────────────────────────────────────────
export function resolveRelease(project, playerState, trend) {
    const { componentIds, softwareTypeId } = project;
    const { fanbase } = playerState;

    const failChance = calcFailureChance(componentIds, softwareTypeId);
    if (Math.random() < failChance && fanbase < 500) {
        return {
            success: false,
            rating: parseFloat((Math.random() * 2).toFixed(1)),
            revenue: 0,
            fanGain: 0,
            isViral: false,
            isFail: true,
            message: '🚨 Launch Failure! The code was too messy to survive.',
        };
    }

    const reviews = project.reviews || generateReviews(project, playerState, trend);
    const { finalRating, viralChance, trendAlignment } = reviews;

    const isViral = Math.random() < viralChance;

    const stats = aggregateProjectStats(componentIds);
    const fanGainMult = stats.synergies.reduce((sum, s) => sum + (s.bonus?.fanGain || 0), 1.0);
    const fanGain = calculateFanGain(finalRating, isViral, trendAlignment, fanGainMult);

    const revenueMultiplier = stats.revenueMultiplier || 1.0;
    const baseMonthly = calculateMonthlyRevenue(finalRating, playerState.fanbase + fanGain, playerState.marketShare, trend, softwareTypeId, revenueMultiplier);

    const viralMult = isViral ? VIRAL_MULTIPLIER : 1.0;
    const launchRevenue = Math.round((baseMonthly || 0) * viralMult);

    const softwareType = getSoftwareTypeById(softwareTypeId);
    const synergyLifespan = stats.synergies.reduce((sum, s) => sum + (s.bonus?.lifespan || 0), 0);
    const maxMonths = (softwareType?.baseLifespan || 12) + synergyLifespan;

    const synergyShareBoost = stats.synergies.reduce((sum, s) => sum + (s.bonus?.marketShareGain || 0), 0);
    const shareGain = (finalRating / 10) * PLAYER_SHARE_GAIN + (synergyShareBoost / 100);

    const product = {
        id: `${project.id}_rel`,
        name: project.name,
        softwareTypeId,
        componentIds,
        rating: finalRating,
        retention: stats.retention,
        revenueMultiplier, // Store for monthly revenue
        currentRevenue: baseMonthly,
        lifetimeRevenue: launchRevenue,
        monthsLive: 1,
        maxMonths,
        trendAlignment,
        isViral,
        releasedAt: playerState.month,
        isPlayer: true,
        marketShare: Math.max(0.001, shareGain / 5), // V3: Give individual product share for visibility
    };

    return {
        success: true,
        isFail: false,
        isViral,
        rating: finalRating,
        launchRevenue,
        fanGain,
        shareGain,
        product,
        message: isViral ? `🌟 VIRAL HIT! "${project.name}" is everywhere! +${fanGain} fans.` :
            `✅ Shipped "${project.name}"! Rating: ${finalRating}/10.`,
    };
}


// ── Monthly Tick ──────────────────────────────────────────────────────────────
export function tickProducts(products, fanbase, marketShare, trend) {
    let totalMonthlyIncome = 0;
    const expired = [];

    const updatedProducts = products.map(p => {
        // Lifecycle Check
        if (p.monthsLive >= p.maxMonths) {
            expired.push({ ...p, archiveReason: 'Lifespan Expired' });
            return null;
        }

        // V3: Dynamic Decay (Rating + Retention driven)
        const qualityPersistence = (p.rating >= 8) ? 0.02 : 0;
        const retentionPersistence = (p.retention || 0) * 0.005;
        const effectiveDecay = Math.min(0.98, Math.max(0.80, REVENUE_DECAY_RATE + qualityPersistence + retentionPersistence));

        const decayed = Math.round(p.currentRevenue * effectiveDecay);
        const trendBoost = trend ? (trend.categoryBoosts[p.softwareTypeId] || 1.0) : 1.0;
        const newRevenue = Math.round(decayed * trendBoost);

        if (newRevenue <= 10) {
            expired.push({ ...p, archiveReason: 'Revenue Decayed' });
            return null;
        }

        if (p.isPlayer) {
            totalMonthlyIncome += newRevenue;
        }

        return {
            ...p,
            currentRevenue: newRevenue,
            lifetimeRevenue: (p.lifetimeRevenue || 0) + newRevenue,
            monthsLive: (p.monthsLive || 0) + 1,
        };
    }).filter(Boolean);

    return { updatedProducts, expired, totalMonthlyIncome };
}

// ── Energy ────────────────────────────────────────────────────────────────────
export function calcEnergyUsed(projects, products) {
    const projectEnergy = projects.reduce((sum, p) => {
        const type = getSoftwareTypeById(p.softwareTypeId);
        return sum + (type ? type.energyCost : 8);
    }, 0);
    const productEnergy = products.filter(p => p.isPlayer).length * PRODUCT_PASSIVE_ENERGY;
    return projectEnergy + productEnergy;
}

export function getAvailableEnergy(projects, products) {
    return BASE_ENERGY - calcEnergyUsed(projects, products);
}

// ── Market Share ──────────────────────────────────────────────────────────────
export function updateMarketShare(currentShare, shareGain, corpShares) {
    const totalCorpShare = Object.values(corpShares || {}).reduce((a, b) => a + b, 0);
    const newShare = Math.min(1 - totalCorpShare, currentShare + shareGain);
    return parseFloat(newShare.toFixed(4));
}

// ── Win Conditions ─────────────────────────────────────────────────────────────
import { WIN_REVENUE, WIN_MARKET_SHARE, WIN_CATEGORY_DOMINATION } from './constants.js';

export function checkWinConditions(playerState) {
    const { lifetimeRevenue, marketShare, products } = playerState;

    if (lifetimeRevenue >= WIN_REVENUE) {
        return { type: 'revenue', title: '💰 Financial Success', message: `You crossed $${WIN_REVENUE.toLocaleString()} in lifetime revenue! A comfortable retirement awaits.` };
    }

    if (marketShare >= WIN_MARKET_SHARE) {
        return { type: 'market', title: '📊 Industry Hegemony', message: `You own ${Math.round(marketShare * 100)}% of the market. You are the software industry.` };
    }

    const dominatedCategories = SOFTWARE_TYPES.filter(type => {
        return products.some(p => p.softwareTypeId === type.id && p.rating >= 8.5);
    });
    if (dominatedCategories.length >= WIN_CATEGORY_DOMINATION) {
        return { type: 'domination', title: '👑 Category Conqueror', message: `You released blockbusters in ${dominatedCategories.length} different software categories!` };
    }
    return null;
}

// ── Full Monthly Tick ──────────────────────────────────────────────────────────
export function runMonthlyTick(state) {
    const { products, projects, corporations, fanbase, marketShare, trend, trendMonthsLeft, month, competitorProducts } = state;

    // 1. Tick Player Products
    const { updatedProducts: activeProducts, expired: playerExpired, totalMonthlyIncome } = tickProducts(products, fanbase, marketShare, trend.data);

    // 2. Tick Competitor Products (new separate list)
    const { updatedProducts: activeCompetitors, expired: corpExpired } = tickProducts(competitorProducts || [], 0, 0, trend.data);

    // 3. Tick Corporations
    const { corps: updatedCorps, notifications: corpNotifs, newProducts: newCorpProds } = tickCorporations(corporations, marketShare, month, trend.data);

    // Merge new corp products into the active competitor list
    const allCompetitors = [...activeCompetitors, ...newCorpProds];

    // 4. Corp Aggression (V3: Proportional Steal)
    let updatedShare = marketShare;
    updatedCorps.forEach(corp => {
        if (corp.recentRelease) {
            // AI steals share based on their power level relative to market
            const stealBase = CORP_AGGRESSION * (corp.power / 10);
            updatedShare = Math.max(0.01, updatedShare - stealBase);
        }
    });

    // 5. Projects
    const updatedProjects = projects.map(p => ({
        ...p,
        monthsLeft: Math.max(0, p.monthsLeft - 1),
    }));

    // 6. Trend
    let newTrend = trend;
    let newTrendMonthsLeft = trendMonthsLeft - 1;
    const trendNotifs = [];
    if (newTrendMonthsLeft <= 0) {
        const nextTrend = getRandomTrend(trend.data?.id);
        const nextDuration = getTrendDuration(nextTrend);
        newTrend = { data: nextTrend };
        newTrendMonthsLeft = nextDuration;
        trendNotifs.push({
            id: `trend_${Date.now()}`,
            type: 'trend_change',
            message: `🔄 Trend shift! "${nextTrend.name}" ${nextTrend.icon} is now dominant.`,
        });
    }

    return {
        products: activeProducts,
        competitorProducts: allCompetitors,
        playerExpired, // Return for store to archive
        corpExpired,   // Return for store to archive
        projects: updatedProjects,
        corporations: updatedCorps,
        marketShare: updatedShare,
        money: state.money + totalMonthlyIncome,
        lifetimeRevenue: state.lifetimeRevenue + totalMonthlyIncome,
        monthlyIncome: totalMonthlyIncome,
        month: month + 1,
        trend: newTrend,
        trendMonthsLeft: newTrendMonthsLeft,
        notifications: [...corpNotifs, ...trendNotifs],
    };
}
