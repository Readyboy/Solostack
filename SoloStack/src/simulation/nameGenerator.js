// ─── Product Name Generator ──────────────────────────────────────────────────
// Generates realistic names for AI competitor products based on category.

const PREFIXES = [
    'Nova', 'Apex', 'Core', 'Pulse', 'Vertex', 'Nimbus', 'Echo', 'Zen', 'Atlas', 'Quantum',
    'Hyper', 'Cyber', 'Omni', 'Flux', 'Strata', 'Vector', 'Orbit', 'Prism', 'Aero', 'Lumina',
    'Synapse', 'Velocity', 'Titan', 'Fusion', 'Spark', 'Meta', 'Iron', 'Crystal', 'Shadow', 'Frost'
];

const SUFFIXES_GENERIC = [
    'System', 'Works', 'Labs', 'Soft', 'Tech', 'Net', 'Ware', 'Hub', 'Box', 'Base', 'Flow'
];

const SUFFIXES_BY_TYPE = {
    mobile_game: ['Legends', 'Quest', 'Saga', 'Rush', 'Clash', 'Run', 'Tycoon', 'Battle', 'Heroes', 'Tap', 'Go', 'World', 'City', 'Farm', 'Puzzle'],
    productivity: ['Pro', 'Focus', 'Task', 'Note', 'Plan', 'Docs', 'Sheets', 'Mind', 'List', 'Cal', 'Space', 'Deck', 'Mail'],
    saas_tool: ['Analytics', 'Desk', 'CRM', 'Sales', 'Force', 'Host', 'Cloud', 'Deploy', 'Monitor', 'Guard', 'Scale', 'Track', 'Bot'],
    browser_ext: ['Saver', 'Block', 'Pass', 'Clip', 'Mate', 'Helper', 'Quick', 'Cast', 'Search', 'Find', 'View', 'Scout', 'Pick'],
};

export function generateProductName(ownerName, softwareTypeId, releaseCount) {
    const typeSuffixes = SUFFIXES_BY_TYPE[softwareTypeId] || SUFFIXES_GENERIC;

    // 60% chance of creative name, 40% chance of iterative corporate name
    const isCreative = Math.random() < 0.6;

    if (isCreative) {
        const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
        const suffix = typeSuffixes[Math.floor(Math.random() * typeSuffixes.length)];
        // Ensure name is different from prefix (avoid Nova Nova)
        return `${prefix} ${suffix}`;
    } else {
        // "MegaSoft Note 4"
        const suffix = typeSuffixes[Math.floor(Math.random() * typeSuffixes.length)];
        return `${ownerName} ${suffix} ${releaseCount + 1}`;
    }
}
