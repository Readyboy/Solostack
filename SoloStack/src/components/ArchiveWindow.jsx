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
                <div className="empty-icon">🗂️</div>
                <p>The archive is empty.<br />Old projects' retirement home stays here.</p>
            </div>
        );
    }

    const totalArchiveRevenue = archive.reduce((s, p) => s + p.lifetimeRevenue, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '12px 14px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 12.5 }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>Total archived revenue: </span>
                <span style={{ fontWeight: 600, color: 'var(--accent-green)', fontFamily: 'var(--font-numeric)' }}>{formatMoney(totalArchiveRevenue)}</span>
                <span style={{ color: 'var(--text-muted)' }}> · {archive.length} products</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 400, overflowY: 'auto', paddingRight: 4 }}>
                {[...archive].reverse().map(product => {
                    const type = SOFTWARE_TYPES.find(t => t.id === product.softwareTypeId);
                    const isPlayer = product.ownerName === 'YOU';
                    return (
                        <div key={product.id} className="card" style={{
                            opacity: 0.9,
                            borderLeft: isPlayer ? '3px solid var(--accent-blue)' : '2px solid var(--border-strong)'
                        }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-10" style={{ flex: 1 }}>
                                    <span style={{ fontSize: 20 }}>{type?.icon}</span>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 13, color: isPlayer ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                            {product.name}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                                            By <span style={{ color: isPlayer ? 'var(--accent-blue)' : 'var(--text-secondary)', fontWeight: 500 }}>{product.ownerName}</span> · {type?.name}
                                        </div>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-numeric)' }}>
                                            ⭐ {product.rating.toFixed(1)} · {product.monthsLive}mo live · <span style={{ color: 'var(--accent-pink)', opacity: 0.8, fontWeight: 500 }}>{product.archiveReason || 'Retired'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', minWidth: 90 }}>
                                    <div style={{ fontWeight: 600, fontSize: 13, color: 'linear-gradient(45deg, var(--accent-green), var(--text-primary))', color: 'var(--accent-green)', fontFamily: 'var(--font-numeric)' }}>
                                        {formatMoney(product.lifetimeRevenue)}
                                    </div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-numeric)', opacity: 0.7 }}>M{product.archivedAt} Archive</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
