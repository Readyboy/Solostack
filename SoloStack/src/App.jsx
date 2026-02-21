import React, { useEffect } from 'react';
import useGameStore from './store/gameStore.js';
import TopBar from './components/TopBar.jsx';
import Dock from './components/Dock.jsx';
import Window from './components/Window.jsx';
import BuilderWindow from './components/BuilderWindow.jsx';
import ProjectsWindow from './components/ProjectsWindow.jsx';
import ProductsWindow from './components/ProductsWindow.jsx';
import MarketWindow from './components/MarketWindow.jsx';
import StatsWindow from './components/StatsWindow.jsx';
import ArchiveWindow from './components/ArchiveWindow.jsx';
import NotificationSystem from './components/NotificationSystem.jsx';
import WinModal from './components/WinModal.jsx';
import ReviewModal from './components/ReviewModal.jsx';
import './index.css';

const TICK_MS = 8000;

const WINDOW_MAP = {
  builder: BuilderWindow,
  projects: ProjectsWindow,
  products: ProductsWindow,
  market: MarketWindow,
  stats: StatsWindow,
  archive: ArchiveWindow,
};

const WINDOW_META = [
  { key: 'builder', title: 'Project Builder', icon: '🏗️', pos: { x: 60, y: 70 }, width: 460 },
  { key: 'projects', title: 'Development', icon: '⚙️', pos: { x: 540, y: 70 }, width: 400 },
  { key: 'products', title: 'My Products', icon: '📦', pos: { x: 60, y: 500 }, width: 440 },
  { key: 'market', title: 'Market Overview', icon: '📈', pos: { x: 540, y: 380 }, width: 420 },
  { key: 'stats', title: 'Statistics', icon: '🏆', pos: { x: 980, y: 70 }, width: 380 },
  { key: 'archive', title: 'Archive', icon: '🗄️', pos: { x: 980, y: 460 }, width: 380 },
];

export default function App() {
  const windows = useGameStore(s => s.windows);
  const advanceTick = useGameStore(s => s.advanceTick);
  const loadGame = useGameStore(s => s.loadGame);
  const addNotification = useGameStore(s => s.addNotification);
  const isPaused = useGameStore(s => s.isPaused);

  useEffect(() => {
    const loaded = loadGame();
    if (!loaded) {
      addNotification({ type: 'release', message: '👋 Welcome to SoloStack!' });
    }
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(advanceTick, TICK_MS);
    return () => clearInterval(interval);
  }, [advanceTick, isPaused]);

  return (
    <div className="desktop">
      <TopBar />

      {WINDOW_META.map(({ key, title, icon, pos, width }) => {
        if (!windows[key]) return null;
        const ContentComponent = WINDOW_MAP[key];
        return (
          <Window
            key={key}
            windowKey={key}
            title={title}
            icon={icon}
            defaultPos={pos}
            width={width}
          >
            <ContentComponent />
          </Window>
        );
      })}

      <Dock />
      <NotificationSystem />
      <WinModal />
      <ReviewModal />

      {isPaused && (
        <div style={{
          position: 'fixed', top: 10, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--accent-pink)', color: 'white',
          padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700,
          zIndex: 9000, pointerEvents: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          ⏸️ GAME PAUSED
        </div>
      )}
    </div>
  );
}
