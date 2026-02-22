import fs from 'fs';

const TIER_META = {
    'cheap': { cost: 500, unlockThreshold: 0, devTime: 0.5 },
    'mid': { cost: 2500, unlockThreshold: 20000, devTime: 2.0 },
    'expensive': { cost: 10000, unlockThreshold: 250000, devTime: 5.0 },
};

const RISK_META = {
    'safe': { risk: -0.2, qualityBoost: 1.0, retentionBoost: 0.5, innovationBoost: 0 },
    'volatile': { risk: 0.2, qualityBoost: 0, retentionBoost: 0, innovationBoost: 1.5 },
    'dangerous': { risk: 0.5, qualityBoost: -0.5, retentionBoost: -1.0, innovationBoost: 3.0 },
};

const PILLARS_MAP = {
    'Concept': 'Ideation',
    'Design': 'Design',
    'Development': 'Development',
    'Marketing': 'Marketing'
};

const rawComponents = [
    // 🎮 INDIE HIT
    { n: 'Core Gameplay Hook', t: 'indie_hit', p: 'Concept', c: 'cheap', r: 'safe' },
    { n: 'Genre Mashup', t: 'indie_hit', p: 'Concept', c: 'mid', r: 'dangerous' },
    { n: 'Player Fantasy Focus', t: 'indie_hit', p: 'Design', c: 'cheap', r: 'safe' },
    { n: 'Game Feel Polish', t: 'indie_hit', p: 'Design', c: 'mid', r: 'safe' },
    { n: 'Stylized Art Direction', t: 'indie_hit', p: 'Design', c: 'mid', r: 'volatile' },
    { n: 'Custom Physics Tuning', t: 'indie_hit', p: 'Development', c: 'mid', r: 'volatile' },
    { n: 'Performance Lock', t: 'indie_hit', p: 'Development', c: 'cheap', r: 'safe' },
    { n: 'Streamer Bait', t: 'indie_hit', p: 'Marketing', c: 'expensive', r: 'dangerous' },
    { n: 'Demo Release', t: 'indie_hit', p: 'Marketing', c: 'mid', r: 'volatile' },
    { n: 'Community Challenges', t: 'indie_hit', p: 'Marketing', c: 'cheap', r: 'volatile' },

    // 📱 EVERYDAY APP
    { n: 'Daily Habit Hook', t: 'everyday_app', p: 'Concept', c: 'cheap', r: 'safe' },
    { n: 'Simple Value Promise', t: 'everyday_app', p: 'Concept', c: 'cheap', r: 'safe' },
    { n: 'Friendly UI', t: 'everyday_app', p: 'Design', c: 'cheap', r: 'safe' },
    { n: 'Personalization Touches', t: 'everyday_app', p: 'Design', c: 'mid', r: 'volatile' },
    { n: 'Fast Load Times', t: 'everyday_app', p: 'Development', c: 'cheap', r: 'safe' },
    { n: 'Low Battery Usage', t: 'everyday_app', p: 'Development', c: 'cheap', r: 'safe' },
    { n: 'Growth Loops', t: 'everyday_app', p: 'Marketing', c: 'expensive', r: 'dangerous' },
    { n: 'App Store Polish', t: 'everyday_app', p: 'Marketing', c: 'mid', r: 'safe' },
    { n: 'Influencer Lifestyle Push', t: 'everyday_app', p: 'Marketing', c: 'mid', r: 'volatile' },
    { n: 'Trend Riding Campaign', t: 'everyday_app', p: 'Marketing', c: 'expensive', r: 'dangerous' },

    // 💼 HUSTLE SAAS
    { n: 'Clear Business Problem', t: 'hustle_saas', p: 'Concept', c: 'cheap', r: 'safe' },
    { n: 'Subscription Strategy', t: 'hustle_saas', p: 'Concept', c: 'cheap', r: 'safe' },
    { n: 'Professional UI', t: 'hustle_saas', p: 'Design', c: 'cheap', r: 'safe' },
    { n: 'Dashboard Clarity', t: 'hustle_saas', p: 'Design', c: 'mid', r: 'safe' },
    { n: 'Scalable Backend', t: 'hustle_saas', p: 'Development', c: 'mid', r: 'safe' },
    { n: 'Data Reliability', t: 'hustle_saas', p: 'Development', c: 'cheap', r: 'safe' },
    { n: 'Security First', t: 'hustle_saas', p: 'Development', c: 'mid', r: 'safe' },
    { n: 'Cold Outreach', t: 'hustle_saas', p: 'Marketing', c: 'mid', r: 'volatile' },
    { n: 'Case Studies', t: 'hustle_saas', p: 'Marketing', c: 'cheap', r: 'safe' },
    { n: 'Enterprise Pitch Deck', t: 'hustle_saas', p: 'Marketing', c: 'expensive', r: 'volatile' },

    // 🧰 POWER TOOL
    { n: 'Power User Focus', t: 'power_tool', p: 'Concept', c: 'cheap', r: 'safe' },
    { n: 'Workflow Optimization', t: 'power_tool', p: 'Concept', c: 'cheap', r: 'safe' },
    { n: 'Dense Controls', t: 'power_tool', p: 'Design', c: 'mid', r: 'volatile' },
    { n: 'Custom Shortcuts', t: 'power_tool', p: 'Design', c: 'cheap', r: 'safe' },
    { n: 'Plugin Support', t: 'power_tool', p: 'Development', c: 'expensive', r: 'volatile' },
    { n: 'Precision Performance', t: 'power_tool', p: 'Development', c: 'mid', r: 'safe' },
    { n: 'Backward Compatibility', t: 'power_tool', p: 'Development', c: 'cheap', r: 'safe' },
    { n: 'Community Tutorials', t: 'power_tool', p: 'Marketing', c: 'cheap', r: 'safe' },
    { n: 'Pro Endorsements', t: 'power_tool', p: 'Marketing', c: 'mid', r: 'safe' },
    { n: 'Niche Events', t: 'power_tool', p: 'Marketing', c: 'mid', r: 'volatile' },

    // 🖥️ SYSTEM TOY
    { n: 'Solve One Annoyance', t: 'system_toy', p: 'Concept', c: 'cheap', r: 'safe' },
    { n: 'Always-On Utility', t: 'system_toy', p: 'Concept', c: 'cheap', r: 'safe' },
    { n: 'OS-Native Look', t: 'system_toy', p: 'Design', c: 'mid', r: 'safe' },
    { n: 'Minimal UI', t: 'system_toy', p: 'Design', c: 'cheap', r: 'safe' },
    { n: 'Low Resource Usage', t: 'system_toy', p: 'Development', c: 'cheap', r: 'safe' },
    { n: 'Deep System Hooks', t: 'system_toy', p: 'Development', c: 'expensive', r: 'dangerous' },
    { n: 'Rock-Solid Stability', t: 'system_toy', p: 'Development', c: 'mid', r: 'safe' },
    { n: 'Word of Mouth', t: 'system_toy', p: 'Marketing', c: 'cheap', r: 'safe' },
    { n: 'Tech Forum Buzz', t: 'system_toy', p: 'Marketing', c: 'mid', r: 'volatile' },
    { n: 'Utility Bundles', t: 'system_toy', p: 'Marketing', c: 'mid', r: 'safe' },

    // 🧪 DEV PLAYGROUND
    { n: 'Developer-First API', t: 'dev_playground', p: 'Concept', c: 'cheap', r: 'safe' },
    { n: 'Solve Dev Pain', t: 'dev_playground', p: 'Concept', c: 'cheap', r: 'safe' },
    { n: 'Readable Docs Style', t: 'dev_playground', p: 'Design', c: 'cheap', r: 'safe' },
    { n: 'Clear Examples', t: 'dev_playground', p: 'Design', c: 'cheap', r: 'safe' },
    { n: 'Rock-Solid API', t: 'dev_playground', p: 'Development', c: 'expensive', r: 'safe' },
    { n: 'Versioned Releases', t: 'dev_playground', p: 'Development', c: 'mid', r: 'safe' },
    { n: 'Performance Guarantees', t: 'dev_playground', p: 'Development', c: 'mid', r: 'safe' },
    { n: 'Open Source Teaser', t: 'dev_playground', p: 'Marketing', c: 'mid', r: 'volatile' },
    { n: 'Dev Evangelism', t: 'dev_playground', p: 'Marketing', c: 'mid', r: 'volatile' },
    { n: 'Community Contributions', t: 'dev_playground', p: 'Marketing', c: 'cheap', r: 'safe' }
];

