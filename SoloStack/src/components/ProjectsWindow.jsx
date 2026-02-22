import React from 'react';
import useGameStore from '../store/gameStore.js';
import { SOFTWARE_TYPES } from '../simulation/softwareTypes.js';
import { getActiveComponents } from '../simulation/components.js';

export default function ProjectsWindow() {
    const projects = useGameStore(s => s.projects);

    // If there ARE no active dev projects, show empty state
    if (projects.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">☕</div>
                <p>No projects in the works.<br />Open the Builder to start something special!</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {projects.map(project => {
                const type = SOFTWARE_TYPES.find(t => t.id === project.softwareTypeId);
                const comps = getActiveComponents(project.componentIds);
                const progress = 1 - (project.monthsLeft / Math.max(1, project.totalMonths));

                return (
                    <div key={project.id} className="card">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-8">
                                <span style={{ fontSize: 18 }}>{type?.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{project.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{type?.name}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-warm)', fontFamily: 'var(--font-numeric)' }}>
                                    {project.monthsLeft}mo
                                </div>
                                <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Remaining</div>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div style={{ marginBottom: 12 }}>
                            <div className="progress-bar" style={{ height: 6 }}>
                                <div className="progress-fill amber" style={{ width: `${progress * 100}%` }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-numeric)' }}>{Math.round(progress * 100)}%</span>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-numeric)' }}>{project.totalMonths - project.monthsLeft} / {project.totalMonths} mo</span>
                            </div>
                        </div>

                        {/* Component tags */}
                        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                            {comps.slice(0, 4).map(c => (
                                <span key={c.id} className="tag">{c.icon} {c.name}</span>
                            ))}
                            {comps.length > 4 && <span className="tag">+{comps.length - 4} strategies</span>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
