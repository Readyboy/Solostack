import React, { useState, useEffect } from 'react';
import useGameStore from '../store/gameStore.js';
import { SOFTWARE_TYPES } from '../simulation/softwareTypes.js';
import { playSound } from '../utils/soundManager.js';

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
                    backgroundColor: color,
                    backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))`,
                    transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: `0 0 12px ${color === 'var(--accent)' ? 'var(--accent-purple-glow)' : 'rgba(255,255,255,0.1)'}`,
                }} />
            </div>
            <span style={{ fontSize: 24, fontWeight: 600, color, minWidth: 44, textAlign: 'right', fontFamily: 'var(--font-numeric)', fontVariantNumeric: 'tabular-nums' }}>
                {score.toFixed(1)}
            </span>
        </div>
    );
}

function ImpactRow({ label, value, color, icon }) {
    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)',
        }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{icon} {label}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: color || 'var(--text-primary)', fontFamily: 'var(--font-numeric)' }}>{value}</span>
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
    const isMuted = useGameStore(s => s.isMuted);

    useEffect(() => {
        playSound('money', isMuted);
    }, []);

    if (!pendingReview || !pendingReview.reviews) return null;

    const { id, name, softwareTypeId, reviews } = pendingReview;
    const {
        criticsScore = 0, criticsText = '',
        playerScore = 0, playerText = '',
        finalRating = 0,
        viralChance = 0,
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
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div className="section-header" style={{ color: 'var(--accent-warm)', marginBottom: 10, textAlign: 'center' }}>📰 Early Buzz</div>
                    <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: -0.2 }}>
                        "{name}"
                    </div>
                    {softType && (
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, fontWeight: 600 }}>
                            {softType.icon} {softType.name}
                        </div>
                    )}
                </div>

                {/* Critics */}
                <div style={{
                    padding: '18px', marginBottom: 14,
                    background: 'var(--bg-glass)', borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
                        🖋️ The Critics
                    </div>
                    <ScoreBar score={criticsScore} color="var(--accent-blue)" />
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12, lineHeight: 1.7, fontStyle: 'italic', opacity: 0.9 }}>
                        "{criticsText}"
                    </p>
                </div>

                {/* Players */}
                <div style={{
                    padding: '18px', marginBottom: 20,
                    background: 'var(--accent-purple-dim)', borderRadius: 'var(--radius)',
                    border: '1px solid var(--border-accent)',
                }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>
                        ☕ The Community
                    </div>
                    <ScoreBar score={playerScore} color="var(--accent)" />
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12, lineHeight: 1.7, fontStyle: 'italic', opacity: 0.9 }}>
                        "{playerText}"
                    </p>
                </div>

                {/* Combined Impact */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
                        Final Launch Outlook
                    </div>

                    {/* Final rating hero */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 18px', borderRadius: 'var(--radius)',
                        background: `color-mix(in srgb, ${finalColor} 8%, var(--bg-glass))`,
                        border: `1px solid color-mix(in srgb, ${finalColor} 25%, transparent)`,
                        marginBottom: 10,
                    }}>
                        <div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: 0.5 }}>VERDICT</div>
                            <div style={{ fontSize: 32, fontWeight: 600, color: finalColor, lineHeight: 1, letterSpacing: -1, fontFamily: 'var(--font-numeric)' }}>
                                {finalRating.toFixed(1)}<span style={{ fontSize: 18, opacity: 0.4, fontWeight: 400 }}>/10</span>
                            </div>
                        </div>
                        <div style={{ fontSize: 44, filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.2))' }}>
                            {finalRating >= 9 ? '🌟' : finalRating >= 8 ? '⭐' : finalRating >= 7 ? '👍' : finalRating >= 6 ? '😐' : '💀'}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <ImpactRow icon="🔥" label="Viral Potential" value={viralLabel}
                            color={viralChance > 0.2 ? 'var(--accent-amber)' : 'var(--text-secondary)'} />
                        <ImpactRow icon="🕯️" label="Software Stability" value={failLabel}
                            color={failLabel === 'High' ? 'var(--accent-pink)' : 'var(--accent-green)'} />
                        <ImpactRow icon="🌊" label="Trend Alignment" value={`${trendLabel} (${trendPercent > 0 ? '+' : ''}${trendPercent}%)`}
                            color={trendPercent > 10 ? 'var(--accent-green)' : trendPercent > -10 ? 'var(--accent-amber)' : 'var(--accent-pink)'} />
                        <ImpactRow icon="🎁" label="Est. Monthly Gain"
                            value={`${formatMoney(revenueEstimateMin)} – ${formatMoney(revenueEstimateMax)}`}
                            color="var(--accent-green)" />
                    </div>
                </div>

                {/* Publish button */}
                <button
                    className="btn btn-primary w-full"
                    onClick={handlePublish}
                    style={{
                        padding: '16px', borderRadius: 'var(--radius)',
                        fontSize: 16, fontWeight: 600,
                        transition: 'all 0.3s ease',
                    }}
                >
                    ✨ Publish
                </button>

                <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                    Software is safe in your local repo. <br />Publish to go live! 🚀
                </div>
            </div>
        </div>
    );
}
