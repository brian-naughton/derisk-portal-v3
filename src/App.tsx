import { useState, useEffect } from 'react';
import './App.css';
import { exploitsMap } from './data/index.ts';
import type { ExploitData } from './types/exploit.ts';
import Aurora from './components/Aurora.tsx';
import { IntroSplash } from './components/IntroSplash.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { HomeScreen } from './components/HomeScreen.tsx';
import { PostDemoHero } from './components/PostDemoHero.tsx';

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  const handleSelect = (id: string) => setSelectedId(id);
  const handleHome = () => setSelectedId(null);

  // Toggle body scrollability when past the intro (hero section below)
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
          <Dashboard
            key={selectedId}
            data={exploitsMap[selectedId] as ExploitData}
            selectedId={selectedId}
            onSelectExploit={handleSelect}
            onHome={handleHome}
          />
          <PostDemoHero />
        </div>
      )}
    </>
  );
}
