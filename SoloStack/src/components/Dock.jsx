import React from 'react';
import useGameStore from '../store/gameStore.js';
import { playSound } from '../utils/soundManager.js';

const DOCK_ITEMS = [
    { key: 'builder', icon: '🏗️', label: 'Builder' },
    { key: 'projects', icon: '⚙️', label: 'Projects' },
    { key: 'products', icon: '📦', label: 'Products' },
    { key: 'market', icon: '📈', label: 'Market' },
    { key: 'stats', icon: '🏆', label: 'Stats' },
    { key: 'archive', icon: '🗄️', label: 'Archive' },
];

export default function Dock() {
    const windows = useGameStore(s => s.windows);
    const projects = useGameStore(s => s.projects);
    const toggleWindow = useGameStore(s => s.toggleWindow);
    const isMuted = useGameStore(s => s.isMuted);

    // Count ready-to-release projects for badge
    const readyCount = projects.filter(p => p.monthsLeft <= 0).length;

    return (
        <div className="dock">
            {DOCK_ITEMS.map(item => (
                <button
                    key={item.key}
                    className={`dock-btn ${windows[item.key] ? 'active' : ''}`}
                    onClick={() => {
                        playSound('click', isMuted);
                        toggleWindow(item.key);
                    }}
                    title={item.label}
                >
                    <span className="dock-icon">{item.icon}</span>
                    {item.label}
                    {item.key === 'projects' && readyCount > 0 && (
                        <div className="dock-badge" style={{ background: 'var(--accent)' }}>{readyCount}</div>
                    )}
                    {windows[item.key] && (
                        <div className="dock-active-dot" style={{
                            position: 'absolute', bottom: -6, width: 4, height: 4,
                            borderRadius: '50%', background: 'var(--accent)',
                            boxShadow: '0 0 8px var(--accent-purple-glow)'
                        }} />
                    )}
                </button>
            ))}
        </div>
    );
}
