import type { ExploitData } from '../types/exploit.ts';
import { getRiskClass, formatLoss } from '../utils/formatting.ts';
import { exploitsList, exploitsMap } from '../data/index.ts';

interface CommandBarProps {
  data: ExploitData;
  currentScore: number;
  selectedId: string;
  onSelect: (id: string) => void;
  onHome: () => void;
}

export function CommandBar({ data, currentScore, selectedId, onSelect, onHome }: CommandBarProps) {
  const riskClass = getRiskClass(currentScore);

  return (
    <div className="command-bar">
      <span className={`cmd-protocol tm-hero-name risk-${riskClass}`}>
        {data.exploit_meta.name}
      </span>
      <span className="cmd-chain-badge">{data.chain_display_name}</span>
      <span className="cmd-loss-badge-bar">{formatLoss(data.exploit_meta.loss_amount_usd)}</span>
      <span className="cmd-address">{data.scan_result.ContractAddress}</span>
      <span className="cmd-spacer" />
      <select
        className="cmd-select"
        value={selectedId}
        onChange={e => onSelect(e.target.value)}
      >
        {exploitsList.map(id => {
          const ex = exploitsMap[id] as ExploitData;
          return (
            <option key={id} value={id}>
              {ex.exploit_meta.name} ({ex.scan_result.RiskScore}/100)
            </option>
          );
        })}
      </select>
      <button className="cmd-home-btn" onClick={onHome} title="Back to Home">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>
    </div>
  );
}
