import { useState } from 'react';
import type { ExploitData } from '../types/exploit.ts';
import { exploitsList, exploitsMap } from '../data/index.ts';
import { formatLoss, formatVector, formatYear } from '../utils/formatting.ts';
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
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffe600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
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
                  {ex.exploit_meta.name} — {formatLoss(ex.exploit_meta.loss_amount_usd)} — {formatVector(ex.exploit_meta.attack_vector)} ({formatYear(ex.exploit_meta.date)})
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
