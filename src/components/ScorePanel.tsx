import type { ExploitData, MitigationSignal } from '../types/exploit.ts';
import { getRiskClass, getRiskLabel, formatLoss, formatVector, formatDate, stripPts } from '../utils/formatting.ts';

interface ScorePanelProps {
  data: ExploitData;
  currentScore: number;
  delta: number;
}

export function ScorePanel({ data, currentScore, delta }: ScorePanelProps) {
  const riskClass = getRiskClass(currentScore);
  const labelClass = `label-${riskClass}`;
  const glowClass = `glow-${riskClass}`;

  const { composition, actuarial } = data;
  const mitigations = data.scan_result.MitigationsAndSignals.filter(
    (s: MitigationSignal) => s.type === 'positive_signal'
  );
  const totalMitigation = composition.mitigation_credit;
  const multiplierTotal = composition.multiplier_details.reduce((sum, m) => sum + m.added_points, 0);

  // Waterfall values
  const rawScore = composition.raw_risk_score;
  const actuarialDelta = delta;
  const capped = currentScore > 100;

  return (
    <div className="panel-score">
      {/* Exploit badge cluster */}
      <div className="tm-exploit-badge-cluster">
        <span className="cmd-vector-badge">{formatVector(data.exploit_meta.attack_vector)}</span>
        <div className="tm-badge-row">
          <span className="cmd-loss-badge">{formatLoss(data.exploit_meta.loss_amount_usd)}</span>
          <span className="cmd-date-badge">{formatDate(data.exploit_meta.date)}</span>
        </div>
      </div>

      {/* Score hero */}
      <div className={`score-hero ${glowClass}`}>
        <div className={`score-number risk-${riskClass}`}>{currentScore}</div>
        <div className={`score-label ${labelClass}`}>{getRiskLabel(currentScore)}</div>
      </div>

      {/* Waterfall */}
      <div>
        <div className="section-heading">Score Composition</div>
        <div className="waterfall">
          <div className="wf-row">
            <span className="wf-label">Raw Risk Score</span>
            <span className="wf-value positive">{rawScore}</span>
          </div>
          {multiplierTotal > 0 && (
            <div className="wf-row">
              <span className="wf-label">Cluster Multipliers</span>
              <span className="wf-value positive">+{multiplierTotal}</span>
            </div>
          )}
          <div className="wf-row">
            <span className="wf-label">Total Mitigations</span>
            <span className={`wf-value ${totalMitigation > 0 ? 'negative' : 'zero'}`}>
              {totalMitigation > 0 ? `-${totalMitigation}` : '0'}
            </span>
          </div>
          <div className="wf-row" id="db-wf-actuarial">
            <span className="wf-label">Actuarial Adjustment</span>
            <span className={`wf-value ${actuarial.show_max_risk_message ? 'zero' : actuarialDelta > 0 ? 'positive' : actuarialDelta < 0 ? 'negative' : 'zero'}`}>
              {actuarial.show_max_risk_message ? 'n/a' : actuarialDelta > 0 ? `+${actuarialDelta}` : actuarialDelta}
            </span>
          </div>
          <hr className="wf-divider" />
          <div className="wf-row">
            <span className="wf-label">Final Score</span>
            <span className="wf-value final">{currentScore} / 100</span>
          </div>
          {capped && (
            <div className="wf-cap-note">Capped at 100</div>
          )}
        </div>
      </div>

      {/* Mitigations */}
      {mitigations.length > 0 && (
        <div>
          <div className="section-heading">Positive Signals</div>
          <div className="signals-compact">
            {mitigations.map((sig, i) => (
              <div key={i} className="signal-row">
                <span className="signal-dot green" />
                <span className="signal-text-compact">{stripPts(sig.description ?? '')}</span>
                <span className="signal-score">-{sig.points_saved ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
