import React from 'react';
import useGameStore from '../store/gameStore.js';

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

    // Count ready-to-release projects for badge
    const readyCount = projects.filter(p => p.monthsLeft <= 0).length;

    return (
        <div className="dock">
            {DOCK_ITEMS.map(item => (
                <button
                    key={item.key}
                    className={`dock-btn ${windows[item.key] ? 'active' : ''}`}
                    onClick={() => toggleWindow(item.key)}
                    title={item.label}
                >
                    <span className="dock-icon">{item.icon}</span>
                    {item.label}
                    {item.key === 'projects' && readyCount > 0 && (
                        <span className="dock-badge">{readyCount}</span>
                    )}
                </button>
            ))}
        </div>
    );
}
