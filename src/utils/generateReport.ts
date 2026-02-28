import type { ExploitData, RiskFactor, MitigationSignal } from '../types/exploit.ts';

interface ReportOptions {
  data: ExploitData;
  currentScore: number;
  delta: number;
  weight: number;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function riskCategory(score: number): 'high' | 'medium' | 'low' {
  if (score >= 66) return 'high';
  if (score >= 26) return 'medium';
  return 'low';
}

function riskLabel(score: number): string {
  if (score >= 66) return 'High Risk';
  if (score >= 26) return 'Moderate Risk';
  return 'Low Risk';
}

function isMultiplier(description: string): boolean {
  return /multiplier|cluster/i.test(description);
}

function renderFinding(f: RiskFactor, isMulti: boolean): string {
  const cat = riskCategory(f.score);
  const multiClass = isMulti ? ' risk-multiplier' : '';
  const tagClass = isMulti ? ' tag-multiplier' : ` tag-${cat}`;

  let explanation = '';
  if (f.cir_explanation) {
    explanation = `
      <div class="explanation-content">
        <h5>For Investors / Risk Analysts:</h5>
        <p>${escapeHtml(f.cir_explanation.guidance.investor)}</p>
        <h5>For Developers / Protocol Teams:</h5>
        <p>${escapeHtml(f.cir_explanation.guidance.developer)}</p>
      </div>`;
  } else if (f.explanation_investors) {
    explanation = `
      <div class="explanation-content">
        <h5>For Investors / Risk Analysts:</h5>
        <p>${escapeHtml(f.explanation_investors)}</p>
        <h5>For Developers / Protocol Teams:</h5>
        <p>${escapeHtml(f.explanation_developers ?? '')}</p>
      </div>`;
  }

  return `
    <div class="finding-item risk-border-${cat}${multiClass}">
      <div class="finding-header">
        <span class="finding-title">${escapeHtml(f.description)}</span>
        <span class="risk-tag${tagClass}">${f.score} pts</span>
      </div>
      ${explanation}
    </div>`;
}

function renderSignals(signals: MitigationSignal[], actuarial: ExploitData['actuarial'], currentScore: number, weight: number, delta: number): string {
  const positiveSignals = signals.filter(s => s.type === 'positive_signal' && s.key !== 'residual_baseline');
  const residualBaseline = signals.filter(s => s.type === 'positive_signal' && s.key === 'residual_baseline');
  const actuarialIntel = signals.filter(s => s.type === 'actuarial_intelligence');
  const advisories = signals.filter(s => s.type === 'advisory_signal');

  let html = '';

  // Positive signals
  for (const s of positiveSignals) {
    html += `
      <div class="signal-card positive-signal">
        <div class="signal-icon">&#10003;</div>
        <div class="signal-description">
          <span class="signal-text"><strong>${escapeHtml(s.description ?? '')}</strong></span>
          ${s.points_saved ? `<span class="miti-badge">[-${s.points_saved}]</span>` : ''}
        </div>
      </div>`;
  }

  // Mitigations summary
  const totalSaved = positiveSignals.reduce((sum, s) => sum + (s.points_saved ?? 0), 0);
  if (totalSaved > 0) {
    const details = positiveSignals
      .filter(s => s.points_saved)
      .map(s => `${(s.description ?? '').split(' ')[0].split('-')[0]} −${s.points_saved}`)
      .join(', ');
    html += `
      <div class="signal-card positive-signal">
        <div class="signal-icon">&#10003;</div>
        <div class="signal-description">
          <span class="signal-text"><strong>Mitigations Summary: −${totalSaved} (${escapeHtml(details)})</strong></span>
        </div>
      </div>`;
  }

  // Residual baseline
  for (const s of residualBaseline) {
    html += `
      <div class="signal-card positive-signal">
        <div class="signal-icon">&#10003;</div>
        <div class="signal-description">
          <span class="signal-text"><strong>${escapeHtml(s.description ?? '')}</strong></span>
          ${s.points_saved ? `<span class="miti-badge">[+${s.points_saved}]</span>` : ''}
        </div>
      </div>`;
  }

  // Advisory signals
  for (const s of advisories) {
    html += `
      <div class="signal-card advisory-signal">
        <div class="signal-icon">!</div>
        <div class="signal-description">
          <span class="signal-text"><strong>${escapeHtml(s.description ?? '')}</strong></span>
        </div>
      </div>`;
  }

  // Actuarial intelligence
  const weightPct = Math.round(weight);
  for (const s of actuarialIntel) {
    let text: string;
    if (s.key === 'actuarial_analysis' && actuarial.show_max_risk_message) {
      text = 'Actuarial analysis: Contract reached maximum risk (100) — actuarial amplification not applied';
    } else if (s.key === 'actuarial_analysis') {
      text = `${s.name ?? 'Actuarial analysis'}: Base ${actuarial.base} | Refined ${currentScore} | ${weightPct}% uplift weighting`;
      if (currentScore >= 100 && actuarial.base < 100) {
        text += ' (maximum reached)';
      }
    } else {
      text = `${s.name ?? ''}: ${s.value ?? ''}`;
    }
    html += `
      <div class="signal-card actuarial-intelligence">
        <div class="signal-icon">&#9679;</div>
        <div class="signal-description">
          <span class="signal-text"><strong>${escapeHtml(text)}</strong></span>
        </div>
      </div>`;
  }

  return html;
}

export function generateReport({ data, currentScore, delta, weight }: ReportOptions): void {
  const { scan_result: scan, exploit_meta: meta, actuarial, composition } = data;
  const cat = riskCategory(currentScore);
  const weightPct = Math.round(weight);

  const regularFindings = scan.RiskFactors.filter(f => !isMultiplier(f.description));
  const multiplierFindings = scan.RiskFactors.filter(f => isMultiplier(f.description));

  // Build actuarial footer text
  let actuarialFooter: string;
  if (actuarial.show_max_risk_message) {
    actuarialFooter = `Contract reached maximum risk score (100). Actuarial amplification was not applied as the base heuristic analysis already indicates maximum risk. Loss-risk index scaled 0-100 (0 = no recorded loss, 100 = all similar contracts exploited). 12-month horizon based on 1,400+ historical incidents.`;
  } else {
    const fullDelta = actuarial.full_delta;
    const fullRefined = Math.min(actuarial.base + fullDelta, 100);
    actuarialFooter = `Actuarial Model v2.1 (dataset as-of 2025-08-01). 12-month horizon; 1,400+ incidents. Scale: loss-risk index 0\u2013100 (0 = no recorded loss, 100 = all similar contracts exploited). Current: Base ${actuarial.base} \u2192 Refined ${currentScore} (${delta >= 0 ? '+' : ''}${delta} at w = ${weightPct}%).${weightPct < 100 ? ` Full-intensity equivalent: ${actuarial.base} \u2192 ${fullRefined} (${fullDelta >= 0 ? '+' : ''}${fullDelta}).` : ''} Rounded at end; fractional deltas &lt;1 display as 0.`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(meta.name)} — Risk Analysis Report</title>
  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&f[]=space-grotesk@400,500,600,700&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-background: #ffffff;
      --color-panel: #f8f9fa;
      --color-action: #4f8fe6;
      --color-text-primary: #1a1a1a;
      --color-text-secondary: #6b7280;
      --color-border: #e5e7eb;
      --color-risk-high: #a10b2b;
      --color-risk-medium: #ff8c00;
      --color-risk-low: #6ea900;
      --font-heading: 'Space Grotesk', sans-serif;
      --font-body: 'Satoshi', sans-serif;
      --spacing-unit: 8px;
      --border-radius: 8px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-body);
      font-size: 12px;
      line-height: 1.4;
      color: var(--color-text-primary);
      background: var(--color-background);
    }
    .report-container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .report-header {
      border-bottom: 2px solid var(--color-border);
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-info h1 {
      font-family: var(--font-heading);
      font-size: 24px;
      font-weight: 700;
      color: #1e3a8a;
      margin-bottom: 5px;
    }
    .header-info p {
      font-family: monospace;
      color: var(--color-text-secondary);
      font-size: 10px;
    }
    .info-label { color: #4f8fe6; font-weight: 500; }
    .risk-score-section { text-align: center; }
    .risk-score-value {
      font-family: var(--font-heading);
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
    }
    .risk-score-value.risk-category-high { color: var(--color-risk-high); }
    .risk-score-value.risk-category-medium { color: var(--color-risk-medium); }
    .risk-score-value.risk-category-low { color: var(--color-risk-low); }
    .risk-score-label {
      display: block;
      font-size: 11px;
      color: var(--color-text-secondary);
      margin-top: 5px;
    }
    .section { margin-bottom: 30px; page-break-inside: avoid; }
    .section-title {
      font-family: var(--font-heading);
      font-size: 16px;
      font-weight: 600;
      color: #1e3a8a;
      margin-bottom: 15px;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 5px;
    }
    .finding-item {
      background-color: var(--color-panel);
      border-radius: var(--border-radius);
      border-left: 4px solid;
      margin-bottom: 15px;
      padding: 15px;
      page-break-inside: avoid;
    }
    .finding-item.risk-border-high { border-left-color: var(--color-risk-high); }
    .finding-item.risk-border-medium { border-left-color: var(--color-risk-medium); }
    .finding-item.risk-border-low { border-left-color: var(--color-risk-low); }
    .finding-item.risk-multiplier {
      border-left-color: #1b3644;
      background-color: rgba(27, 54, 68, 0.08);
      margin-top: 20px;
    }
    .finding-item.risk-multiplier .finding-title { color: #1b3644; font-weight: 600; }
    .finding-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .finding-title {
      font-family: var(--font-heading);
      font-size: 12px;
      font-weight: 500;
      color: var(--color-text-primary);
      flex: 1;
    }
    .risk-tag {
      border-radius: 4px;
      font-family: var(--font-heading);
      font-size: 10px;
      font-weight: 600;
      padding: 3px 8px;
      white-space: nowrap;
    }
    .risk-tag.tag-high { background-color: rgba(161, 11, 43, 0.15); color: var(--color-risk-high); }
    .risk-tag.tag-medium { background-color: rgba(255, 140, 0, 0.15); color: var(--color-risk-medium); }
    .risk-tag.tag-low { background-color: rgba(110, 169, 0, 0.1); color: var(--color-risk-low); }
    .risk-tag.tag-multiplier { background-color: rgba(27, 54, 68, 0.15); color: #1b3644; font-weight: 600; }
    .explanation-content h4 {
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 12px;
      margin-bottom: 8px;
    }
    .explanation-content h5 {
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 10px;
      color: var(--color-action);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 12px;
      margin-bottom: 5px;
    }
    .explanation-content p {
      font-size: 11px;
      line-height: 1.5;
      color: var(--color-text-secondary);
    }
    .signal-card {
      background: var(--color-panel);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: 10px;
      margin-bottom: 8px;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .signal-card.positive-signal { border-left: 4px solid var(--color-risk-low); }
    .signal-card.actuarial-intelligence { border-left: 4px solid #a6e6db; }
    .signal-card.advisory-signal { border-left: 4px solid #f59e0b; }
    .signal-icon { font-size: 10px; margin-top: 2px; }
    .signal-description {
      flex: 1;
      font-size: 11px;
      line-height: 1.4;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .signal-description strong {
      font-weight: 500;
      color: var(--color-text-primary);
      margin-right: 0.4rem;
      font-size: 0.9rem;
    }
    .miti-badge {
      font-size: 0.7rem;
      font-weight: 600;
      color: #4a90a4;
      margin-left: 0.25rem;
      opacity: 0.9;
      font-family: var(--font-heading);
    }
    .scoring-guide-section {
      margin-bottom: 25px;
      padding: 15px;
      background-color: var(--color-panel);
      border-radius: var(--border-radius);
      border: 1px solid var(--color-border);
    }
    .scoring-guide-title {
      font-family: var(--font-heading);
      font-size: 14px;
      font-weight: 600;
      color: #1e3a8a;
      margin-bottom: 12px;
      text-align: center;
    }
    .score-ranges { display: flex; justify-content: space-between; gap: 15px; }
    .score-range { flex: 1; text-align: center; padding: 8px; border-radius: 6px; border: 1px solid; }
    .score-range.range-safe { background-color: rgba(110, 169, 0, 0.1); border-color: var(--color-risk-low); }
    .score-range.range-caution { background-color: rgba(255, 140, 0, 0.1); border-color: var(--color-risk-medium); }
    .score-range.range-high { background-color: rgba(161, 11, 43, 0.1); border-color: var(--color-risk-high); }
    .range-number { display: block; font-family: var(--font-heading); font-size: 14px; font-weight: 700; margin-bottom: 2px; }
    .range-safe .range-number { color: var(--color-risk-low); }
    .range-caution .range-number { color: var(--color-risk-medium); }
    .range-high .range-number { color: var(--color-risk-high); }
    .range-label { display: block; font-family: var(--font-heading); font-size: 11px; font-weight: 600; margin-bottom: 3px; }
    .range-description { display: block; font-size: 9px; color: var(--color-text-secondary); line-height: 1.3; }
    .report-footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--color-border);
      text-align: center;
      color: var(--color-text-secondary);
      font-size: 10px;
    }
    .report-footer .headline { font-size: 1.18em; font-weight: 800; margin-bottom: 14px; display: block; }
    .report-footer .disclaimer { font-size: 1.08em; font-weight: 600; color: #7a7f87; margin-bottom: 12px; display: block; }
    .report-footer .methodology { font-size: 1.08em; color: #7a7f87; display: block; }
    .evidence-strip {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      font-size: 0.9em;
      color: #9ca3af;
      line-height: 1.4;
      text-align: center;
    }
    @media print {
      body { font-size: 11px; }
      .report-container { padding: 0; }
      .section { page-break-inside: auto !important; break-inside: auto !important; }
      .finding-item { page-break-inside: avoid; }
      .section-title { break-after: avoid-page; page-break-after: avoid; }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <header class="report-header">
      <div class="header-info">
        <h1>${escapeHtml(meta.name)}</h1>
        <p><span class="info-label">Contract Address:</span> ${escapeHtml(scan.ContractAddress)}</p>
        <p><span class="info-label">Chain:</span> ${escapeHtml(data.chain_display_name)}</p>
        <p><span class="info-label">Scan Time:</span> ${escapeHtml(scan.ScanDate)} <span class="info-label">|</span> ${scan.ScanDuration.toFixed(2)} seconds</p>
        <p style="font-size:9px;color:#9ca3af;margin-top:4px;">Scan based on pre-exploit source code</p>
      </div>
      <div class="risk-score-section">
        <span class="risk-score-value risk-category-${cat}">${currentScore}</span>
        <span class="risk-score-label">${riskLabel(currentScore)}</span>
      </div>
    </header>

    <section class="scoring-guide-section">
      <h3 class="scoring-guide-title">Risk Scoring Guide</h3>
      <div class="score-ranges">
        <div class="score-range range-safe">
          <span class="range-number">0-25</span>
          <span class="range-label">Safe</span>
          <span class="range-description">Low risk protocols</span>
        </div>
        <div class="score-range range-caution">
          <span class="range-number">26-65</span>
          <span class="range-label">Caution</span>
          <span class="range-description">Moderate risk factors present</span>
        </div>
        <div class="score-range range-high">
          <span class="range-number">66-100</span>
          <span class="range-label">High Risk</span>
          <span class="range-description">Significant concerns identified</span>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Risk Profile</h2>
      ${regularFindings.map(f => renderFinding(f, false)).join('')}
      ${multiplierFindings.map(f => renderFinding(f, true)).join('')}
      ${scan.RiskFactors.length === 0 ? '<div class="finding-item"><p>&#10003; No significant risk factors were identified.</p></div>' : ''}
    </section>

    ${scan.MitigationsAndSignals.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Signals &amp; Intelligence</h2>
      ${renderSignals(scan.MitigationsAndSignals, actuarial, currentScore, weight, delta)}
    </section>` : ''}

    <footer class="report-footer">
      <span class="headline">DeRisk DeFi Risk Intelligence Platform</span>
      <span class="disclaimer">Automated heuristic output. Use only as one input in your own due-diligence process. No investment, legal, or tax advice provided.</span>
      <span class="methodology">${actuarialFooter}</span>
      <div class="evidence-strip">
        <strong>Evidence:</strong>
        Chain = ${escapeHtml(data.chain_display_name)} |
        Address ${escapeHtml(scan.ContractAddress.slice(0, 6))}...${escapeHtml(scan.ContractAddress.slice(-4))} |
        Scan ${escapeHtml(scan.ScanDate)} |
        Actuarial weight ${weightPct}%
      </div>
    </footer>
  </div>
  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
