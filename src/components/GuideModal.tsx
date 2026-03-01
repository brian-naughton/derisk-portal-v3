import { useEffect } from 'react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="info-overlay" onClick={onClose}>
      <div className="info-modal" onClick={e => e.stopPropagation()}>
        <button className="info-modal-close" onClick={onClose}>&times;</button>
        <h2 className="info-modal-title">What Am I Looking At?</h2>
        <div className="info-modal-body">
          <p>
            This dashboard displays the output of DeRisk's <strong>universal cross-chain
            risk intelligence engine</strong>. For the Time Machine demo, we sourced each
            protocol's smart contract source code from before the time of its exploit and
            cached it locally — the engine is reading the exact code that existed when the
            vulnerability was live.
          </p>
          <p>
            The dashboard is organised into three panels. On the left, the <strong>risk
            score</strong> and its composition — how the final number was built from raw
            findings, cluster multipliers, mitigations, and actuarial adjustment. In the
            centre, the <strong>scan results</strong>: a series of Risk Findings ranked by
            severity, followed by Mitigations — credits awarded for adopting security best
            practices like reentrancy guards, timelocked governance, or audited library
            standards. Below that, a <strong>Time Machine Post-Mortem</strong> explains how
            the actual attack played out and what vulnerabilities it exploited. On the right,
            exploit intelligence, contract metadata, and the actuarial model that refines
            scores using data from 1,400+ historical incidents.
          </p>
          <p>
            The colour system maps directly to risk: <strong>red</strong> for high-severity
            findings (66–100), <strong>amber</strong> for moderate (26–65),
            and <strong>green</strong> for low risk (0–25) or positive mitigations. Every
            score, finding, and signal uses this same palette.
          </p>
        </div>
      </div>
    </div>
  );
}
