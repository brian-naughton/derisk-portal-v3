import { useState } from 'react';
import type { ExploitData, MitigationSignal } from '../types/exploit.ts';
import { getRiskClass, formatDate } from '../utils/formatting.ts';
import { generateReport } from '../utils/generateReport.ts';

function isMultiplierFinding(description: string): boolean {
  return /multiplier/i.test(description);
}

function cleanMitigationName(description: string): string {
  return description.replace(/\s*\(-?\d+\s*pts?\)/i, '');
}

function riskCategory(score: number): string {
  if (score >= 66) return 'high';
  if (score >= 26) return 'medium';
  return 'low';
}

function riskDescription(score: number): string {
  if (score >= 66) return 'High Risk';
  if (score >= 26) return 'Moderate Risk';
  return 'Low Risk';
}

interface DetailViewProps {
  data: ExploitData;
}

export function DetailView({ data }: DetailViewProps) {
  const actuarial = data.actuarial;
  const [weight, setWeight] = useState(30);
  const step = Math.round(weight / 10);
  const delta = actuarial.slider_deltas[step] ?? 0;
  const currentScore = Math.max(5, Math.min(100, actuarial.pre_actuarial_score + delta));

  const cat = riskCategory(currentScore);

  const allFindings = data.scan_result.RiskFactors;
  const regular = allFindings.filter(f => !isMultiplierFinding(f.description)).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const multipliers = allFindings.filter(f => isMultiplierFinding(f.description));

  const mitigations = data.scan_result.MitigationsAndSignals
    .filter((s: MitigationSignal) => s.type === 'positive_signal')
    .sort((a: MitigationSignal, b: MitigationSignal) => (b.points_saved ?? 0) - (a.points_saved ?? 0));

  const totalMitigationPts = mitigations.reduce((sum, m) => sum + (m.points_saved ?? 0), 0);

  return (
    <div className="detail-view">

      {/* Header */}
      <header className="pv-header">
        <div className="pv-header-info">
          <h2 className={`pv-protocol-name risk-category-${cat}`}>{data.scan_result.Name}</h2>
          <p><span className="pv-info-label">Contract Address:</span> {data.scan_result.ContractAddress}</p>
          <p><span className="pv-info-label">Chain:</span> {data.chain_display_name}</p>
          <p><span className="pv-info-label">Analysis Engine:</span> <strong>CIR Universal Engine</strong> <span className="pv-info-label">|</span> <strong>Time Machine Module</strong></p>
          <p><span className="pv-info-label">Scan Time:</span> {formatDate(data.scan_result.ScanDate)} <span className="pv-info-label">|</span> {data.scan_result.ScanDuration.toFixed(3)} seconds <span className="pv-meta-muted">(pre-cached, pre-exploit code)</span></p>
        </div>
        <div className="pv-score-wrapper">
          <span className={`pv-score-value risk-category-${cat}`}>{currentScore}</span>
          <span className="pv-score-label">{riskDescription(currentScore)}</span>
        </div>
      </header>

      {/* Scoring guide */}
      <section className="pv-scoring-guide">
        <div className="pv-score-ranges">
          <div className="pv-range pv-range-safe">
            <span className="pv-range-number">0-25</span>
            <span className="pv-range-label">Safe</span>
            <span className="pv-range-desc">Low risk protocols</span>
          </div>
          <div className="pv-range pv-range-caution">
            <span className="pv-range-number">26-65</span>
            <span className="pv-range-label">Caution</span>
            <span className="pv-range-desc">Moderate risk factors present</span>
          </div>
          <div className="pv-range pv-range-high">
            <span className="pv-range-number">66-100</span>
            <span className="pv-range-label">High Risk</span>
            <span className="pv-range-desc">Significant concerns identified</span>
          </div>
        </div>
      </section>

      {/* Risk findings */}
      <div className="pv-findings-list">
        <h3>Risk Profile</h3>
        {regular.map((f, i) => {
          const fCat = riskCategory(f.score);
          return (
            <details key={i} className={`pv-finding-item pv-risk-border-${fCat}`}>
              <summary className="pv-finding-header">
                <span className="pv-finding-title">{f.description}</span>
                <div className="pv-finding-summary">
                  <span className={`pv-risk-tag pv-tag-${fCat}`}>{f.score} pts</span>
                  <svg className="pv-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </div>
              </summary>
              <div className="pv-finding-body">
                <div className="pv-explanation">
                  {f.cir_explanation ? (
                    <>
                      <h5>For Investors / Risk Analysts:</h5>
                      <p>{f.cir_explanation.guidance.investor}</p>
                      <h5>For Developers / Protocol Teams:</h5>
                      <p>{f.cir_explanation.guidance.developer}</p>
                    </>
                  ) : f.explanation_investors ? (
                    <>
                      <h5>For Investors / Risk Analysts:</h5>
                      <p>{f.explanation_investors}</p>
                      <h5>For Developers / Protocol Teams:</h5>
                      <p>{f.explanation_developers}</p>
                    </>
                  ) : null}
                </div>
              </div>
            </details>
          );
        })}

        {/* Multipliers */}
        {multipliers.map((f, i) => {
          const fCat = riskCategory(f.score);
          return (
            <details key={`m-${i}`} className={`pv-finding-item pv-risk-border-${fCat} pv-risk-multiplier`}>
              <summary className="pv-finding-header">
                <span className="pv-finding-title">{f.description}</span>
                <div className="pv-finding-summary">
                  <span className={`pv-risk-tag pv-tag-${fCat}`}>{f.score} pts</span>
                  <svg className="pv-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </div>
              </summary>
              <div className="pv-finding-body">
                <div className="pv-explanation">
                  {f.cir_explanation ? (
                    <>
                      <h5>For Investors / Risk Analysts:</h5>
                      <p>{f.cir_explanation.guidance.investor}</p>
                      <h5>For Developers / Protocol Teams:</h5>
                      <p>{f.cir_explanation.guidance.developer}</p>
                    </>
                  ) : f.explanation_investors ? (
                    <>
                      <h5>For Investors / Risk Analysts:</h5>
                      <p>{f.explanation_investors}</p>
                      <h5>For Developers / Protocol Teams:</h5>
                      <p>{f.explanation_developers}</p>
                    </>
                  ) : null}
                </div>
              </div>
            </details>
          );
        })}
      </div>

      {/* Signals & Intelligence */}
      {mitigations.length > 0 && (
        <div className="pv-signals">
          <h3>Signals &amp; Intelligence</h3>
          <div className="pv-signals-list">
            {mitigations.map((m: MitigationSignal, i: number) => {
              const name = cleanMitigationName(m.description ?? '');
              return (
                <div key={`mit-${i}`} className="pv-signal-card pv-positive-signal">
                  <div className="pv-signal-icon">&#x2713;</div>
                  <p className="pv-signal-description">
                    <span className="pv-signal-text"><strong>{name}</strong></span>
                    {m.points_saved ? <span className="pv-miti-badge">[-{m.points_saved}]</span> : null}
                  </p>
                </div>
              );
            })}

            {totalMitigationPts > 0 && (
              <div className="pv-signal-card pv-positive-signal">
                <div className="pv-signal-icon">&#x2713;</div>
                <p className="pv-signal-description">
                  <span className="pv-signal-text"><strong>Mitigations Summary: &minus;{totalMitigationPts}</strong></span>
                </p>
              </div>
            )}

            {/* Actuarial signal card */}
            <div className="pv-signal-card pv-actuarial-signal">
              <div className="pv-actuarial-inner">
                <div className="pv-actuarial-top">
                  <div className="pv-signal-icon">&#x25CF;</div>
                  <p className="pv-signal-description">
                    <span className="pv-signal-text">
                      <strong>Actuarial analysis: Base {actuarial.base} | Refined <span className="pv-refined-value">{actuarial.base + delta}</span> | {weight}% uplift weighting</strong>
                    </span>
                  </p>
                </div>
                <div className="pv-slider-row">
                  <div className="pv-slider-track">
                    <input
                      type="range"
                      min={0} max={100} step={10}
                      value={weight}
                      onChange={e => setWeight(Number(e.target.value))}
                    />
                    <div className="pv-tick-marks">
                      {Array.from({ length: 11 }).map((_, i) => <span key={i} />)}
                    </div>
                  </div>
                  <span className="pv-slider-readout">{weight}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download PDF */}
      <div className="pv-actions">
        <button
          className="pv-download-btn"
          onClick={() => generateReport({ data, currentScore, delta, weight })}
        >
          DOWNLOAD PDF
        </button>
      </div>

      {/* Footer */}
      <footer className="pv-footer">
        <p>DeRisk Systems<br />DeFi Risk Intelligence Platform<br />Time Machine Module &bull; v3.1</p>
      </footer>
    </div>
  );
}
