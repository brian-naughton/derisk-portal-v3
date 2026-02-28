import type { RiskFactor } from '../types/exploit.ts';
import { getRiskClass } from '../utils/formatting.ts';

interface FindingCardProps {
  finding: RiskFactor;
  isMultiplier?: boolean;
}

export function FindingCard({ finding, isMultiplier }: FindingCardProps) {
  const riskClass = isMultiplier ? 'multiplier' : getRiskClass(finding.score);
  const hasExplanation = finding.cir_explanation;

  return (
    <details className={`finding-card border-${riskClass}`}>
      <summary className="finding-summary">
        <span className={`sev-pip ${riskClass}`} />
        <span className="finding-title">{finding.description}</span>
        <span className={`finding-pts-badge ${isMultiplier ? 'risk-multiplier' : `risk-${riskClass}`}`}>{finding.score}</span>
        <svg className="finding-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </summary>
      {hasExplanation && (
        <div className="finding-body">
          <h5>For Investors</h5>
          <p>{finding.cir_explanation!.guidance.investor}</p>
          <h5>For Developers</h5>
          <p>{finding.cir_explanation!.guidance.developer}</p>
        </div>
      )}
      {!hasExplanation && finding.explanation_investors && (
        <div className="finding-body">
          <h5>For Investors</h5>
          <p>{finding.explanation_investors}</p>
          <h5>For Developers</h5>
          <p>{finding.explanation_developers}</p>
        </div>
      )}
    </details>
  );
}