const genId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '_').trim('_');

const componentsJsParams = rawComponents.map(rc => {
    const id = genId(rc.n);
    const tm = TIER_META[rc.c];
    const rm = RISK_META[rc.r];

    // Add marketing power if in marketing phase
    let marketingStr = rc.p === 'Marketing' ? ` marketingPower: ${Math.round((rm.qualityBoost || 1) * 2 + (rm.innovationBoost || 1) * 2 + 1.0)},` : '';
    let qual = Math.max(0, rm.qualityBoost + (rc.c === 'expensive' ? 1.5 : rc.c === 'mid' ? 0.8 : 0.2));
    let inn = Math.max(0, rm.innovationBoost + (rc.c === 'expensive' ? 1.0 : rc.c === 'mid' ? 0.3 : 0));
    let ret = Math.max(-1, rm.retentionBoost + (rc.c === 'expensive' ? 0.5 : 0.2));

    const tierSymbol = rc.c === 'cheap' ? '🟢' : rc.c === 'mid' ? '🟡' : '🔴';
    const riskSymbol = rc.r === 'safe' ? '🟦' : rc.r === 'volatile' ? '🟨' : '🟥';

    return `    { id: '${id}', name: '${rc.n}', exclusiveTo: '${rc.t}', pillar: '${PILLARS_MAP[rc.p]}', cost: ${tm.cost}, risk: ${rm.risk}, quality: ${parseFloat(qual.toFixed(1))}, innovation: ${parseFloat(inn.toFixed(1))}, retention: ${parseFloat(ret.toFixed(1))},${marketingStr} unlockThreshold: ${tm.unlockThreshold}, devTime: ${tm.devTime}, costTier: '${rc.c}', riskProfile: '${rc.r}', description: '${tierSymbol} ${riskSymbol} Software Specific Pattern.' },`;
});

