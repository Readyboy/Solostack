import React from 'react';
import useGameStore from '../store/gameStore.js';
import { SOFTWARE_TYPES } from '../simulation/softwareTypes.js';
import { WIN_REVENUE, WIN_MARKET_SHARE, WIN_CATEGORY_DOMINATION } from '../simulation/constants.js';

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

function Stat({ label, value, color }) {
    return (
        <div style={{ padding: '12px 14px', background: 'var(--bg-glass)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: color || 'var(--text-primary)' }}>{value}</div>
        </div>
    );
}

export default function StatsWindow() {
    const money = useGameStore(s => s.money);
    const fanbase = useGameStore(s => s.fanbase);
    const marketShare = useGameStore(s => s.marketShare);
    const lifetimeRevenue = useGameStore(s => s.lifetimeRevenue);
    const totalReleases = useGameStore(s => s.totalReleases);
    const products = useGameStore(s => s.products);
    const archive = useGameStore(s => s.archive);
    const month = useGameStore(s => s.month);

    const topProduct = [...products, ...archive].sort((a, b) => b.rating - a.rating)[0];

    // Win progress
    const revenueProgress = Math.min(1, lifetimeRevenue / WIN_REVENUE);
    const shareProgress = Math.min(1, marketShare / WIN_MARKET_SHARE);
    const dominatedCats = SOFTWARE_TYPES.filter(type =>
        products.some(p => p.softwareTypeId === type.id && p.rating >= 8)
    ).length;
    const domProgress = dominatedCats / WIN_CATEGORY_DOMINATION;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Key stats grid */}
            <div className="grid-2">
                <Stat label="💰 Total Worth" value={formatMoney(money)} color="var(--accent-green)" />
                <Stat label="👥 Fanbase" value={formatFans(fanbase)} color="var(--accent-purple)" />
                <Stat label="📦 Total Releases" value={totalReleases} />
                <Stat label="📅 Month" value={month} />
                <Stat label="💵 Lifetime Revenue" value={formatMoney(lifetimeRevenue)} color="var(--accent-amber)" />
                <Stat label="📊 Market Share" value={`${(marketShare * 100).toFixed(1)}%`} color="var(--accent-blue)" />
            </div>

            {topProduct && (
                <div style={{ padding: '12px 14px', background: 'var(--accent-amber-dim)', borderRadius: 'var(--radius)', border: '1px solid rgba(245,158,11,0.3)' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>🏆 Best Product</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{topProduct.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--accent-amber)' }}>⭐ {topProduct.rating.toFixed(1)}/10 · {formatMoney(topProduct.lifetimeRevenue)} lifetime</div>
                </div>
            )}

            {/* Win Condition Progress */}
            <div>
                <p className="section-header">🏆 Victory Progress</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                        { label: '💰 Revenue King', desc: `${formatMoney(lifetimeRevenue)} / ${formatMoney(WIN_REVENUE)}`, progress: revenueProgress, color: 'var(--accent-green)' },
                        { label: '📊 Market Dominator', desc: `${(marketShare * 100).toFixed(1)}% / ${WIN_MARKET_SHARE * 100}%`, progress: shareProgress, color: 'var(--accent-purple)' },
                        { label: '👑 Category Dominator', desc: `${dominatedCats}/${WIN_CATEGORY_DOMINATION} categories dominated`, progress: domProgress, color: 'var(--accent-amber)' },
                    ].map(({ label, desc, progress, color }) => (
                        <div key={label}>
                            <div className="flex justify-between text-sm mb-8" style={{ marginBottom: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{desc}</span>
                            </div>
                            <div className="progress-bar" style={{ height: 6 }}>
                                <div style={{ height: '100%', borderRadius: 3, transition: 'width 0.6s ease', width: `${progress * 100}%`, background: color }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-muted)' }}>
                    Tip: Categories are dominated by having a product with rating ≥8 there.
                </div>
            </div>
        </div>
    );
}
