import React from 'react';
import useGameStore from '../store/gameStore.js';
import { SOFTWARE_TYPES } from '../simulation/softwareTypes.js';

function RatingStars({ rating }) {
    const full = Math.floor(rating);
    return (
        <span className="rating-stars">
            {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="rating-star" style={{ opacity: i < full ? 1 : 0.2 }}>★</span>
            ))}
            <span className="rating-number">{rating.toFixed(1)}</span>
        </span>
    );
}

function formatMoney(n) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${Math.round(n)}`;
}

export default function ProductsWindow() {
    const products = useGameStore(s => s.products);
    const archiveProduct = useGameStore(s => s.archiveProduct);

    if (products.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>No released products yet.<br />Release a project to start earning!</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {products.map(product => {
                const type = SOFTWARE_TYPES.find(t => t.id === product.softwareTypeId);
                const lifePercent = (product.monthsLive / product.maxMonths) * 100;
                const healthPercent = Math.max(0, 100 - lifePercent);
                const healthColor = healthPercent > 60 ? 'green' : healthPercent > 30 ? 'amber' : 'pink';

                return (
                    <div key={product.id} className="card" style={{
                        border: product.isViral ? '1px solid var(--accent-amber)' : undefined,
                    }}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-8">
                                <span style={{ fontSize: 18 }}>{type?.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {product.name}
                                        {product.isViral && <span className="tag amber">🔥 Viral</span>}
                                    </div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{type?.name}</div>
                                </div>
                            </div>
                            <button className="btn btn-danger btn-sm" onClick={() => archiveProduct(product.id)} title="Archive">
                                📦
                            </button>
                        </div>

                        <RatingStars rating={product.rating} />

                        <div className="grid-2" style={{ marginTop: 10, gap: 8 }}>
                            <div style={{ padding: '8px 10px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Monthly</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-green)' }}>
                                    {formatMoney(product.currentRevenue)}
                                </div>
                            </div>
                            <div style={{ padding: '8px 10px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Lifetime</div>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>
                                    {formatMoney(product.lifetimeRevenue)}
                                </div>
                            </div>
                        </div>

                        {/* Health / Lifespan */}
                        <div style={{ marginTop: 10 }}>
                            <div className="flex justify-between text-sm mb-8" style={{ marginBottom: 4 }}>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Product Health</span>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Month {product.monthsLive}/{product.maxMonths}</span>
                            </div>
                            <div className="progress-bar">
                                <div className={`progress-fill ${healthColor}`} style={{ width: `${healthPercent}%` }} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
