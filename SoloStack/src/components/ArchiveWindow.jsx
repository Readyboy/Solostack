import React from 'react';
import useGameStore from '../store/gameStore.js';
import { SOFTWARE_TYPES } from '../simulation/softwareTypes.js';

function formatMoney(n) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${Math.round(n)}`;
}

export default function ArchiveWindow() {
    const archive = useGameStore(s => s.archive);

    if (archive.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">🗄️</div>
                <p>No archived products yet.<br />Archive products from the Products window to retire them.</p>
            </div>
        );
    }

    const totalArchiveRevenue = archive.reduce((s, p) => s + p.lifetimeRevenue, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '10px 12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 12 }}>
                <span className="text-muted">Total archived revenue: </span>
                <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>{formatMoney(totalArchiveRevenue)}</span>
                <span className="text-muted"> · {archive.length} products</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 400, overflowY: 'auto', paddingRight: 4 }}>
                {[...archive].reverse().map(product => {
                    const type = SOFTWARE_TYPES.find(t => t.id === product.softwareTypeId);
                    const isPlayer = product.ownerName === 'YOU';
                    return (
                        <div key={product.id} className="card" style={{
                            opacity: 0.85,
                            borderLeft: isPlayer ? '3px solid var(--accent-blue)' : '2px solid var(--text-muted)'
                        }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-8" style={{ flex: 1 }}>
                                    <span style={{ fontSize: 20 }}>{type?.icon}</span>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: isPlayer ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                            {product.name}
                                        </div>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                            Owner: <span style={{ color: isPlayer ? 'var(--accent-blue)' : 'var(--text-secondary)', fontWeight: 600 }}>{product.ownerName}</span> · {type?.name}
                                        </div>
                                        <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>
                                            ⭐ {product.rating.toFixed(1)} · {product.monthsLive}m live · <span style={{ color: 'var(--accent-pink)' }}>{product.archiveReason || 'Retired'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', minWidth: 80 }}>
                                    <div style={{ fontWeight: 800, fontSize: 12, color: 'var(--accent-green)' }}>
                                        {formatMoney(product.lifetimeRevenue)}
                                    </div>
                                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>M{product.archivedAt} Archive</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
