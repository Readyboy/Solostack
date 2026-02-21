import React from 'react';
import useGameStore from '../store/gameStore.js';

export default function WinModal() {
    const winState = useGameStore(s => s.winState);
    const acknowledgeWin = useGameStore(s => s.acknowledgeWin);
    const newGame = useGameStore(s => s.newGame);

    if (!winState) return null;

    return (
        <div className="win-overlay">
            <div className="win-modal">
                <h1>🏆</h1>
                <h2>{winState.title}</h2>
                <p>{winState.message}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    The market bows to you. Keep going in sandbox mode, or start fresh!
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 8 }}>
                    <button className="btn btn-primary" onClick={acknowledgeWin}>
                        Continue Playing
                    </button>
                    <button className="btn btn-danger" onClick={newGame}>
                        New Game
                    </button>
                </div>
            </div>
        </div>
    );
}
