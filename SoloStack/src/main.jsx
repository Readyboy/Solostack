import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', background: '#0d0d12', color: '#e8e8f0',
          fontFamily: 'system-ui', textAlign: 'center', padding: 20
        }}>
          <h1 style={{ fontSize: 40, marginBottom: 16 }}>😵 SoloStack Crashed</h1>
          <p style={{ opacity: 0.7, marginBottom: 24 }}>A fatal logic error occurred. Don't worry, your progress is likely safe.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px', borderRadius: 8, background: '#8b7cf6',
              color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600
            }}
          >
            Reload SoloStack OS
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
