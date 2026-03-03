import { useState, useCallback, useEffect } from 'react';
import type { ExploitData } from '../types/exploit.ts';
import { useActuarialSlider } from '../hooks/useActuarialSlider.ts';
import { CommandBar } from './CommandBar.tsx';
import { ScorePanel } from './ScorePanel.tsx';
import { FindingsPanel } from './FindingsPanel.tsx';
import { IntelPanel } from './IntelPanel.tsx';
import { StatusBar } from './StatusBar.tsx';
import { DetailView } from './DetailView.tsx';

interface DashboardProps {
  data: ExploitData;
  selectedId: string;
  onSelectExploit: (id: string) => void;
  onHome: () => void;
}

export function Dashboard({ data, selectedId, onSelectExploit, onHome }: DashboardProps) {
  const { weight, setWeight, currentScore, delta } = useActuarialSlider(
    data.actuarial,
    data.scan_result.RiskScore
  );

  const [showDetail, setShowDetail] = useState(false);

  const openDetail = useCallback(() => setShowDetail(true), []);
  const closeDetail = useCallback(() => setShowDetail(false), []);

  useEffect(() => {
    if (!showDetail) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDetail(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showDetail, closeDetail]);

  return (
    <div className="dashboard">
      <CommandBar
        data={data}
        currentScore={currentScore}
        selectedId={selectedId}
        onSelect={onSelectExploit}
        onHome={onHome}
      />
      <ScorePanel data={data} currentScore={currentScore} delta={delta} />
      <FindingsPanel data={data} selectedId={selectedId} onOpenDetail={openDetail} />
      <IntelPanel
        data={data}
        currentScore={currentScore}
        delta={delta}
        weight={weight}
        onWeightChange={setWeight}
      />
      <StatusBar scanResult={data.scan_result} selectedId={selectedId} onSelect={onSelectExploit} />

      {showDetail && (
        <div className="pv-overlay" onClick={closeDetail}>
          <div className="pv-overlay-frame" onClick={e => e.stopPropagation()}>
            <button className="pv-overlay-close" onClick={closeDetail} title="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <DetailView data={data} />
          </div>
        </div>
      )}
    </div>
  );
}
