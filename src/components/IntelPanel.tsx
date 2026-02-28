import type { ExploitData } from '../types/exploit.ts';
import { formatLoss, formatVector, formatDate } from '../utils/formatting.ts';
import { ActuarialSlider } from './ActuarialSlider.tsx';
import { generateReport } from '../utils/generateReport.ts';

interface IntelPanelProps {
  data: ExploitData;
  currentScore: number;
  delta: number;
  weight: number;
  onWeightChange: (w: number) => void;
}

export function IntelPanel({ data, currentScore, delta, weight, onWeightChange }: IntelPanelProps) {
  const { exploit_meta: meta, scan_result: scan, context_data: ctx } = data;

  return (
    <div className="panel-intel">
      {/* Exploit Intelligence */}
      <div>
        <div className="section-heading">Exploit Intelligence</div>
        <div>
          <div className="exploit-intel-row">
            <span className="exploit-intel-label">Attack Vector</span>
            <span className="exploit-intel-value vector">{formatVector(meta.attack_vector)}</span>
          </div>
          <div className="exploit-intel-row">
            <span className="exploit-intel-label">Total Loss</span>
            <span className="exploit-intel-value loss">{formatLoss(meta.loss_amount_usd)}</span>
          </div>
          <div className="exploit-intel-row">
            <span className="exploit-intel-label">Exploit Date</span>
            <span className="exploit-intel-value mono">{formatDate(meta.date)}</span>
          </div>
          <div className="exploit-intel-row">
            <span className="exploit-intel-label">Chain</span>
            <span className="exploit-intel-value">{data.chain_display_name}</span>
          </div>
        </div>
      </div>

      {/* Contract Intelligence */}
      <div>
        <div className="section-heading">Contract Intelligence</div>
        <div className="meta-grid">
          <span className="meta-label">Archetype</span>
          <span className="meta-value">{ctx.archetype ?? 'Unknown'}</span>
          <span className="meta-label">Engine</span>
          <span className="meta-value mono">CIR v2.6</span>
          <span className="meta-label">Duration</span>
          <span className="meta-value mono">{scan.ScanDuration.toFixed(2)}s</span>
          <span className="meta-label">Primitives</span>
          <span className="meta-value mono">{data.primitive_count}</span>
          <span className="meta-label">Source</span>
          <span className="meta-value">Cached pre-exploit code</span>
        </div>
      </div>

      {/* Actuarial Intelligence */}
      <ActuarialSlider
        actuarial={data.actuarial}
        weight={weight}
        onWeightChange={onWeightChange}
        currentScore={currentScore}
        delta={delta}
      />

      {/* Actuarial methodology toggle */}
      <details className="act-methodology">
        <summary className="act-methodology-toggle">Actuarial Methodology</summary>
        <div className="act-methodology-body">
          The actuarial overlay applies <strong>Bayesian refinement</strong> calibrated against <strong>1,400+ historical exploit incidents</strong> across DeFi, bridges, lending, and governance protocols. Each finding is mapped to a statistical cohort with known frequency and severity data, producing a probabilistic risk adjustment grounded in real-world outcomes. Use the <strong>opacity slider</strong> above to specify the weighting of this actuarial overlay, adjustable in 10% increments from 0% (base score only) to 100% (full actuarial refinement).
        </div>
      </details>

      {/* PDF Download */}
      <button
        className="pdf-download-btn"
        onClick={() => generateReport({ data, currentScore, delta, weight })}
      >
        DOWNLOAD PDF
      </button>
    </div>
  );
}
