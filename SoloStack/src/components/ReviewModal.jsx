import React, { useState } from 'react';
import useGameStore from '../store/gameStore.js';
import { SOFTWARE_TYPES } from '../simulation/softwareTypes.js';

// ─── Review Modal ─────────────────────────────────────────────────────────────
// Opens after a project finishes dev. Shows critic + player scores before publish.

function ScoreBar({ score, color }) {
    const pct = (score / 10) * 100;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <div style={{
                flex: 1, height: 8, borderRadius: 4,
                background: 'var(--bg-glass)', overflow: 'hidden',
            }}>
                <div style={{
                    height: '100%', borderRadius: 4,
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${color}99, ${color})`,
                    transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: `0 0 8px ${color}55`,
                }} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color, minWidth: 38, fontVariantNumeric: 'tabular-nums' }}>
                {score.toFixed(1)}
            </span>
        </div>
    );
}

function ImpactRow({ label, value, color, icon }) {
    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '7px 10px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)',
        }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{icon} {label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: color || 'var(--text-primary)' }}>{value}</span>
        </div>
    );
}

function formatMoney(n) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${Math.round(n)}`;
}

export default function ReviewModal() {
    const pendingReview = useGameStore(s => s.pendingReview);
    const publishProject = useGameStore(s => s.publishProject);
    const openWindow = useGameStore(s => s.openWindow);

    if (!pendingReview || !pendingReview.reviews) return null;

    const { id, name, softwareTypeId, reviews } = pendingReview;
    const {
        criticsScore = 0, criticsText = '',
        playerScore = 0, playerText = '',
        finalRating = 0,
        viralLabel = 'Unknown', failLabel = 'Unknown',
        revenueEstimateMin = 0, revenueEstimateMax = 0,
        trendLabel = 'Neutral', trendPercent = 0,
    } = reviews;

    const softType = SOFTWARE_TYPES.find(t => t.id === softwareTypeId);

    const handlePublish = () => {
        // Instant synchronous call
        publishProject(id);
        openWindow('products');
    };

    const finalColor = finalRating >= 8 ? 'var(--accent-green)'
        : finalRating >= 6.5 ? 'var(--accent-amber)'
            : 'var(--accent-pink)';

    const trendColor = trendPercent > 15 ? 'var(--accent-green)'
        : trendPercent > -5 ? 'var(--accent-amber)'
            : 'var(--accent-pink)';

    return (
        <div className="win-overlay" style={{ zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
            <div style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px 28px 24px',
                maxWidth: 480,
                width: '90vw',
                maxHeight: '85vh',
                overflowY: 'auto',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 22 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 }}>
                        📰 Early Reviews Are In
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                        "{name}"
                    </div>
                    {softType && (
                        <div style={{ fontSize: 12, color: softType.color, marginTop: 4 }}>
                            {softType.icon} {softType.name}
                        </div>
                    )}
                </div>

                {/* Critics */}
                <div style={{
                    padding: '16px', marginBottom: 12,
                    background: 'rgba(148, 163, 184, 0.06)', borderRadius: 'var(--radius)',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                        📰 Critics
                    </div>
                    <ScoreBar score={criticsScore} color="var(--accent-blue)" />
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 10, lineHeight: 1.6, fontStyle: 'italic' }}>
                        "{criticsText}"
                    </p>
                </div>

                {/* Players */}
                <div style={{
                    padding: '16px', marginBottom: 16,
                    background: 'rgba(124, 110, 247, 0.06)', borderRadius: 'var(--radius)',
                    border: '1px solid rgba(124, 110, 247, 0.15)',
                }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--accent-purple)', marginBottom: 8 }}>
                        👥 Players
                    </div>
                    <ScoreBar score={playerScore} color="var(--accent-purple)" />
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 10, lineHeight: 1.6, fontStyle: 'italic' }}>
                        "{playerText}"
                    </p>
                </div>

                {/* Combined Impact */}
                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
                        Combined Launch Impact
                    </div>

                    {/* Final rating hero */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 14px', borderRadius: 'var(--radius)',
                        background: `color-mix(in srgb, ${finalColor} 10%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${finalColor} 30%, transparent)`,
                        marginBottom: 8,
                    }}>
                        <div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Final Launch Rating</div>
                            <div style={{ fontSize: 26, fontWeight: 800, color: finalColor, lineHeight: 1.2 }}>
                                {finalRating.toFixed(1)}<span style={{ fontSize: 14, opacity: 0.6 }}>/10</span>
                            </div>
                        </div>
                        <div style={{ fontSize: 40 }}>
                            {finalRating >= 9 ? '🌟' : finalRating >= 8 ? '⭐' : finalRating >= 7 ? '👍' : finalRating >= 6 ? '😐' : '💀'}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <ImpactRow icon="🔥" label="Viral Potential" value={viralLabel}
                            color={viralLabel === 'Extreme' || viralLabel === 'High' ? 'var(--accent-amber)' : 'var(--text-secondary)'} />
                        <ImpactRow icon="⚠️" label="Stability" value={failLabel}
                            color={failLabel === 'High' ? 'var(--accent-pink)' : 'var(--accent-green)'} />
                        <ImpactRow icon="📈" label="Trend Match" value={`${trendLabel} (${trendPercent > 0 ? '+' : ''}${trendPercent}%)`}
                            color={trendPercent > 10 ? 'var(--accent-green)' : trendPercent > -10 ? 'var(--accent-amber)' : 'var(--accent-pink)'} />
                        <ImpactRow icon="💰" label="Expected Revenue"
                            value={`${formatMoney(revenueEstimateMin)} – ${formatMoney(revenueEstimateMax)}`}
                            color="var(--accent-green)" />
                    </div>
                </div>

                {/* Publish button */}
                <button
                    className="btn btn-primary w-full"
                    onClick={handlePublish}
                    style={{
                        fontSize: 14, fontWeight: 700, padding: '12px',
                        transition: 'all 0.3s ease',
                    }}
                >
                    🚀 Publish Software
                </button>

                <div style={{ textAlign: 'center', marginTop: 10, fontSize: 10, color: 'var(--text-muted)' }}>
                    Game paused. You must publish to continue.
                </div>
            </div>
        </div>
    );
}
