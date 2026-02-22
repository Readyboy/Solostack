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
import SetupScreen from './components/SetupScreen.jsx';
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
  { key: 'builder', title: '📦 Project Builder', icon: '✨', pos: { x: 60, y: 70 }, width: 460 },
  { key: 'projects', title: '🛠️ Development', icon: '⚙️', pos: { x: 540, y: 70 }, width: 400 },
  { key: 'products', title: '📦 My Products', icon: '💿', pos: { x: 60, y: 500 }, width: 440 },
  { key: 'market', title: '📊 Market Overview', icon: '📈', pos: { x: 540, y: 380 }, width: 420 },
  { key: 'stats', title: '🏆 Statistics', icon: '🏅', pos: { x: 980, y: 70 }, width: 380 },
  { key: 'archive', title: '🗂️ Archive', icon: '📂', pos: { x: 980, y: 460 }, width: 380 },
];

export default function App() {
  const windows = useGameStore(s => s.windows);
  const advanceTick = useGameStore(s => s.advanceTick);
  const loadGame = useGameStore(s => s.loadGame);
  const addNotification = useGameStore(s => s.addNotification);
  const isPaused = useGameStore(s => s.isPaused);
  const hasCompletedSetup = useGameStore(s => s.hasCompletedSetup);
  const osTheme = useGameStore(s => s.osTheme);
  const desktopBackground = useGameStore(s => s.desktopBackground);

  const themeColors = {
    purple: { accent: '#8b7cf6', glow: 'rgba(139, 124, 246, 0.3)', dim: 'rgba(139, 124, 246, 0.12)' },
    amber: { accent: '#f5b97a', glow: 'rgba(245, 185, 122, 0.3)', dim: 'rgba(245, 185, 122, 0.12)' },
    green: { accent: '#7dd3a8', glow: 'rgba(125, 211, 168, 0.3)', dim: 'rgba(125, 211, 168, 0.1)' },
    peach: { accent: '#e07a7a', glow: 'rgba(224, 122, 122, 0.3)', dim: 'rgba(224, 122, 122, 0.1)' },
    blue: { accent: '#7ec7e8', glow: 'rgba(126, 199, 232, 0.3)', dim: 'rgba(126, 199, 232, 0.1)' },
  };

  const activeColors = themeColors[osTheme] || themeColors.purple;

  const bgStyle = desktopBackground.length > 50 // dataURL check
    ? { backgroundImage: `url(${desktopBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : desktopBackground === 'sunset' ? { backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }
      : desktopBackground === 'night' ? { backgroundImage: 'linear-gradient(to bottom, #0d0d12, #15131a)' }
        : desktopBackground === 'forest' ? { backgroundImage: 'linear-gradient(180deg, #15131a 0%, #1a2e24 100%)' }
          : {}; // Default is handled by CSS

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

  if (!hasCompletedSetup) return <SetupScreen />;

  return (
    <div className="desktop" style={{
      ...bgStyle,
      '--accent': activeColors.accent,
      '--accent-purple': activeColors.accent,
      '--accent-purple-glow': activeColors.glow,
      '--accent-purple-dim': activeColors.dim,
      '--border-accent': `color-mix(in srgb, ${activeColors.accent} 25%, transparent)`,
    }}>
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
