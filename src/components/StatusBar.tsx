import type { ScanResult } from '../types/exploit.ts';

interface StatusBarProps {
  scanResult: ScanResult;
}

export function StatusBar({ scanResult }: StatusBarProps) {
  return (
    <div className="status-bar">
      <span>DeRisk CIR v2.6 — Time Machine</span>
      <span>
        {scanResult.ScanDate} — {scanResult.ScanDuration.toFixed(2)}s — Scan based on pre-exploit source code
      </span>
    </div>
  );
}
