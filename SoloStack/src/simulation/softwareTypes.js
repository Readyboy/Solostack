// ─── Software Types / Categories ─────────────────────────────────────────────
// Each type has a demand pool, risk profile, and preferred component tags

export const SOFTWARE_TYPES = [
    {
        id: 'indie_hit',
        name: 'Indie Hit',
        icon: '🎮',
        color: '#f59e0b',
        demandPool: 180_000,
        baseRisk: 0.25,
        baseLifespan: 12, // Fast decay
        energyCost: 6,
        description: 'High risk, high reward. Viral spikes but fast decay.',
    },
    {
        id: 'everyday_app',
        name: 'Everyday App',
        icon: '📱',
        color: '#3b82f6',
        demandPool: 150_000,
        baseRisk: 0.10,
        baseLifespan: 24,
        energyCost: 8,
        description: 'Broad appeal. Trend sensitive and marketing driven.',
    },
    {
        id: 'hustle_saas',
        name: 'Hustle SaaS',
        icon: '💼',
        color: '#7c6ef7',
        demandPool: 220_000,
        baseRisk: 0.05,
        baseLifespan: 48,
        energyCost: 15, // High energy
        description: 'Stable revenue and long lifespan. Low virality.',
    },
    {
        id: 'power_tool',
        name: 'Power Tool',
        icon: '🧰',
        color: '#06b6d4',
        demandPool: 120_000,
        baseRisk: 0.08,
        baseLifespan: 36,
        energyCost: 10,
        description: 'Niche audience. High retention and critic scores.',
    },
    {
        id: 'system_toy',
        name: 'System Toy',
        icon: '🖥️',
        color: '#64748b',
        demandPool: 90_000,
        baseRisk: 0.05,
        baseLifespan: 30,
        energyCost: 6,
        description: 'Utility software. Low hype, high market impact.',
    },
    {
        id: 'dev_playground',
        name: 'Dev Playground',
        icon: '🧪',
        color: '#ec4899',
        demandPool: 60_000,
        baseRisk: 0.12,
        baseLifespan: 60, // Extreme retention
        energyCost: 12,
        description: 'APIs and frameworks. Very niche, extreme retention.',
    },
];

export function getSoftwareTypeById(id) {
    return SOFTWARE_TYPES.find(t => t.id === id);
}