const rawSynergies = [
    // INDIE HIT
    { id: 'indie_darling_new', label: '💖 Indie Darling', comps: ['core_gameplay_hook', 'game_feel_polish'], bonus: { playerScore: 1.5, fanGain: 2.0 }, desc: 'Core gameplay feels incredible. Fans love it.' },
    { id: 'clip_machine', label: '🎬 Clip Machine', comps: ['streamer_bait', 'genre_mashup'], bonus: { viralChance: 0.4, risk: 0.8 }, desc: 'Explosive viral potential, but high chance to backfire.' },
    { id: 'cult_classic', label: '🕯️ Cult Classic', comps: ['player_fantasy_focus', 'community_challenges'], bonus: { retention: 15.0 }, desc: 'They will play this for a decade.' },
    { id: 'silky_smooth', label: '🧈 Silky Smooth', comps: ['performance_lock', 'custom_physics_tuning'], bonus: { criticsScore: 1.0, quality: 3.0 }, desc: 'Technically flawless.' },

    // EVERYDAY APP
    { id: 'sticky_app', label: '🍯 Sticky App', comps: ['daily_habit_hook', 'friendly_ui'], bonus: { retention: 20.0 }, desc: 'They open it every single morning.' },
    { id: 'growth_flywheel', label: '🎡 Growth Flywheel', comps: ['growth_loops', 'app_store_polish'], bonus: { marketShareGain: 3.0, lifespan: -12 }, desc: 'Explosive growth but burns out fast.' },
    { id: 'trend_chaser', label: '🌊 Trend Chaser', comps: ['trend_riding_campaign', 'influencer_lifestyle_push'], bonus: { fanGain: 4.0, risk: 0.5 }, desc: 'Massive short term hype, high failure risk.' },

    // HUSTLE SAAS
    { id: 'money_printer', label: '🖨️ Money Printer', comps: ['clear_business_problem', 'subscription_strategy'], bonus: { revenueMultiplier: 2.0 }, desc: 'Perfect product-market fit. Prints cash.' },
    { id: 'enterprise_lock_in', label: '🏢 Enterprise Lock-In', comps: ['security_first', 'enterprise_pitch_deck'], bonus: { lifespan: 48, marketingPower: -2.0 }, desc: 'Boring, hidden, but they never cancel.' },
    { id: 'trust_builder', label: '🤝 Trust Builder', comps: ['data_reliability', 'case_studies'], bonus: { criticsScore: 1.5 }, desc: 'A proven track record.' },

    // POWER TOOL
    { id: 'pro_favorite', label: '👑 Pro Favorite', comps: ['workflow_optimization', 'custom_shortcuts'], bonus: { retention: 25.0 }, desc: 'Crucial for their daily work.' },
    { id: 'ecosystem_tool', label: '🌍 Ecosystem Tool', comps: ['plugin_support', 'community_tutorials'], bonus: { lifespan: 60, marketShareGain: 2.0 }, desc: 'The community builds the tool for you.' },
    { id: 'industry_standard', label: '🏛️ Industry Standard', comps: ['precision_performance', 'pro_endorsements'], bonus: { criticsScore: 2.0, marketShareGain: 5.0 }, desc: 'Nobody gets fired for buying this.' },

    // SYSTEM TOY
    { id: 'invisible_essential', label: '👻 Invisible Essential', comps: ['always_on_utility', 'low_resource_usage'], bonus: { lifespan: 50 }, desc: 'Runs in the background forever.' },
    { id: 'power_user_secret', label: '🤫 Power User Secret', comps: ['deep_system_hooks', 'tech_forum_buzz'], bonus: { marketShareGain: 4.0, risk: 0.4 }, desc: 'High hype in niche circles.' },
    { id: 'built_in_feel', label: '🪟 Built-In Feel', comps: ['os_native_look', 'minimal_ui'], bonus: { fanGain: 1.5, quality: 2.0 }, desc: 'Feels like the OS made it.' },

    // DEV PLAYGROUND
    { id: 'dev_love', label: '❤️ Dev Love', comps: ['solve_dev_pain', 'clear_examples'], bonus: { fanGain: 2.0, marketShareGain: 1.5 }, desc: 'Developer goodwill goes a long way.' },
    { id: 'trust_stack', label: '🧱 Trust Stack', comps: ['rock_solid_api', 'versioned_releases'], bonus: { lifespan: 80, retention: 30.0 }, desc: 'Unshakeable foundational tech.' },
    { id: 'ecosystem_engine', label: '⚙️ Ecosystem Engine', comps: ['open_source_teaser', 'community_contributions'], bonus: { viralChance: 0.2, marketingPower: 5.0 }, desc: 'Network effects take over.' }
];

const synergiesJsParams = rawSynergies.map(rs => {
    return `    { id: '${rs.id}', label: '${rs.label}', components: ${JSON.stringify(rs.comps)}, bonus: ${JSON.stringify(rs.bonus).replace(/"([^"]+)":/g, '$1:')}, description: '${rs.desc}' },`;
});

let code = fs.readFileSync('./src/simulation/components.js', 'utf8');

// Insert components before the last ]; of COMPONENTS
let compIndex = code.indexOf('];', code.indexOf('export const COMPONENTS ='));
let newCode = code.slice(0, compIndex) + '\n    // --- SOFTWARE SPECIFIC COMPONENTS ---\n' + componentsJsParams.join('\n') + '\n' + code.slice(compIndex);

// Insert synergies before the last ]; of SYNERGIES
let synIndex = newCode.indexOf('];', newCode.indexOf('export const SYNERGIES ='));
newCode = newCode.slice(0, synIndex) + '\n    // --- SOFTWARE SPECIFIC SYNERGIES ---\n' + synergiesJsParams.join('\n') + '\n' + newCode.slice(synIndex);

fs.writeFileSync('./src/simulation/components.js', newCode);
console.log('Successfully injected 60 software-specific components and 19 explicit synergies.');
