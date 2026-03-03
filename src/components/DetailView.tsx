import { useState } from 'react';
import type { ExploitData, MitigationSignal } from '../types/exploit.ts';
import { getRiskClass, getRiskLabel, formatLoss, formatVector, formatDate } from '../utils/formatting.ts';
import { FindingCard } from './FindingCard.tsx';
import { ActuarialSlider } from './ActuarialSlider.tsx';

function isMultiplierFinding(description: string): boolean {
  return /multiplier/i.test(description);
}

function cleanMitigationName(description: string): string {
  return description.replace(/\s*\(-?\d+\s*pts?\)/i, '');
}

const MITIGATION_EXPLANATIONS: Record<string, string> = {
  'Reentrancy Protection': 'The contract implements reentrancy guards (e.g. OpenZeppelin ReentrancyGuard) that prevent recursive external calls from draining funds mid-execution.',
  'Chainlink Oracles': 'Price feeds are sourced from Chainlink decentralised oracles, reducing exposure to single-source price manipulation attacks.',
  'Governance Authority Control': 'Administrative functions are gated behind access control modifiers, limiting who can execute privileged operations.',
  'Battle Tested Patterns': 'The codebase uses established, widely-audited contract patterns that have survived extensive real-world usage.',
  'Timelock Governance': 'Governance actions are subject to a time delay, giving stakeholders a window to review and react before changes take effect.',
  'Oz Standards': 'The contract inherits from OpenZeppelin\'s audited standard library, benefiting from battle-hardened implementations of common patterns.',
};

interface DetailViewProps {
  data: ExploitData;
}

export function DetailView({ data }: DetailViewProps) {
  const actuarial = data.actuarial;
  const [weight, setWeight] = useState(30);
  const step = Math.round(weight / 10);
  const delta = actuarial.slider_deltas[step] ?? 0;
  const currentScore = Math.max(5, Math.min(100, actuarial.pre_actuarial_score + delta));

  const riskClass = getRiskClass(currentScore);
  const riskLabel = getRiskLabel(currentScore, data.exploit_id);

  const allFindings = data.scan_result.RiskFactors;
  const regular = allFindings.filter(f => !isMultiplierFinding(f.description)).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const multipliers = allFindings.filter(f => isMultiplierFinding(f.description));

  const mitigations = data.scan_result.MitigationsAndSignals
    .filter((s: MitigationSignal) => s.type === 'positive_signal')
    .sort((a: MitigationSignal, b: MitigationSignal) => (b.points_saved ?? 0) - (a.points_saved ?? 0));

  return (
    <div className="detail-view">
      {/* Header card */}
      <div className="detail-header">
        <div className="detail-header-main">
          <div className="detail-header-left">
            <h1 className={`detail-title risk-${riskClass}`}>{data.scan_result.Name}</h1>
            <div className="detail-meta">
              <span className="detail-meta-label">Contract Address:</span> {data.scan_result.ContractAddress}
            </div>
            <div className="detail-meta">
              <span className="detail-meta-label">Chain:</span> {data.chain_display_name}
            </div>
            <div className="detail-meta">
              <span className="detail-meta-label">Analysis Engine:</span> CIR Universal Engine | Time Machine Module
            </div>
            <div className="detail-meta detail-meta-accent">
              <span className="detail-meta-label">Scan Time:</span> {formatDate(data.scan_result.ScanDate)} | {data.scan_result.ScanDuration.toFixed(3)} seconds <span className="detail-meta-muted">(from pre-cached, pre-exploit source code)</span>
            </div>
          </div>
          <div className="detail-header-score">
            <span className={`detail-score-number risk-${riskClass}`}>{currentScore}</span>
            <span className={`detail-score-label risk-${riskClass}`}>{getRiskClass(currentScore) === 'high' ? 'High Risk' : getRiskClass(currentScore) === 'med' ? 'Caution' : 'Safe'}</span>
          </div>
        </div>
      </div>

      {/* RAG legend */}
      <div className="detail-legend">
        <div className="detail-legend-tier detail-legend-low">
          <span className="detail-legend-range">0-25</span>
          <span className="detail-legend-label">Safe</span>
          <span className="detail-legend-desc">Low risk protocols</span>
        </div>
        <div className="detail-legend-tier detail-legend-med">
          <span className="detail-legend-range">26-65</span>
          <span className="detail-legend-label">Caution</span>
          <span className="detail-legend-desc">Moderate risk factors present</span>
        </div>
        <div className="detail-legend-tier detail-legend-high">
          <span className="detail-legend-range">66-100</span>
          <span className="detail-legend-label">High Risk</span>
          <span className="detail-legend-desc">Significant concerns identified</span>
        </div>
      </div>

      {/* Risk Findings */}
      <h2 className="detail-section-heading">Risk Profile</h2>
      {regular.map((f, i) => <FindingCard key={i} finding={f} />)}

      {/* Cluster Multipliers */}
      {multipliers.length > 0 && (
        <>
          <h2 className="detail-section-heading">Cluster Multipliers</h2>
          {multipliers.map((f, i) => <FindingCard key={`m-${i}`} finding={f} isMultiplier />)}
        </>
      )}

      {/* Mitigations */}
      {mitigations.length > 0 && (
        <>
          <h2 className="detail-section-heading">Signals &amp; Intelligence</h2>
          {mitigations.map((m: MitigationSignal, i: number) => {
            const name = cleanMitigationName(m.description ?? '');
            const explanation = MITIGATION_EXPLANATIONS[name];
            return (
              <details key={`mit-${i}`} className="finding-card border-mitigation">
                <summary className="finding-summary">
                  <span className="sev-pip mitigation" />
                  <span className="finding-title">{name}</span>
                  <span className="finding-pts-badge mitigation-pts">-{m.points_saved ?? 0}</span>
                  <svg className="finding-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </summary>
                {explanation && (
                  <div className="finding-body">
                    <p>{explanation}</p>
                  </div>
                )}
              </details>
            );
          })}
        </>
      )}

      {/* Actuarial */}
      <div className="detail-actuarial">
        <ActuarialSlider
          actuarial={actuarial}
          weight={weight}
          onWeightChange={setWeight}
          currentScore={currentScore}
          delta={delta}
        />
      </div>

      {/* Footer */}
      <div className="detail-footer">
        DeRisk — Universal cross-chain risk intelligence across EVM, Solana, and beyond.
      </div>
    </div>
  );
}
