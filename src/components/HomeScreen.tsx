import { useState } from 'react';
import type { ExploitData } from '../types/exploit.ts';
import { exploitsList, exploitsMap } from '../data/index.ts';
import { formatYear } from '../utils/formatting.ts';
import { InfoModal } from './InfoModal.tsx';

interface HomeScreenProps {
  onSelect: (id: string) => void;
}

export function HomeScreen({ onSelect }: HomeScreenProps) {
  const [showInfo, setShowInfo] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const select = form.elements.namedItem('exploit') as HTMLSelectElement;
    if (select.value) onSelect(select.value);
  };

  return (
    <div className="prescan">
      <div className="prescan-card">
        {/* Info icon */}
        <button
          className="info-icon-btn"
          onClick={() => setShowInfo(true)}
          title="What is the Time Machine?"
          aria-label="Information about DeRisk Time Machine"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>
        {/* DeRisk wordmark */}
        <div className="wordmark-container">
          <svg className="derisk-wordmark" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <style>{`.wordmark-text { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 32px; letter-spacing: 0.08em; fill: #ffffff; font-display: swap; }`}</style>
            </defs>
            <text className="wordmark-text" x="100" y="32" textAnchor="middle">DeRisk</text>
          </svg>
        </div>

        {/* Time Machine Demo label */}
        <div className="prescan-demo-label">Time Machine Demo</div>

        <p className="prescan-subtitle">Historical Exploit Forensic Analysis</p>

        <form className="prescan-form" onSubmit={handleSubmit}>
          <select name="exploit" defaultValue="dao_2016">
            <option value="" disabled>Select a historical exploit...</option>
            {exploitsList.map(id => {
              const ex = exploitsMap[id] as ExploitData;
              return (
                <option key={id} value={id}>
                  {ex.exploit_meta.name} ({formatYear(ex.exploit_meta.date)})
                </option>
              );
            })}
          </select>
          <button type="submit">Analyze Exploit</button>
        </form>
      </div>

      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
}
