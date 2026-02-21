import React, { useState, useMemo } from 'react';
import useGameStore from '../store/gameStore.js';
import { SOFTWARE_TYPES } from '../simulation/softwareTypes.js';

function formatMoney(n) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${Math.round(n)}`;
}

// ── products Tab ──────────────────────────────────────────────────────────────
function ProductsList({ products, marketShare, trend }) {
    const [sortKey, setSortKey] = useState('revenue'); // revenue, rating, share

    const sorted = useMemo(() => {
        return [...products].sort((a, b) => { // High to low
            if (sortKey === 'revenue') return b.currentRevenue - a.currentRevenue;
            if (sortKey === 'rating') return b.rating - a.rating;
            if (sortKey === 'share') return b.marketShare - a.marketShare; // Note: player products don't store share individually, only corps do, but let's assume 0 for sorting mixed lists or update logic
            return 0;
        });
    }, [products, sortKey]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Filters/Sort */}
            <div className="flex gap-2 mb-2">
                {['revenue', 'rating', 'share'].map(k => (
                    <button
                        key={k}
                        onClick={() => setSortKey(k)}
                        style={{
                            fontSize: 10, padding: '4px 8px', borderRadius: 12, border: 'none',
                            background: sortKey === k ? 'var(--accent-blue)' : 'var(--bg-glass)',
                            color: sortKey === k ? 'white' : 'var(--text-muted)',
                            cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize'
                        }}
                    >
                        {k} ▼
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
                {sorted.map(p => {
                    const isPlayer = p.isPlayer;
                    const type = SOFTWARE_TYPES.find(t => t.id === p.softwareTypeId);
                    // Trend match calculation if needed for UI hint
                    // const isTrend = trend && trend.categoryBoosts[p.softwareTypeId] > 1;

                    return (
                        <div
                            key={p.id}
                            className="card"
                            style={{
                                background: isPlayer ? 'color-mix(in srgb, var(--accent-blue) 8%, var(--bg-glass))' : undefined,
                                border: isPlayer ? '1px solid var(--accent-blue-dim)' : undefined,
                                padding: '8px 10px',
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div style={{
                                        width: 3, height: 28, borderRadius: 2,
                                        background: isPlayer ? 'var(--accent-blue)' : (p.color || '#666')
                                    }} />
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: isPlayer ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                            {p.name}
                                        </div>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                            {p.owner || 'You'} · {type?.name}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-green)' }}>
                                        {formatMoney(p.currentRevenue)}<span style={{ fontSize: 9, opacity: 0.7 }}>/mo</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6, fontSize: 10, color: 'var(--text-muted)' }}>
                                        <span>⭐ {p.rating.toFixed(1)}</span>
                                        {/* Only show share if available (corps) */}
                                        {p.marketShare > 0 && <span>📊 {(p.marketShare * 100).toFixed(1)}%</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {sorted.length === 0 && (
                    <div className="text-center p-4 text-muted text-sm">No active products in the market.</div>
                )}
            </div>
        </div>
    );
}

// ── Rankings Tab ──────────────────────────────────────────────────────────────
function RankingsList({ playerShare, corporations, playerLifetimeRevenue, products, competitorProducts }) {
    // 🧮 Company Worth Calculation Helper
    const calculateWorth = (monthlyRev, lifetimeRev, share) => {
        // Worth = (1yr revenue) + (historical success) + (market equity value)
        return (monthlyRev * 12) + (lifetimeRev || 0) + (share * 5_000_000);
    };

    const corpStats = corporations.map(c => {
        const activeProds = competitorProducts.filter(p => p.ownerId === c.id);
        const monthlyRev = activeProds.reduce((sum, p) => sum + p.currentRevenue, 0);
        const activeShare = activeProds.reduce((sum, p) => sum + (p.marketShare || 0), 0);

        return {
            name: c.name,
            share: activeShare,
            revenue: monthlyRev,
            worth: calculateWorth(monthlyRev, c.lifetimeRevenue, activeShare),
            products: activeProds.length,
            color: c.color,
            isPlayer: false,
        };
    });

    const playerMonthlyRev = products.reduce((sum, p) => sum + p.currentRevenue, 0);
    const playerStats = {
        name: 'YOU',
        share: playerShare,
        revenue: playerMonthlyRev,
        worth: calculateWorth(playerMonthlyRev, playerLifetimeRevenue, playerShare),
        products: products.length,
        color: 'var(--accent-blue)',
        isPlayer: true,
    };

    const ranked = [playerStats, ...corpStats].sort((a, b) => b.worth - a.worth);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360, overflowY: 'auto', paddingRight: 6 }}>
            {ranked.map((entity, i) => (
                <div
                    key={entity.name}
                    className="card"
                    style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        background: entity.isPlayer ? 'color-mix(in srgb, var(--accent-blue) 10%, transparent)' : undefined,
                        border: entity.isPlayer ? '1px solid var(--accent-blue-dim)' : undefined,
                        padding: '10px 12px'
                    }}
                >
                    <div style={{
                        fontSize: 14, fontWeight: 800, color: 'var(--text-muted)',
                        width: 20, textAlign: 'center'
                    }}>
                        {i + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: entity.color }}>{entity.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                            {entity.products} Active · <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Worth: {formatMoney(entity.worth)}</span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{(entity.share * 100).toFixed(1)}%</div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{formatMoney(entity.revenue)}/mo</div>
                    </div>
                </div>
            ))}

            <div style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10, fontStyle: 'italic', paddingBottom: 10 }}>
                * Worth = (Rev × 12) + Lifetime + (Share Equity)
            </div>
        </div>
    );
}

// ── Main MarketWindow ─────────────────────────────────────────────────────────
export default function MarketWindow() {
    const trend = useGameStore(s => s.trend.data);
    const marketShare = useGameStore(s => s.marketShare);
    const corporations = useGameStore(s => s.corporations);
    const products = useGameStore(s => s.products); // Player products
    const competitorProducts = useGameStore(s => s.competitorProducts) || [];

    const [tab, setTab] = useState('products'); // products | rankings

    // Merge products for list
    const allProducts = [
        ...products.map(p => ({ ...p, isPlayer: true, owner: 'You', marketShare: 0 })),
        ...competitorProducts
    ];

    const lifetimeRevenue = useGameStore(s => s.lifetimeRevenue);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Active Trend Banner */}
            <div style={{
                padding: '10px 12px', borderRadius: 'var(--radius)',
                background: `linear-gradient(90deg, ${trend.color}22, transparent)`,
                border: `1px solid ${trend.color}44`,
                marginBottom: 12,
                flexShrink: 0,
            }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: trend.color, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Active Trend
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{trend.icon} {trend.name}</div>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Boosts: {Object.entries(trend.categoryBoosts).filter(([_, v]) => v > 1).map(([k]) => k.replace('_', ' ')).join(', ')}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
                <button
                    onClick={() => setTab('products')}
                    style={{
                        flex: 1, padding: '8px', fontSize: 11, fontWeight: 700,
                        background: 'transparent', border: 'none',
                        color: tab === 'products' ? 'var(--text-primary)' : 'var(--text-muted)',
                        borderBottom: tab === 'products' ? '2px solid var(--accent-blue)' : '2px solid transparent',
                        cursor: 'pointer'
                    }}
                >
                    🛒 Market Products
                </button>
                <button
                    onClick={() => setTab('rankings')}
                    style={{
                        flex: 1, padding: '8px', fontSize: 11, fontWeight: 700,
                        background: 'transparent', border: 'none',
                        color: tab === 'rankings' ? 'var(--text-primary)' : 'var(--text-muted)',
                        borderBottom: tab === 'rankings' ? '2px solid var(--accent-purple)' : '2px solid transparent',
                        cursor: 'pointer'
                    }}
                >
                    🏆 Global Rankings
                </button>
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                {tab === 'products' ? (
                    <ProductsList products={allProducts} marketShare={marketShare} trend={trend} />
                ) : (
                    <RankingsList
                        playerShare={marketShare}
                        corporations={corporations}
                        playerLifetimeRevenue={lifetimeRevenue}
                        products={products}
                        competitorProducts={competitorProducts}
                    />
                )}
            </div>
        </div>
    );
}
