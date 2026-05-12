import { useRef } from 'react';
import type { ExploitData, MitigationSignal } from '../types/exploit.ts';
import { FindingCard } from './FindingCard.tsx';

function isMultiplierFinding(description: string): boolean {
  return /multiplier/i.test(description);
}

function cleanMitigationName(description: string): string {
  return description.replace(/\s*\(-?\d+\s*pts?\)/i, '');
}

interface FindingsPanelProps {
  data: ExploitData;
  selectedId: string;
  onOpenDetail: () => void;
}

export function FindingsPanel({ data, selectedId, onOpenDetail }: FindingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const allFindings = data.scan_result.RiskFactors;
  const regular = allFindings.filter(f => !isMultiplierFinding(f.description)).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const multipliers = allFindings.filter(f => isMultiplierFinding(f.description));

  const mitigations = data.scan_result.MitigationsAndSignals
    .filter((s: MitigationSignal) => s.type === 'positive_signal')
    .sort((a: MitigationSignal, b: MitigationSignal) => (b.points_saved ?? 0) - (a.points_saved ?? 0));

  const narrative = data.narrative;
  const breakdown = narrative?.breakdown;

  return (
    <div className="panel-findings" ref={panelRef}>
      {/* Risk scoring legend */}
      <div className="risk-legend">
        <div className="risk-legend-item">
          <span className="risk-legend-dot risk-legend-low" />
          <span className="risk-legend-range">0–25</span>
          <span className="risk-legend-label">Low Risk</span>
        </div>
        <div className="risk-legend-item">
          <span className="risk-legend-dot risk-legend-med" />
          <span className="risk-legend-range">26–65</span>
          <span className="risk-legend-label">Moderate</span>
        </div>
        <div className="risk-legend-item">
          <span className="risk-legend-dot risk-legend-high" />
          <span className="risk-legend-range">66–100</span>
          <span className="risk-legend-label">High Risk</span>
        </div>
        <button
          className="cmd-detail-btn legend-detail-btn"
          onClick={onOpenDetail}
          title="Open portrait readout"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </button>
      </div>

      <div className="section-heading prominent">Risk Findings</div>
      {allFindings.length === 0 ? (
        <div className="findings-empty">No significant risk factors detected.</div>
      ) : (
        <>
          {regular.map((f, i) => <FindingCard key={i} finding={f} />)}
          {multipliers.length > 0 && (
            <>
              <div className="section-heading prominent">Cluster Multipliers</div>
              {multipliers.map((f, i) => <FindingCard key={`m-${i}`} finding={f} isMultiplier />)}
            </>
          )}
        </>
      )}

      {/* Mitigations section */}
      {mitigations.length > 0 && (
        <>
          <hr className="multiplier-divider" />
          <div className="section-heading prominent">Mitigations</div>
          {mitigations.map((m: MitigationSignal, i: number) => {
            const name = cleanMitigationName(m.description ?? '');
            return (
              <div key={`mit-${i}`} className="finding-card border-mitigation mitigation-pill">
                <div className="finding-summary">
                  <span className="sev-pip mitigation" />
                  <span className="finding-title">{name}</span>
                  <span className="finding-pts-badge mitigation-pts">-{m.points_saved ?? 0}</span>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Exploit Breakdown — expandable card in centre column */}
      {narrative && breakdown && (
        <>
          <hr className="multiplier-divider" />
          <div className="section-heading prominent">Time Machine Post-Mortem</div>
          <details
            className="finding-card border-high"
            onToggle={e => {
              if ((e.target as HTMLDetailsElement).open) {
                requestAnimationFrame(() => {
                  panelRef.current?.scrollTo({ top: panelRef.current.scrollHeight, behavior: 'smooth' });
                });
              }
            }}
          >
            <summary className="finding-summary">
              <span className="sev-pip high" />
              <span className="finding-title">{breakdown.vulnerability}</span>
              <svg className="finding-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </summary>
            <div className="finding-body exploit-breakdown-body">
              {narrative.sections.map((section, i) => (
                <div key={i} className="pm-narrative-section">
                  <h5>{section.title}</h5>
                  <p>{section.text}</p>
                </div>
              ))}
              <h5>Attack Steps</h5>
              <ol className="attack-steps">
                {breakdown.steps.split(/\d+\)\s*/).filter(Boolean).map((step, i) => (
                  <li key={i}>{step.trim()}</li>
                ))}
              </ol>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
