// ─── Trend System ─────────────────────────────────────────────────────────────
// Trends rotate every 4–8 game months, affecting revenue and rating multipliers

export const TRENDS = [
    {
        id: 'ai_boom',
        name: 'AI Boom',
        icon: '🤖',
        color: '#7c6ef7',
        duration: { min: 5, max: 8 },
        description: 'AI-powered features are everywhere. Players want magic.',
        categoryBoosts: { hustle_saas: 1.5, dev_playground: 1.4, everyday_app: 1.2 },
        tagBoosts: { ai: 1.8, innovation: 1.3, emerging: 1.5 },
        tagPenalties: {},
        categoryPenalties: {},
    },
    {
        id: 'mobile_wave',
        name: 'Mobile Wave',
        icon: '📱',
        color: '#f59e0b',
        duration: { min: 4, max: 7 },
        description: 'Everyone wants mobile. Games and apps are booming.',
        categoryBoosts: { indie_hit: 1.6, everyday_app: 1.3, system_toy: 1.2 },
        tagBoosts: { social: 1.4, hype: 1.3, viral: 1.2 },
        tagPenalties: { trust: 0.9 },
        categoryPenalties: { hustle_saas: 0.85 },
    },
    {
        id: 'privacy_push',
        name: 'Privacy Push',
        icon: '🔐',
        color: '#3ecf8e',
        duration: { min: 4, max: 6 },
        description: 'Users demand privacy. Security-first wins.',
        categoryBoosts: { hustle_saas: 1.3, system_toy: 1.5, power_tool: 1.2 },
        tagBoosts: { privacy: 1.6, security: 1.5, trust: 1.4 },
        tagPenalties: { hype: 0.8, social: 0.85 },
        categoryPenalties: { indie_hit: 0.9 },
    },
    {
        id: 'minimalism',
        name: 'Minimalism Trend',
        icon: '⬜',
        color: '#94a3b8',
        duration: { min: 5, max: 7 },
        description: 'Less is more. Clutter-free, focused products win.',
        categoryBoosts: { everyday_app: 1.4, system_toy: 1.5, power_tool: 1.3 },
        tagBoosts: { minimalism: 1.6, design: 1.3, retention: 1.2 },
        tagPenalties: { hype: 0.85, social: 0.9 },
        categoryPenalties: {},
    },
    {
        id: 'gaming_surge',
        name: 'Gaming Surge',
        icon: '🕹️',
        color: '#f43f5e',
        duration: { min: 4, max: 6 },
        description: 'Gaming culture peaks. Gamified apps ride the wave.',
        categoryBoosts: { indie_hit: 1.7, system_toy: 1.2 },
        tagBoosts: { viral: 1.5, hype: 1.4, social: 1.3 },
        tagPenalties: { data: 0.85, strategy: 0.9 },
        categoryPenalties: { hustle_saas: 0.8 },
    },
    {
        id: 'cloud_shift',
        name: 'Cloud Shift',
        icon: '☁️',
        color: '#38bdf8',
        duration: { min: 5, max: 8 },
        description: 'Everything moves to the cloud. SaaS is king.',
        categoryBoosts: { hustle_saas: 1.6, everyday_app: 1.3, dev_playground: 1.4 },
        tagBoosts: { tech: 1.4, stable: 1.3, data: 1.5 },
        tagPenalties: { viral: 0.9 },
        categoryPenalties: { indie_hit: 0.85 },
    },
];

export function getRandomTrend(excludeId = null) {
    const pool = TRENDS.filter(t => t.id !== excludeId);
    return pool[Math.floor(Math.random() * pool.length)];
}

export function getTrendDuration(trend) {
    const { min, max } = trend.duration;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Returns a 0–2 multiplier for how aligned a set of component tags are with a trend
export function getTrendAlignment(componentTags, softwareTypeId, trend) {
    let score = 1.0;

    // Category boost/penalty
    if (trend && trend.categoryBoosts && trend.categoryBoosts[softwareTypeId]) {
        score *= trend.categoryBoosts[softwareTypeId];
    }
    if (trend && trend.categoryPenalties && trend.categoryPenalties[softwareTypeId]) {
        score *= trend.categoryPenalties[softwareTypeId];
    }

    // Tag alignment
    const allTags = componentTags.flat();
    allTags.forEach(tag => {
        if (trend.tagBoosts[tag]) score += (trend.tagBoosts[tag] - 1) * 0.5;
        if (trend.tagPenalties[tag]) score -= (1 - trend.tagPenalties[tag]) * 0.3;
    });

    return Math.max(0.3, Math.min(2.5, score));
}
