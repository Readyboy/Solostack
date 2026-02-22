// ─── Component System (V4: Massive Expansion) ──────────────────────────────────
// 120 components total. Money-locked based on lifetime revenue.

export const PILLARS = ['Ideation', 'Design', 'Development', 'Marketing'];

export const PILLAR_CAPACITY = {
    Ideation: 2,
    Design: 3,
    Development: 3,
    Marketing: 2,
};

export const COMPONENTS = [
    // 🧠 CONCEPT PHASE (20 Components)
    { id: 'clear_idea', name: 'Clear Idea', pillar: 'Ideation', icon: '👁️', cost: 100, risk: -0.1, quality: 0.8, innovation: 0.2, retention: 0.4, unlockThreshold: 0, description: '🟢 Simple, focused vision. Low risk.' },
    { id: 'copy_works', name: 'Copy What Works', pillar: 'Ideation', icon: '📋', cost: 150, risk: -0.2, quality: 0.6, innovation: -0.5, retention: 0.2, unlockThreshold: 0, description: '🟢 Follow the leaders. Safest bet.' },
    { id: 'small_focused', name: 'Small but Focused', pillar: 'Ideation', icon: '🔍', cost: 200, risk: -0.1, quality: 0.7, innovation: 0.1, retention: 0.5, unlockThreshold: 0, description: '🟢 Do one thing well.' },
    { id: 'scratch_itch', name: 'Scratch My Own Itch', pillar: 'Ideation', icon: '🩹', cost: 250, risk: 0, quality: 0.5, innovation: 0.8, retention: 1.0, unlockThreshold: 0, description: '🟢 Solve your own problem.' },
    { id: 'mvp_thinking', name: 'MVP Thinking', pillar: 'Ideation', icon: '📦', cost: 300, risk: 0.1, quality: 0.4, innovation: 1.2, retention: -0.2, unlockThreshold: 0, description: '🟢 Ship fast. Minimum viable product.' },

    { id: 'trend_surfing', name: 'Trend Surfing', pillar: 'Ideation', icon: '🌊', cost: 800, risk: 0.1, quality: 0.4, innovation: 1.0, marketingPower: 1.5, unlockThreshold: 5000, description: '🟡 Ride the current hype wave.' },
    { id: 'audience_persona', name: 'Audience Persona', pillar: 'Ideation', icon: '👥', cost: 1200, risk: -0.05, quality: 1.2, innovation: 0, retention: 2.0, unlockThreshold: 10000, description: '🟡 Design for a specific person.' },
    { id: 'market_gap', name: 'Market Gap Hunting', pillar: 'Ideation', icon: '🕳️', cost: 1500, risk: 0.2, quality: 0.8, innovation: 1.5, marketingPower: 1.0, unlockThreshold: 15000, description: '🟡 Find where others aren\'t looking.' },
    { id: 'feature_first', name: 'Feature First Thinking', pillar: 'Ideation', icon: '🏗️', cost: 1100, risk: 0.05, quality: 1.0, innovation: 0.8, retention: 0.5, unlockThreshold: 20000, description: '🟡 Functionality above all else.' },
    { id: 'monetization_angle', name: 'Monetization Angle', pillar: 'Ideation', icon: '💰', cost: 1800, risk: 0.1, revenueMultiplier: 1.5, innovation: -0.2, unlockThreshold: 25000, description: '🟡 Focused on the bottom line.' },
    { id: 'long_term_roadmap', name: 'Long-Term Roadmap', pillar: 'Ideation', icon: '📅', cost: 2000, risk: -0.1, quality: 1.5, innovation: 0, retention: 1.2, unlockThreshold: 35000, description: '🟡 Planning for the next two years.' },
    { id: 'data_decisions', name: 'Data-Inspired Decisions', pillar: 'Ideation', icon: '📊', cost: 2500, risk: -0.15, quality: 1.2, innovation: 0.2, retention: 1.8, unlockThreshold: 50000, description: '🟡 Numbers don\'t lie.' },
    { id: 'competitive_benchmark', name: 'Competitive Benchmark', pillar: 'Ideation', icon: '🏁', cost: 1400, risk: -0.1, quality: 1.0, innovation: -0.2, marketingPower: 0.8, unlockThreshold: 65000, description: '🟡 Stay ahead of the competition.' },

    { id: 'risky_innovation', name: 'Risky Innovation Bet', pillar: 'Ideation', icon: '🎲', cost: 4000, risk: 0.4, quality: 0, innovation: 4.0, marketingPower: 2.0, unlockThreshold: 100000, description: '🔴 All in on something new. Volatile.' },
    { id: 'power_user_obsession', name: 'Power User Obsession', pillar: 'Ideation', icon: '👑', cost: 5000, risk: 0.1, quality: 2.0, innovation: 0.5, retention: 4.0, unlockThreshold: 250000, description: '🔴 Niche, but they never leave.' },
    { id: 'casual_appeal', name: 'Casual Mass Appeal', pillar: 'Ideation', icon: '🍭', cost: 6000, risk: 0.2, quality: 1.0, marketingPower: 5.0, innovation: 0.2, unlockThreshold: 500000, description: '🔴 Something for everyone.' },
    { id: 'community_vision', name: 'Community-Driven Vision', pillar: 'Ideation', icon: '🤝', cost: 7500, risk: -0.05, quality: 2.5, retention: 5.0, innovation: 1.0, unlockThreshold: 1000000, description: '🔴 The users run the roadmap.' },
    { id: 'bold_rebrand', name: 'Bold Rebrand Concept', pillar: 'Ideation', icon: '🎭', cost: 9000, risk: 0.3, quality: 1.5, marketingPower: 8.0, innovation: 2.0, unlockThreshold: 2500000, description: '🔴 Complete identity shift.' },
    { id: 'disrupt_market', name: 'Disrupt the Market', pillar: 'Ideation', icon: '💣', cost: 15000, risk: 0.5, quality: 3.0, innovation: 6.0, marketingPower: 4.0, unlockThreshold: 10000000, description: '🔴 Turn the industry upside down.' },
    { id: 'moonshot_idea', name: 'Moonshot Idea', pillar: 'Ideation', icon: '🚀', cost: 50000, risk: 0.6, quality: 5.0, innovation: 15.0, marketingPower: 10.0, unlockThreshold: 100000000, description: '🔴 Change the world or go bust.' },

    // 🎨 DESIGN PHASE (40 Components)
    // 🟢 CHEAP
    { id: 'clean_look', name: 'Clean Look', pillar: 'Design', icon: '✨', cost: 100, risk: -0.05, quality: 0.5, unlockThreshold: 0, description: '🟢 Professional but basic.' },
    { id: 'simple_smooth', name: 'Simple & Smooth', pillar: 'Design', icon: '🧈', cost: 150, risk: -0.05, quality: 0.3, retention: 0.5, unlockThreshold: 0, description: '🟢 No frictions.' },
    { id: 'minimalist_style', name: 'Minimalist Style', pillar: 'Design', icon: '⚪', cost: 200, risk: -0.1, quality: 0.4, innovation: 0.6, unlockThreshold: 0, description: '🟢 Less is more.' },
    { id: 'clear_nav', name: 'Clear Navigation', pillar: 'Design', icon: '🗺️', cost: 120, risk: -0.1, quality: 0.2, retention: 0.6, unlockThreshold: 0, description: '🟢 Don\'t let them get lost.' },
    { id: 'friendly_empty', name: 'Friendly Empty States', pillar: 'Design', icon: '🏜️', cost: 80, risk: 0, quality: 0.1, retention: 0.3, unlockThreshold: 0, description: '🟢 Nice when empty.' },
    { id: 'bright_mode', name: 'Bright Mode Polish', pillar: 'Design', icon: '☀️', cost: 50, risk: 0, quality: 0.2, marketingPower: 0.1, unlockThreshold: 0, description: '🟢 Standard light theme.' },
    { id: 'dark_mode', name: 'Dark Mode Ready', pillar: 'Design', icon: '🌙', cost: 150, risk: 0, quality: 0.4, retention: 0.2, unlockThreshold: 0, description: '🟢 Essential for techies.' },
    { id: 'visual_feedback', name: 'Visual Feedback', pillar: 'Design', icon: '🔘', cost: 300, risk: -0.05, quality: 0.6, retention: 0.4, unlockThreshold: 1000, description: '🟢 Buttons that feel like buttons.' },
    { id: 'icon_consistency', name: 'Icon Consistency', pillar: 'Design', icon: '📏', cost: 250, risk: -0.1, quality: 0.8, unlockThreshold: 2000, description: '🟢 Unified visual language.' },
    { id: 'spacing_cleanup', name: 'Spacing Cleanup', pillar: 'Design', icon: '↔️', cost: 100, risk: -0.05, quality: 0.4, unlockThreshold: 3000, description: '🟢 Give the UI room to breathe.' },

    // 🟡 MID-COST
    { id: 'brand_vibes', name: 'Brand Vibes', pillar: 'Design', icon: '🎨', cost: 800, risk: 0, quality: 1.0, marketingPower: 1.5, unlockThreshold: 5000, description: '🟡 A distinct visual persona.' },
    { id: 'design_system', name: 'Design System', pillar: 'Design', icon: '💅', cost: 1500, risk: -0.2, quality: 2.0, innovation: -0.2, unlockThreshold: 12000, description: '🟡 Reusable tokens and components.' },
    { id: 'accessibility_pass', name: 'Accessibility Pass', pillar: 'Design', icon: '♿', cost: 1200, risk: -0.1, quality: 1.5, retention: 1.0, unlockThreshold: 18000, description: '🟡 Inclusive for everyone.' },
    { id: 'mobile_layout', name: 'Mobile-Friendly Layout', pillar: 'Design', icon: '📱', cost: 2000, risk: 0, quality: 1.0, retention: 2.0, unlockThreshold: 25000, description: '🟡 Works on every screen.' },
    { id: 'juicy_animations', name: 'Juicy Animations', pillar: 'Design', icon: '💥', cost: 1400, risk: 0.05, quality: 0.8, innovation: 1.2, marketingPower: 1.0, unlockThreshold: 35000, description: '🟡 Bouncy, alive, and fun.' },
    { id: 'micro_interactions', name: 'Micro-Interactions', pillar: 'Design', icon: '🤏', cost: 1100, risk: 0, quality: 1.2, retention: 0.8, unlockThreshold: 45000, description: '🟡 Tiny details that delight.' },
    { id: 'sound_feedback', name: 'Sound Feedback', pillar: 'Design', icon: '🔊', cost: 900, risk: 0.05, quality: 1.0, innovation: 0.5, unlockThreshold: 55000, description: '🟡 Audio cues for actions.' },
    { id: 'loading_states', name: 'Smooth Loading States', pillar: 'Design', icon: '⏳', cost: 700, risk: -0.1, quality: 0.5, retention: 1.2, unlockThreshold: 65000, description: '🟡 No jarring spinners.' },
    { id: 'theme_support', name: 'Theme Support', pillar: 'Design', icon: '🌈', cost: 1800, risk: 0.1, quality: 1.5, marketingPower: 1.2, unlockThreshold: 80000, description: '🟡 Customization for users.' },
    { id: 'user_testing', name: 'User Testing Sessions', pillar: 'Design', icon: '🧪', cost: 2500, risk: -0.2, quality: 2.5, retention: 1.0, unlockThreshold: 100000, description: '🟡 Real feedback on the UX.' },

    // 🔴 EXPENSIVE
    { id: 'playful_ui', name: 'Playful UI', pillar: 'Design', icon: '🎈', cost: 4000, risk: 0.3, quality: 1.5, innovation: 2.0, marketingPower: 2.5, unlockThreshold: 150000, description: '🔴 Unconventional and bold.' },
    { id: 'experimental_layout', name: 'Experimental Layout', pillar: 'Design', icon: '🌀', cost: 5000, risk: 0.4, quality: 1.0, innovation: 4.0, unlockThreshold: 250000, description: '🔴 Challenging common patterns.' },
    { id: 'radical_redesign', name: 'Radical Redesign', pillar: 'Design', icon: '🧨', cost: 8000, risk: 0.5, quality: 3.0, innovation: 5.0, marketingPower: 3.0, unlockThreshold: 500000, description: '🔴 High risk identity shift.' },
    { id: 'personality_copy', name: 'Personality-Driven Copy', pillar: 'Design', icon: '✍️', cost: 3500, risk: 0.2, quality: 1.2, marketingPower: 3.5, unlockThreshold: 750000, description: '🔴 Speaking to the user directly.' },
    { id: 'custom_icons', name: 'Custom Icon Pack', pillar: 'Design', icon: '🖋️', cost: 6000, risk: 0.1, quality: 4.0, marketingPower: 2.0, unlockThreshold: 1000000, description: '🔴 Bespoke visual assets.' },
    { id: 'delightful_errors', name: 'Delightful Errors', pillar: 'Design', icon: '😅', cost: 3000, risk: 0.1, quality: 1.5, retention: 2.0, unlockThreshold: 1500000, description: '🔴 Making failures feel okay.' },
    { id: 'easter_eggs', name: 'Easter Eggs', pillar: 'Design', icon: '🥚', cost: 4500, risk: 0.2, innovation: 2.5, marketingPower: 4.0, unlockThreshold: 2500000, description: '🔴 Hidden secrets for fans.' },
    { id: 'motion_heavy', name: 'Motion-Heavy UI', pillar: 'Design', icon: '🎞️', cost: 12000, risk: 0.3, quality: 5.0, innovation: 3.0, marketingPower: 2.0, unlockThreshold: 5000000, description: '🔴 Cinematic interface feel.' },
    { id: 'visual_refresh', name: 'Visual Refresh Update', pillar: 'Design', icon: '🆕', cost: 15000, risk: 0.2, quality: 6.0, marketingPower: 5.0, unlockThreshold: 10000000, description: '🔴 Full layer of fresh paint.' },
    { id: 'ab_ui_exp', name: 'A/B UI Experiments', pillar: 'Design', icon: '🅰️', cost: 20000, risk: -0.1, quality: 4.0, retention: 8.0, unlockThreshold: 25000000, description: '🔴 Optimizing every pixel.' },

    // 🔴 LATE GAME DESIGN POWER
    { id: 'pro_ux_review', name: 'Pro UX Review', pillar: 'Design', icon: '🧐', cost: 25000, risk: -0.2, quality: 10.0, unlockThreshold: 50000000, description: '🔴 Expert level polish.' },
    { id: 'design_qa', name: 'Design QA Pass', pillar: 'Design', icon: '🔍', cost: 18000, risk: -0.3, quality: 5.0, retention: 3.0, unlockThreshold: 75000000, description: '🔴 No pixel out of place.' },
    { id: 'brand_overhaul', name: 'Brand Overhaul', pillar: 'Design', icon: '👑', cost: 50000, risk: 0.3, quality: 8.0, marketingPower: 15.0, unlockThreshold: 100000000, description: '🔴 Industry defining look.' },
    { id: 'premium_feel', name: 'Premium Feel Pass', pillar: 'Design', icon: '💎', cost: 40000, risk: 0, quality: 15.0, marketingPower: 5.0, unlockThreshold: 150000000, description: '🔴 The peak of software craft.' },
    { id: 'visual_identity_lock', name: 'Visual Identity Lock-In', pillar: 'Design', icon: '🔒', cost: 35000, risk: -0.4, quality: 10.0, marketingPower: 10.0, unlockThreshold: 200000000, description: '🔴 Unshakeable brand recognition.' },
    { id: 'design_debt_cleanup', name: 'Design Debt Cleanup', pillar: 'Design', icon: '🧹', cost: 20000, risk: -0.5, quality: 5.0, retention: 5.0, unlockThreshold: 250000000, description: '🔴 Simplifying legacy chaos.' },
    { id: 'interface_simplification', name: 'Interface Simplification', pillar: 'Design', icon: '➖', cost: 30000, risk: -0.1, quality: 8.0, retention: 10.0, unlockThreshold: 300000000, description: '🔴 The art of doing more with less.' },
    { id: 'exp_polish_sprint', name: 'Experience Polish Sprint', pillar: 'Design', icon: '🏃', cost: 25000, risk: 0, quality: 12.0, unlockThreshold: 350000000, description: '🔴 Intense focus on delight.' },
    { id: 'long_term_ux', name: 'Long-Term UX Stability', pillar: 'Design', icon: '🏛️', cost: 60000, risk: -0.6, quality: 20.0, retention: 15.0, unlockThreshold: 400000000, description: '🔴 Designed to bridge generations.' },
    { id: 'signature_look', name: 'Signature Look', pillar: 'Design', icon: '✍️', cost: 100000, risk: 0.1, quality: 30.0, marketingPower: 25.0, unlockThreshold: 500000000, description: '🔴 You define the era\'s aesthetic.' },

    // 🛠️ DEVELOPMENT PHASE (40 Components)
    // 🟢 CHEAP
    { id: 'basic_stack', name: 'Basic Stack', pillar: 'Development', icon: '📦', cost: 100, risk: -0.05, quality: 0.4, unlockThreshold: 0, description: '🟢 Simple and reliable tools.' },
    { id: 'stable_deps', name: 'Stable Dependencies', pillar: 'Development', icon: '🔗', cost: 150, risk: -0.1, quality: 0.2, retention: 0.4, unlockThreshold: 0, description: '🟢 Avoiding the latest, buggy beta.' },
    { id: 'bug_squash', name: 'Bug Squash Week', pillar: 'Development', icon: '🐞', cost: 200, risk: -0.3, quality: 0.1, retention: 0.6, unlockThreshold: 0, description: '🟢 Fix the obvious stuff.' },
    { id: 'error_handling', name: 'Error Handling', pillar: 'Development', icon: '🛡️', cost: 250, risk: -0.15, quality: 0.5, unlockThreshold: 0, description: '🟢 No more white screen of death.' },
    { id: 'logging_system', name: 'Logging System', pillar: 'Development', icon: '📜', cost: 120, risk: -0.1, innovation: 0.2, unlockThreshold: 0, description: '🟢 Know what\'s going wrong.' },
    { id: 'performance_basics', name: 'Performance Basics', pillar: 'Development', icon: '⚡', cost: 300, risk: -0.05, quality: 0.6, retention: 0.4, unlockThreshold: 1000, description: '🟢 It doesn\'t feel slow.' },
    { id: 'manual_testing', name: 'Manual Testing', pillar: 'Development', icon: '👤', cost: 50, risk: -0.2, quality: 0.2, unlockThreshold: 2000, description: '🟢 Just click around for an hour.' },
    { id: 'simple_arch', name: 'Simple Architecture', pillar: 'Development', icon: '🏚️', cost: 150, risk: -0.1, quality: 0.4, unlockThreshold: 3000, description: '🟢 Easy to manage, hard to break.' },
    { id: 'refactor_later', name: 'Refactor Later', pillar: 'Development', icon: '🏗️', cost: 50, risk: 0.2, innovation: 0.8, retention: -0.5, unlockThreshold: 4000, description: '🟢 Tech debt now, ship today.' },
    { id: 'crash_recovery', name: 'Crash Recovery', pillar: 'Development', icon: '🚑', cost: 400, risk: -0.25, quality: 1.0, unlockThreshold: 5000, description: '🟢 Restart right where you left off.' },

    // 🟡 MID-COST
    { id: 'modular_code', name: 'Modular Code', pillar: 'Development', icon: '🧩', cost: 1200, risk: -0.1, quality: 1.5, innovation: 0.5, unlockThreshold: 8000, description: '🟡 Separation of concerns.' },
    { id: 'performance_pass', name: 'Performance Pass', pillar: 'Development', icon: '🚀', cost: 1500, risk: 0, quality: 1.0, innovation: 1.5, retention: 1.5, unlockThreshold: 15000, description: '🟡 Optimization sprint.' },
    { id: 'auto_tests', name: 'Auto Tests', pillar: 'Development', icon: '🧪', cost: 2500, risk: -0.4, quality: 1.2, retention: 2.0, unlockThreshold: 25000, description: '🟡 Automated safety net.' },
    { id: 'ci_cd_pipeline', name: 'CI/CD Pipeline', pillar: 'Development', icon: '🔄', cost: 2000, risk: -0.2, innovation: 1.0, marketingPower: 0.5, unlockThreshold: 35000, description: '🟡 Automated shipping.' },
    { id: 'monitoring_tools', name: 'Monitoring Tools', pillar: 'Development', icon: '📡', cost: 1800, risk: -0.3, quality: 0.8, retention: 1.5, unlockThreshold: 45000, description: '🟡 Real-time error tracking.' },
    { id: 'load_optimization', name: 'Load Time Optimization', pillar: 'Development', icon: '⌛', cost: 1100, risk: 0, quality: 0.5, innovation: 1.0, retention: 2.0, unlockThreshold: 55000, description: '🟡 Get to the first byte faster.' },
    { id: 'caching_layer', name: 'Caching Layer', pillar: 'Development', icon: '🧊', cost: 2200, risk: 0.1, quality: 1.5, innovation: 0.5, retention: 2.5, unlockThreshold: 70000, description: '🟡 Lightning fast data access.' },
    { id: 'db_optimization', name: 'Database Optimization', pillar: 'Development', icon: '🗄️', cost: 2800, risk: -0.05, quality: 2.0, retention: 3.0, unlockThreshold: 85000, description: '🟡 Solid back-end foundation.' },
    { id: 'feature_flags', name: 'Feature Flags', pillar: 'Development', icon: '🚩', cost: 1400, risk: -0.1, innovation: 1.2, marketingPower: 1.0, unlockThreshold: 100000, description: '🟡 Controlled rollouts.' },
    { id: 'deploy_scripts', name: 'Deployment Scripts', pillar: 'Development', icon: '📜', cost: 900, risk: -0.2, quality: 0.5, unlockThreshold: 125000, description: '🟡 No more manual uploading.' },

    // 🔴 EXPENSIVE
    { id: 'experimental_tech', name: 'Experimental Tech', pillar: 'Development', icon: '☢️', cost: 6000, risk: 0.5, quality: 0, innovation: 6.0, marketingPower: 2.0, unlockThreshold: 200000, description: '🔴 Unproven but cutting edge.' },
    { id: 'bleeding_edge', name: 'Bleeding Edge Stack', pillar: 'Development', icon: '🧛', cost: 8000, risk: 0.6, quality: 2.0, innovation: 10.0, unlockThreshold: 500000, description: '🔴 If it works, it\'s magic.' },
    { id: 'rapid_iteration', name: 'Rapid Iteration', pillar: 'Development', icon: '🎡', cost: 5000, risk: 0.3, quality: 1.0, innovation: 4.0, retention: 2.0, unlockThreshold: 750000, description: '🔴 Moving at warp speed.' },
    { id: 'hacky_workarounds', name: 'Hacky Workarounds', pillar: 'Development', icon: '🩹', cost: 3000, risk: 0.4, innovation: 3.0, quality: -1.0, unlockThreshold: 1000000, description: '🔴 Clever hacks, high debt.' },
    { id: 'plugin_system', name: 'Plugin System', pillar: 'Development', icon: '🔌', cost: 10000, risk: 0.2, quality: 2.0, retention: 10.0, unlockThreshold: 2000000, description: '🔴 Infinite extensibility.' },
    { id: 'auto_scaling', name: 'Auto Scaling', pillar: 'Development', icon: '📈', cost: 15000, risk: 0.1, quality: 3.0, retention: 15.0, unlockThreshold: 5000000, description: '🔴 Grows with your userbase.' },
    { id: 'multi_region', name: 'Multi-Region Setup', pillar: 'Development', icon: '🌍', cost: 25000, risk: 0.1, quality: 5.0, retention: 10.0, unlockThreshold: 10000000, description: '🔴 Global availability.' },
    { id: 'offline_support', name: 'Offline Support', pillar: 'Development', icon: '✈️', cost: 12000, risk: 0.3, quality: 2.0, retention: 12.0, unlockThreshold: 20000000, description: '🔴 Work anywhere, anytime.' },
    { id: 'security_audit', name: 'Security Audit', pillar: 'Development', icon: '🔐', cost: 20000, risk: -0.6, quality: 10.0, retention: 5.0, unlockThreshold: 35000000, description: '🔴 Unbreakable fortress.' },
    { id: 'infra_upgrade', name: 'Infrastructure Upgrade', pillar: 'Development', icon: '🏗️', cost: 30000, risk: -0.1, quality: 8.0, retention: 20.0, unlockThreshold: 50000000, description: '🔴 Rebuilding the core for scale.' },

    // 🔴 LATE GAME ENGINEERING
    { id: 'enterprise_stability', name: 'Enterprise Stability Pass', pillar: 'Development', icon: '🏛️', cost: 60000, risk: -0.7, quality: 15.0, retention: 15.0, unlockThreshold: 75000000, description: '🔴 Bank-grade reliability.' },
    { id: 'tech_debt_cleanup', name: 'Tech Debt Cleanup', pillar: 'Development', icon: '🧹', cost: 40000, risk: -0.5, quality: 10.0, retention: 10.0, unlockThreshold: 100000000, description: '🔴 Fixing what we broke in year one.' },
    { id: 'perf_audit', name: 'Performance Audit', pillar: 'Development', icon: '🩺', cost: 35000, risk: -0.1, quality: 12.0, innovation: 10.0, unlockThreshold: 150000000, description: '🔴 Finding every nanosecond.' },
    { id: 'scale_overhaul', name: 'Scalability Overhaul', pillar: 'Development', icon: '⚖️', cost: 80000, risk: -0.2, quality: 15.0, retention: 30.0, unlockThreshold: 200000000, description: '🔴 Preparing for the billionth user.' },
    { id: 'reliability_guarantee', name: 'Reliability Guarantee', pillar: 'Development', icon: '📑', cost: 100000, risk: -0.8, quality: 25.0, retention: 25.0, unlockThreshold: 250000000, description: '🔴 99.999% uptime promise.' },
    { id: 'lts_mode', name: 'Long-Term Support Mode', pillar: 'Development', icon: '🦕', cost: 50000, risk: -0.9, quality: 10.0, retention: 40.0, unlockThreshold: 300000000, description: '🔴 Built to last a decade.' },
    { id: 'zero_downtime', name: 'Zero-Downtime Deploys', pillar: 'Development', icon: '☁️', cost: 45000, risk: -0.2, quality: 8.0, retention: 15.0, unlockThreshold: 350000000, description: '🔴 Updates that go unnoticed.' },
    { id: 'disaster_recovery', name: 'Disaster Recovery Plan', pillar: 'Development', icon: '🔥', cost: 70000, risk: -1.0, quality: 20.0, unlockThreshold: 400000000, description: '🔴 Surviving the apocalypse.' },
    { id: 'core_rewrite', name: 'Core Rewrite', pillar: 'Development', icon: '🖍️', cost: 150000, risk: 0.6, quality: 40.0, innovation: 20.0, unlockThreshold: 450000000, description: '🔴 Starting again from scratch.' },
    { id: 'bulletproof_stack', name: 'Bulletproof Stack', pillar: 'Development', icon: '🛡️', cost: 200000, risk: -1.5, quality: 60.0, retention: 60.0, unlockThreshold: 500000000, description: '🔴 The ultimate engineering feat.' },

    // 📣 MARKETING PHASE (20 Components)
    // 🟢 CHEAP
    { id: 'soft_launch', name: 'Soft Launch', pillar: 'Marketing', icon: '🎈', cost: 100, risk: -0.1, marketingPower: 0.5, retention: 0.2, unlockThreshold: 0, description: '🟢 Quiet release. Safe.' },
    { id: 'devlogs', name: 'Devlogs', pillar: 'Marketing', icon: '📝', cost: 200, risk: 0, marketingPower: 1.0, retention: 0.8, unlockThreshold: 0, description: '🟢 Build in public.' },
    { id: 'changelog_posts', name: 'Changelog Posts', pillar: 'Marketing', icon: '🪵', cost: 50, risk: 0, quality: 0.5, retention: 1.0, unlockThreshold: 0, description: '🟢 Show them what changed.' },
    { id: 'community_discord', name: 'Community Discord', pillar: 'Marketing', icon: '💬', cost: 300, risk: 0.1, marketingPower: 0.5, retention: 2.0, unlockThreshold: 0, description: '🟢 A home for your fans.' },
    { id: 'social_posts', name: 'Social Media Posts', pillar: 'Marketing', icon: '🐦', cost: 150, risk: 0.05, marketingPower: 1.5, unlockThreshold: 0, description: '🟢 Shout into the void.' },

    // 🟡 MID-COST
    { id: 'hype_trailer', name: 'Hype Trailer', pillar: 'Marketing', icon: '🎬', cost: 1500, risk: 0.1, marketingPower: 4.0, innovation: 0.5, unlockThreshold: 10000, description: '🟡 Cinematic energy.' },
    { id: 'influencer_dms', name: 'Influencer DMs', pillar: 'Marketing', icon: '✉️', cost: 1200, risk: 0.2, marketingPower: 5.0, unlockThreshold: 25000, description: '🟡 Direct outreach to creators.' },
    { id: 'feature_teasers', name: 'Feature Teasers', pillar: 'Marketing', icon: '👀', cost: 800, risk: 0.05, marketingPower: 2.5, retention: 1.0, unlockThreshold: 40000, description: '🟡 Show, don\'t tell.' },
    { id: 'press_outreach', name: 'Press Outreach', pillar: 'Marketing', icon: '📰', cost: 2500, risk: 0.1, marketingPower: 6.0, quality: 0.5, unlockThreshold: 60000, description: '🟡 Getting industry attention.' },
    { id: 'launch_countdown', name: 'Launch Countdown', pillar: 'Marketing', icon: '⏲️', cost: 1000, risk: 0.05, marketingPower: 3.5, innovation: 0.2, unlockThreshold: 85000, description: '🟡 Building anticipation.' },

    // 🔴 EXPENSIVE / RISKY
    { id: 'hard_launch', name: 'Hard Launch', pillar: 'Marketing', icon: '🧨', cost: 5000, risk: 0.4, marketingPower: 15.0, retention: -2.0, unlockThreshold: 150000, description: '🔴 All eyes on day one. Volatile.' },
    { id: 'paid_ads', name: 'Paid Ads', pillar: 'Marketing', icon: '💰', cost: 10000, risk: 0.1, marketingPower: 10.0, unlockThreshold: 500000, description: '🔴 Buying your way to the top.' },
    { id: 'meme_marketing', name: 'Meme Marketing', pillar: 'Marketing', icon: '🤡', cost: 3000, risk: 0.5, marketingPower: 25.0, quality: -2.0, unlockThreshold: 1000000, description: '🔴 High virality, low dignity.' },
    { id: 'brand_partnerships', name: 'Brand Partnerships', pillar: 'Marketing', icon: '🤝', cost: 15000, risk: 0.05, marketingPower: 12.0, quality: 3.0, unlockThreshold: 5000000, description: '🔴 Working with the big players.' },
    { id: 'event_showcase', name: 'Event Showcase', pillar: 'Marketing', icon: '🎪', cost: 25000, risk: 0.2, marketingPower: 20.0, innovation: 5.0, unlockThreshold: 10000000, description: '🔴 Stage presence.' },
    { id: 'referral_program', name: 'Referral Program', pillar: 'Marketing', icon: '🔄', cost: 12000, risk: 0.1, marketingPower: 5.0, retention: 15.0, unlockThreshold: 25000000, description: '🔴 Users bringing users.' },
    { id: 'early_access', name: 'Early Access Program', pillar: 'Marketing', icon: '🔑', cost: 10000, risk: 0.3, quality: 1.0, retention: 20.0, marketingPower: 2.0, unlockThreshold: 50000000, description: '🔴 Community testing.' },
    { id: 'aso_optimization', name: 'App Store Optimization', pillar: 'Marketing', icon: '📈', cost: 8000, risk: -0.1, marketingPower: 8.0, unlockThreshold: 100000000, description: '🔴 Gaming the algorithms.' },
    { id: 'relaunch_campaign', name: 'Relaunch Campaign', pillar: 'Marketing', icon: '♻️', cost: 40000, risk: 0.2, marketingPower: 30.0, quality: 10.0, unlockThreshold: 250000000, description: '🔴 Fix the name, fix the game.' },
    { id: 'viral_stunt', name: 'Viral Stunt', pillar: 'Marketing', icon: '🔥', cost: 100000, risk: 0.7, marketingPower: 100.0, quality: -5.0, unlockThreshold: 500000000, description: '🔴 Break the internet or your bank.' },
];

