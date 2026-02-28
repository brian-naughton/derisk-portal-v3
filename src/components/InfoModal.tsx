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
        <h2 className="info-modal-title">DeRisk Time Machine</h2>
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
