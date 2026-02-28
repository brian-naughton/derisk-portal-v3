import type { ExploitData } from '../types/exploit.ts';
import { FindingCard } from './FindingCard.tsx';

function isMultiplierFinding(description: string): boolean {
  return /multiplier/i.test(description);
}

interface FindingsPanelProps {
  data: ExploitData;
}

export function FindingsPanel({ data }: FindingsPanelProps) {
  const allFindings = data.scan_result.RiskFactors;
  const regular = allFindings.filter(f => !isMultiplierFinding(f.description)).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const multipliers = allFindings.filter(f => isMultiplierFinding(f.description));

  const narrative = data.narrative;
  const breakdown = narrative?.breakdown;

  return (
    <div className="panel-findings">
      <div className="section-heading prominent">Risk Findings</div>
      {allFindings.length === 0 ? (
        <div className="findings-empty">No significant risk factors detected.</div>
      ) : (
        <>
          {regular.map((f, i) => <FindingCard key={i} finding={f} />)}
          {multipliers.map((f, i) => <FindingCard key={`m-${i}`} finding={f} isMultiplier />)}
        </>
      )}

      {/* Exploit Breakdown — expandable card in centre column */}
      {narrative && breakdown && (
        <>
          <hr className="multiplier-divider" />
          <div className="section-heading prominent">Time Machine Post-Mortem</div>
          <details className="finding-card border-high">
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
