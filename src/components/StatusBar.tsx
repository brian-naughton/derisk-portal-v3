import type { ScanResult } from '../types/exploit.ts';
import { exploitsList } from '../data/index.ts';

interface StatusBarProps {
  scanResult: ScanResult;
  selectedId: string;
  onSelect: (id: string) => void;
}

export function StatusBar({ scanResult, selectedId, onSelect }: StatusBarProps) {
  const idx = exploitsList.indexOf(selectedId);

  const goPrev = () => {
    const prev = idx <= 0 ? exploitsList.length - 1 : idx - 1;
    onSelect(exploitsList[prev]);
  };

  const goNext = () => {
    const next = idx >= exploitsList.length - 1 ? 0 : idx + 1;
    onSelect(exploitsList[next]);
  };

  return (
    <div className="status-bar">
      <span>DeRisk CIR v2.6 — Time Machine</span>
      <div className="status-nav">
        <button className="status-nav-btn" onClick={goPrev} title="Previous exploit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <svg className="status-wordmark" viewBox="0 0 120 28" xmlns="http://www.w3.org/2000/svg">
          <text x="60" y="20" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="500" fontSize="18" letterSpacing="0.08em" fill="#ffffff">DeRisk</text>
        </svg>
        <button className="status-nav-btn" onClick={goNext} title="Next exploit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>
      <span>
        {scanResult.ScanDate} — {scanResult.ScanDuration.toFixed(2)}s — Scan based on pre-exploit source code
      </span>
    </div>
  );
}
