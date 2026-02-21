import React from 'react';
import useGameStore from '../store/gameStore.js';

// ─── Top Status Bar ──────────────────────────────────────────────────────────
// Shows player money, energy, fans, market share, month, and the active trend.

function formatMoney(n) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${Math.round(n)}`;
}

function formatFans(n) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
}

export default function TopBar() {
    const money = useGameStore(s => s.money);
    const fanbase = useGameStore(s => s.fanbase);
    const marketShare = useGameStore(s => s.marketShare);
    const month = useGameStore(s => s.month);
    const trend = useGameStore(s => s.trend);
    const trendMonthsLeft = useGameStore(s => s.trendMonthsLeft);
    const monthlyIncome = useGameStore(s => s.monthlyIncome);
    const projects = useGameStore(s => s.projects);
    const products = useGameStore(s => s.products);

    // Calculate energy used
    const { BASE_ENERGY_VAL } = { BASE_ENERGY_VAL: 60 };
    const safeProjects = projects || [];
    const safeProducts = products || [];

    const energyUsed = safeProjects.reduce((s, p) => {
        const costs = { productivity: 8, mobile_game: 10, saas_tool: 12, browser_ext: 5 };
        return s + (costs[p.softwareTypeId] || 8);
    }, 0) + safeProducts.length * 2;
    const energyLeft = Math.max(0, 60 - energyUsed);

    const trendData = trend?.data;
    const year = Math.floor((month - 1) / 12) + 1;
    const monthInYear = ((month - 1) % 12) + 1;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="top-bar">
            <span className="top-bar-logo">SoloStack</span>
            <div className="top-bar-sep" />

            <div className="top-bar-stat">
                <span className="emoji">💰</span>
                <span className="value" style={{ color: '#3ecf8e' }}>{formatMoney(money)}</span>
                {monthlyIncome > 0 && (
                    <span style={{ fontSize: 10, color: 'var(--accent-green)', opacity: 0.7 }}>
                        +{formatMoney(monthlyIncome)}/mo
                    </span>
                )}
            </div>

            <div className="top-bar-stat">
                <span className="emoji">⚡</span>
                <span className="value" style={{
                    color: energyLeft < 10 ? 'var(--accent-pink)' : energyLeft < 20 ? 'var(--accent-amber)' : 'var(--text-primary)'
                }}>
                    {energyLeft}/{60}
                </span>
            </div>

            <div className="top-bar-stat">
                <span className="emoji">👥</span>
                <span className="value">{formatFans(fanbase)}</span>
            </div>

            <div className="top-bar-stat">
                <span className="emoji">📊</span>
                <span className="value">{(marketShare * 100).toFixed(1)}%</span>
            </div>

            <div className="top-bar-sep" />

            <div className="top-bar-stat">
                <span className="emoji">📅</span>
                <span className="value">{monthNames[monthInYear - 1]} Y{year}</span>
            </div>

            {trendData && (
                <div className="top-bar-stat top-bar-trend">
                    <span className="emoji">{trendData.icon}</span>
                    <span className="value">{trendData.name}</span>
                    <span style={{ fontSize: 10, opacity: 0.6 }}>·{trendMonthsLeft}mo</span>
                </div>
            )}
        </div>
    );
}
