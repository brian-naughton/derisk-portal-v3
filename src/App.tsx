import { useState, useEffect } from 'react';
import './App.css';
import { exploitsMap } from './data/index.ts';
import type { ExploitData } from './types/exploit.ts';
import Aurora from './components/Aurora.tsx';
import { IntroSplash } from './components/IntroSplash.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { HomeScreen } from './components/HomeScreen.tsx';
import { PostDemoHero } from './components/PostDemoHero.tsx';
import { DetailView } from './components/DetailView.tsx';

// Check for ?detail= param (portrait view in new tab)
const detailParam = new URLSearchParams(window.location.search).get('detail');
const detailData = detailParam ? exploitsMap[detailParam] as ExploitData | undefined : undefined;
if (detailData) document.body.classList.add('scrollable');

function MainApp() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  const handleSelect = (id: string) => setSelectedId(id);
  const handleHome = () => setSelectedId(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (hasSeenIntro) {
      document.body.classList.add('scrollable');
    } else {
      document.body.classList.remove('scrollable');
    }
  }, [hasSeenIntro]);

  return (
    <>
      <div className="aurora-layer">
        <Aurora
          colorStops={['#3A228A', '#1B3B6F', '#0a1628']}
          speed={0.3}
          amplitude={0.8}
          blend={0.6}
        />
      </div>

      {!hasSeenIntro && (
        <IntroSplash onComplete={() => setHasSeenIntro(true)} />
      )}

      {hasSeenIntro && selectedId === null && (
        <div className="home-with-hero">
          <HomeScreen onSelect={handleSelect} />
          <PostDemoHero />
        </div>
      )}

      {hasSeenIntro && selectedId !== null && (
        <div className="dashboard-with-hero">
          {isMobile ? (
            <div className="desktop-only-card">
              <svg className="derisk-wordmark" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <style>{`.wordmark-text { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 32px; letter-spacing: 0.08em; fill: #ffffff; font-display: swap; }`}</style>
                </defs>
                <text className="wordmark-text" x="100" y="32" textAnchor="middle">DeRisk</text>
              </svg>
              <h2 className="desktop-only-title">Interactive Demo — Desktop Only</h2>
              <p className="desktop-only-text">
                The 3-column forensic dashboard is built for desktop browsers.
                Open this page on a laptop or widen your window to explore the full analysis.
              </p>
              <button className="desktop-only-btn" onClick={handleHome}>Back to Home</button>
            </div>
          ) : (
            <Dashboard
              key={selectedId}
              data={exploitsMap[selectedId] as ExploitData}
              selectedId={selectedId}
              onSelectExploit={handleSelect}
              onHome={handleHome}
            />
          )}
          <PostDemoHero />
        </div>
      )}
    </>
  );
}

export default function App() {
  if (detailData) return <DetailView data={detailData} />;
  return <MainApp />;
}
