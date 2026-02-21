import React, { useEffect } from 'react';
import useGameStore from '../store/gameStore.js';

export default function NotificationSystem() {
    const notifications = useGameStore(s => s.notifications);
    const dismissNotification = useGameStore(s => s.dismissNotification);

    // Auto-dismiss after 4 seconds
    useEffect(() => {
        const timers = notifications.map(n =>
            setTimeout(() => dismissNotification(n.id), 4000)
        );
        return () => timers.forEach(clearTimeout);
    }, [notifications.length]);

    if (notifications.length === 0) return null;

    return (
        <div className="notifications-container">
            {notifications.slice(0, 5).map(n => (
                <div
                    key={n.id}
                    className={`toast ${n.type || ''}`}
                    onClick={() => dismissNotification(n.id)}
                    style={{ cursor: 'pointer' }}
                >
                    <div style={{ flex: 1, fontSize: 12, lineHeight: 1.5, color: 'var(--text-primary)' }}>
                        {n.message}
                    </div>
                </div>
            ))}
        </div>
    );
}
