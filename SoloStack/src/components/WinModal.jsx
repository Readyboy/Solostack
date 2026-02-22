import React from 'react';
import useGameStore from '../store/gameStore.js';

export default function WinModal() {
    const winState = useGameStore(s => s.winState);
    const acknowledgeWin = useGameStore(s => s.acknowledgeWin);
    const newGame = useGameStore(s => s.newGame);

    if (!winState) return null;

    return (
        <div className="win-overlay" style={{
            background: 'rgba(21, 19, 26, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0
        }}>
            <div className="window" style={{
                maxWidth: 480,
                width: '90vw',
                padding: '40px 30px',
                textAlign: 'center',
                animation: 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                background: 'var(--bg-panel)',
                border: '2px solid var(--border-accent)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.4), 0 0 80px var(--accent-purple-glow)'
            }}>
                <div style={{ fontSize: 72, marginBottom: 20, filter: 'drop-shadow(0 0 12px var(--accent-warm))' }}>🏆</div>

                <div className="section-header" style={{ color: 'var(--accent-warm)', marginBottom: 10 }}>
                    Achievement Unlocked
                </div>

                <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, letterSpacing: -0.2 }}>
                    {winState.title}
                </h2>

                <p style={{
                    fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6,
                    marginBottom: 24, padding: '0 10px', opacity: 0.9
                }}>
                    {winState.message}
                </p>

                <div style={{
                    padding: '12px 16px', background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                    fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 28,
                    fontStyle: 'italic', opacity: 0.8
                }}>
                    "The world is built one line at a time. <br />You've certainly written yours."
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button className="btn btn-primary" style={{ padding: '12px 24px' }} onClick={acknowledgeWin}>
                        Continue My Journey
                    </button>
                    <button className="btn btn-sm" style={{ opacity: 0.6 }} onClick={newGame}>
                        Start Over
                    </button>
                </div>
            </div>
        </div>
    );
}
