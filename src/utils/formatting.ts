export function formatLoss(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${Math.floor(amount / 1e6)}M`;
  if (amount > 0) return `$${amount.toLocaleString()}`;
  return 'Unknown';
}

export function getRiskClass(score: number): 'high' | 'med' | 'low' {
  if (score >= 66) return 'high';
  if (score >= 26) return 'med';
  return 'low';
}

export function getRiskLabel(score: number): string {
  if (score >= 66) return 'SMOKING GUN';
  if (score >= 26) return 'CAUTION';
  return 'MINIMAL';
}

export function getRiskDescription(score: number): string {
  if (score >= 66) return 'High Risk';
  if (score >= 26) return 'Caution';
  return 'Safe';
}

export function stripPts(description: string): string {
  return description.replace(/\s*\(-?\d+\s*pts?\)/i, '');
}

export function formatVector(vector: string): string {
  return vector.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr.slice(0, 10);
}

export function formatYear(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr.slice(0, 4);
}
