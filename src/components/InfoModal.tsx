import { useEffect } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
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
        <svg className="info-modal-wordmark" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs><style>{`.im-wm { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 32px; letter-spacing: 0.08em; fill: #ffffff; }`}</style></defs>
          <text className="im-wm" x="100" y="32" textAnchor="middle">DeRisk</text>
        </svg>
        <h2 className="info-modal-title">Time Machine Demo</h2>
        <div className="info-modal-body">
          <p>
            The Time Machine module runs our <strong>universal risk intelligence engine</strong> against
            the pre-exploit source code of the largest DeFi exploits in history.
          </p>
          <p>
            Our engine has identified over <span className="info-highlight">$2B</span> in threat
            patterns across our curated exploit collection, demonstrating detection capabilities
            that existed before each attack occurred.
          </p>
          <p>
            Choose from our curated selection to see how the DeRisk platform reports on the specific
            vulnerabilities and threat vectors that led to each exploit.
          </p>
        </div>
      </div>
    </div>
  );
}
