import { useState, useEffect } from 'react';
import LetterGlitch from './LetterGlitch.tsx';

const INIT_STEPS = [
  { text: 'Initializing DeRisk Portal...', color: '#4f8fe6' },
  { text: 'Installing Rosetta Stone components...', color: '#ffe600' },
  { text: 'Loading Recursive Self-Improvement protocols...', color: '#4f8fe6' },
  { text: 'Connecting to threat intelligence network...', color: '#ffe600' },
  { text: 'System ready.', color: '#4f8fe6' },
];

interface IntroSplashProps {
  onComplete: () => void;
}

export function IntroSplash({ onComplete }: IntroSplashProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (stepIndex < INIT_STEPS.length - 1) {
      const timer = setTimeout(() => setStepIndex(s => s + 1), 1200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setFading(true), 800);
      return () => clearTimeout(timer);
    }
  }, [stepIndex]);

  const handleTransitionEnd = () => {
    if (fading) onComplete();
  };

  const progress = ((stepIndex + 1) / INIT_STEPS.length) * 100;

  return (
    <div
      className={`intro-splash${fading ? ' intro-splash--fading' : ''}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="intro-glitch">
        <LetterGlitch
          glitchColors={['#0a1628', '#0f1c2f', '#4f8fe6', '#ffe600']}
          glitchSpeed={55}
          duration={99999}
          background="#0a1628"
          centerVignette={false}
          smooth
        />
      </div>
      <div className="intro-content">
        <div
          className="intro-step-text"
          key={stepIndex}
          style={{ color: INIT_STEPS[stepIndex].color }}
        >
          {INIT_STEPS[stepIndex].text}
        </div>
        <div className="intro-progress-track">
          <div className="intro-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="intro-progress-pct">{Math.round(progress)}% Complete</div>
      </div>
    </div>
  );
}