export const SYNERGIES = [
    { id: 'indie_darling', label: '💖 Indie Darling', components: ['clear_idea', 'devlogs'], bonus: { quality: 1.5, marketingPower: 1.2 }, description: 'Authentic development build loyal hype.' },
    { id: 'hype_machine', label: '🚀 Hype Machine', components: ['brand_vibes', 'influencer_dms'], bonus: { viralChance: 0.2, marketingPower: 2.0 }, description: 'Strong identity meets direct promotion.' },
    { id: 'rock_solid', label: '🛡️ Rock Solid', components: ['bug_squash', 'modular_code', 'auto_tests'], bonus: { risk: -0.5, quality: 2.0 }, description: 'High-tier reliability and testing.' },
    { id: 'market_disruptor', label: '💣 Market Disruptor', components: ['disrupt_market', 'experimental_tech', 'viral_stunt'], bonus: { innovation: 10.0, marketingPower: 5.0 }, description: 'Terrifying levels of industry noise.' },
    { id: 'data_driven_scale', label: '⚖️ Data-Driven Scale', components: ['data_decisions', 'auto_scaling', 'monitoring_tools'], bonus: { retention: 5.0, revenueMultiplier: 1.3 }, description: 'Scaling efficiently through metric analysis.' },
    { id: 'mobile_powerhouse', label: '📱 Mobile Powerhouse', components: ['mobile_layout', 'aso_optimization', 'referral_program'], bonus: { marketingPower: 3.0, retention: 4.0 }, description: 'The ultimate mobile growth stack.' },
    { id: 'cult_status', label: '🕯️ Cult Status', components: ['scratch_itch', 'community_discord', 'easter_eggs'], bonus: { retention: 10.0, fanGain: 2.5 }, description: 'They will follow you to the moon.' },
    { id: 'corporate_giant', label: '🏢 Corporate Giant', components: ['enterprise_stability', 'brand_partnerships', 'long_term_roadmap'], bonus: { revenueMultiplier: 2.5, lifespan: 60 }, description: 'B2B dominance and decade-long planning.' },
    { id: 'speed_demon', label: '🏃 Speed Demon', components: ['refactor_later', 'rapid_iteration', 'hard_launch'], bonus: { devTimeMultiplier: 0.4, innovation: 2.0 }, description: 'Zero friction, zero safety, maximum speed.' },
    { id: 'perfectionist', label: '💎 Perfectionist', components: ['pro_ux_review', 'design_qa', 'premium_feel'], bonus: { quality: 25.0, marketingPower: 1.5 }, description: 'There is simply no competition in craft.' },
];

export function getComponentById(id) {
    return COMPONENTS.find(c => c.id === id);
}

export function getActiveComponents(selectedIds) {
    return selectedIds.map(getComponentById).filter(Boolean);
}

export function detectSynergies(selectedIds) {
    return SYNERGIES.filter(s => s.components.every(id => selectedIds.includes(id)));
}
