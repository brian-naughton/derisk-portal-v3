import { useState, useCallback, useEffect } from 'react';
import type { ActuarialData } from '../types/exploit.ts';

interface SliderState {
  weight: number;
  setWeight: (w: number) => void;
  currentScore: number;
  delta: number;
  refinedValue: number;
}

export function useActuarialSlider(actuarial: ActuarialData, baseScore: number): SliderState {
  const [weight, setWeight] = useState(30);

  // Reset to 30% when exploit changes
  useEffect(() => {
    setWeight(30);
  }, [actuarial.pre_actuarial_score]);

  const idx = Math.round(weight / 10);
  const delta = actuarial.slider_deltas[idx] ?? 0;
  const rawScore = actuarial.pre_actuarial_score + delta;
  const currentScore = Math.max(5, Math.min(100, rawScore));
  const refinedValue = actuarial.base + delta;

  return { weight, setWeight, currentScore, delta, refinedValue };
}
