import type { ActuarialData } from '../types/exploit.ts';

interface ActuarialSliderProps {
  actuarial: ActuarialData;
  weight: number;
  onWeightChange: (w: number) => void;
  currentScore: number;
  delta: number;
}

export function ActuarialSlider({ actuarial, weight, onWeightChange, currentScore, delta }: ActuarialSliderProps) {
  if (actuarial.show_max_risk_message) {
    return (
      <div>
        <div className="section-heading">Actuarial Intelligence</div>
        <div className="act-max-risk-msg">
          Maximum risk score reached (100). The actuarial overlay confirms this contract's risk profile is at the ceiling. All historical cohort data supports this assessment.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-heading">Actuarial Intelligence</div>
      <div className="actuarial-compact">
        <div className="act-row">
          <span className="act-label">Base Score</span>
          <span className="act-value">{actuarial.base}</span>
        </div>
        <div className="act-row">
          <span className="act-label">Refined Score</span>
          <span className="act-value">{currentScore}</span>
        </div>
        <div className="act-row">
          <span className="act-label">Actuarial Delta</span>
          <span className="act-value" style={{ color: delta > 0 ? 'var(--db-risk-high)' : 'var(--db-text-muted)' }}>
            {delta > 0 ? `+${delta}` : delta}
          </span>
        </div>
        <div className="act-slider-wrap">
          <input
            type="range"
            className="act-slider"
            min={0}
            max={100}
            step={10}
            value={weight}
            onChange={e => onWeightChange(Number(e.target.value))}
          />
          <span className="act-readout">{weight}%</span>
        </div>
      </div>
    </div>
  );
}
