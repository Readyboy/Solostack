import React, { useState, useRef } from 'react';
import useGameStore from '../store/gameStore.js';

const THEMES = [
    { id: 'purple', name: 'Cozy Purple 🌙', color: '#8b7cf6', bg: 'rgba(139, 124, 246, 0.12)', hover: '#7a6be5' },
    { id: 'amber', name: 'Warm Amber ☕', color: '#f5b97a', bg: 'rgba(245, 185, 122, 0.12)', hover: '#e5a86a' },
    { id: 'green', name: 'Soft Green 🌱', color: '#7dd3a8', bg: 'rgba(125, 211, 168, 0.1)', hover: '#6cc297' },
    { id: 'peach', name: 'Sunset Peach 🌅', color: '#e07a7a', bg: 'rgba(224, 122, 122, 0.1)', hover: '#d06a6a' },
    { id: 'blue', name: 'Night Blue 🌌', color: '#7ec7e8', bg: 'rgba(126, 199, 232, 0.1)', hover: '#6db6d7' },
];

const BACKGROUNDS = [
    { id: 'default', name: 'Classic OS', css: 'radial-gradient(circle at 10% 10%, rgba(139, 124, 246, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(245, 185, 122, 0.08) 0%, transparent 40%)' },
    { id: 'sunset', name: 'Evening Loft', css: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
    { id: 'night', name: 'Solo Coffee', css: 'linear-gradient(to bottom, #0d0d12, #15131a)' },
    { id: 'forest', name: 'Quiet Woods', css: 'linear-gradient(180deg, #15131a 0%, #1a2e24 100%)' },
];

export default function SetupScreen() {
    const completeSetup = useGameStore(s => s.completeSetup);

    const [studioName, setStudioName] = useState('');
    const [osTheme, setOsTheme] = useState('purple');
    const [desktopBackground, setDesktopBackground] = useState('default');
    const [customBg, setCustomBg] = useState(null);
    const fileInputRef = useRef(null);

    const activeTheme = THEMES.find(t => t.id === osTheme);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCustomBg(event.target.result);
                setDesktopBackground('custom');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStart = () => {
        const finalName = studioName.trim() || 'My Studio';
        const finalBg = desktopBackground === 'custom' ? customBg : desktopBackground;

        completeSetup({
            studioName: finalName,
            osTheme,
            desktopBackground: finalBg
        });
    };

    return (
        <div className="setup-overlay" style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'var(--bg-base)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', overflowY: 'auto', padding: 20,
            animation: 'fadeIn 0.6s ease'
        }}>
            <div className="setup-modal" style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-xl)',
                padding: '40px 48px',
                maxWidth: 520,
                width: '100%',
                boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
                animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
                {/* 1. THE GOAL */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h1 style={{ fontSize: 32, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
                        Welcome to SoloStack
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                        You're a solo developer with a laptop and a dream.<br />
                        Build apps, ship hits, and climb to the top of the market.
                    </p>
                    <div style={{
                        display: 'inline-block', padding: '6px 16px', borderRadius: 20,
                        background: 'var(--bg-glass)', border: '1px solid var(--border)',
                        fontSize: 13, fontWeight: 500, color: activeTheme.color
                    }}>
                        🎯 Your goal: Become the #1 software studio.
                    </div>
                </div>

                {/* 2. IDENTITY */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
                        Studio Identity
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="My Indie Studio"
                            maxLength={12}
                            value={studioName}
                            onChange={(e) => setStudioName(e.target.value)}
                            style={{
                                width: '100%', padding: '14px 18px', borderRadius: 'var(--radius)',
                                background: 'var(--bg-glass)', border: `1px solid ${studioName ? activeTheme.color : 'var(--border)'}`,
                                color: 'var(--text-primary)', fontSize: 16, outline: 'none',
                                transition: 'all 0.2s ease',
                                fontFamily: 'var(--font-ui)'
                            }}
                        />
                        <div style={{
                            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                            fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-numeric)'
                        }}>
                            {studioName.length} / 12
                        </div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, fontStyle: 'italic' }}>
                        "Short names look best on the OS."
                    </div>
                </div>

                {/* 3. PERSONALIZATION */}
                <div style={{ marginBottom: 36 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
                        Personalize Your OS
                    </div>

                    {/* Backgrounds */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>Desktop Background</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                            {BACKGROUNDS.map(bg => (
                                <button
                                    key={bg.id}
                                    onClick={() => setDesktopBackground(bg.id)}
                                    title={bg.name}
                                    style={{
                                        aspectRatio: '1', borderRadius: 8, border: desktopBackground === bg.id ? `2px solid ${activeTheme.color}` : '1px solid var(--border)',
                                        background: bg.css, cursor: 'pointer', transition: 'all 0.2s ease',
                                        padding: 0, overflow: 'hidden'
                                    }}
                                />
                            ))}
                            <button
                                onClick={() => fileInputRef.current.click()}
                                style={{
                                    aspectRatio: '1', borderRadius: 8, border: desktopBackground === 'custom' ? `2px solid ${activeTheme.color}` : '1px solid var(--border)',
                                    background: customBg ? `url(${customBg}) center/cover` : 'var(--bg-glass)',
                                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    gap: 4, transition: 'all 0.2s ease', padding: 4
                                }}
                            >
                                <span style={{ fontSize: 14 }}>{customBg ? '🖼️' : '📤'}</span>
                                <span style={{ fontSize: 8, display: customBg ? 'none' : 'block' }}>Upload</span>
                            </button>
                            <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>

                    {/* Themes */}
                    <div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>Accent Theme</div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {THEMES.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => setOsTheme(theme.id)}
                                    title={theme.name}
                                    style={{
                                        padding: '8px 12px', borderRadius: 20, border: osTheme === theme.id ? `1px solid ${theme.color}` : '1px solid var(--border)',
                                        background: osTheme === theme.id ? theme.bg : 'var(--bg-glass)',
                                        color: theme.color, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {theme.id === osTheme && '✨ '}{theme.id.charAt(0).toUpperCase() + theme.id.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FINAL ACTION */}
                <button
                    className="btn btn-primary"
                    onClick={handleStart}
                    style={{
                        width: '100%', padding: '18px', borderRadius: 'var(--radius)',
                        fontSize: 16, fontWeight: 600, background: activeTheme.color,
                        borderColor: activeTheme.color, color: '#0a0a0f',
                        boxShadow: `0 8px 24px ${activeTheme.color}33`,
                        transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)'
                    }}
                >
                    Start My Studio
                </button>
                <div style={{ textAlign: 'center', marginTop: 14, fontSize: 10, color: 'var(--text-muted)' }}>
                    You can change visuals later in Settings.
                </div>
            </div>
        </div>
    );
}
