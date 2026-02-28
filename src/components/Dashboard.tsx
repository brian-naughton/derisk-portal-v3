import type { ExploitData } from '../types/exploit.ts';
import { useActuarialSlider } from '../hooks/useActuarialSlider.ts';
import { CommandBar } from './CommandBar.tsx';
import { ScorePanel } from './ScorePanel.tsx';
import { FindingsPanel } from './FindingsPanel.tsx';
import { IntelPanel } from './IntelPanel.tsx';
import { StatusBar } from './StatusBar.tsx';

interface DashboardProps {
  data: ExploitData;
  selectedId: string;
  onSelectExploit: (id: string) => void;
  onHome: () => void;
}

export function Dashboard({ data, selectedId, onSelectExploit, onHome }: DashboardProps) {
  const { weight, setWeight, currentScore, delta } = useActuarialSlider(
    data.actuarial,
    data.scan_result.RiskScore
  );

  return (
    <div className="dashboard">
      <CommandBar
        data={data}
        currentScore={currentScore}
        selectedId={selectedId}
        onSelect={onSelectExploit}
        onHome={onHome}
      />
      <ScorePanel data={data} currentScore={currentScore} delta={delta} />
      <FindingsPanel data={data} />
      <IntelPanel
        data={data}
        currentScore={currentScore}
        delta={delta}
        weight={weight}
        onWeightChange={setWeight}
      />
      <StatusBar scanResult={data.scan_result} />
    </div>
  );
}
