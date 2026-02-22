import React, { useRef, useState, useCallback, useEffect } from 'react';
import useGameStore from '../store/gameStore.js';
import { playSound } from '../utils/soundManager.js';

// ─── Draggable Window Shell ──────────────────────────────────────────────────
// Wraps content in a draggable OS-style panel.

export default function Window({ windowKey, title, icon, children, defaultPos, width = 420, height }) {
    const closeWindow = useGameStore(s => s.closeWindow);
    const isMuted = useGameStore(s => s.isMuted);
    const [pos, setPos] = useState(defaultPos || { x: 80, y: 80 });

    useEffect(() => {
        playSound('pop', isMuted);
    }, []);
    const [focused, setFocused] = useState(false);
    const dragRef = useRef(null);

    const onMouseDown = useCallback((e) => {
        if (e.target.classList.contains('window-close-btn')) return;
        setFocused(true);
        const startX = e.clientX - pos.x;
        const startY = e.clientY - pos.y;

        const onMove = (ev) => {
            setPos({
                x: Math.max(0, Math.min(window.innerWidth - 80, ev.clientX - startX)),
                y: Math.max(48, Math.min(window.innerHeight - 80, ev.clientY - startY)),
            });
        };
        const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, [pos]);

    return (
        <div
            className={`window ${focused ? 'focused' : ''} `}
            style={{
                left: pos.x,
                top: pos.y,
                width,
                ...(height ? { height } : {}),
            }}
            onMouseEnter={() => setFocused(true)}
            onMouseLeave={() => setFocused(false)}
            ref={dragRef}
        >
            <div className="window-titlebar" onMouseDown={onMouseDown}>
                <span className="window-titlebar-icon">{icon}</span>
                <h3>{title}</h3>
                <button
                    className="window-close-btn"
                    onClick={() => closeWindow(windowKey)}
                    style={{
                        background: focused ? 'var(--accent)' : 'var(--bg-glass)',
                        color: focused ? 'var(--bg-base)' : 'var(--text-muted)',
                        transition: 'all 0.2s ease'
                    }}
                    title="Close"
                >×</button>
            </div>
            <div className="window-content">
                {children}
            </div>
        </div>
    );
}
