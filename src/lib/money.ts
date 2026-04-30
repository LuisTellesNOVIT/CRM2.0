import type { Currency } from '@/types';

export const FX_PEN_USD = 3.75;

export function formatMoney(amount: number | null | undefined, currency: Currency = 'PEN', compact = false): string {
  if (amount == null || isNaN(amount)) return '—';
  const fx = currency === 'USD' ? FX_PEN_USD : 1;
  const value = amount / fx;
  const symbol = currency === 'USD' ? '$' : 'S/';
  if (compact) {
    if (Math.abs(value) >= 1_000_000) return `${symbol} ${(value / 1_000_000).toFixed(1)}M`;
    if (Math.abs(value) >= 1_000) return `${symbol} ${(value / 1_000).toFixed(0)}K`;
    return `${symbol} ${value.toFixed(0)}`;
  }
  return `${symbol} ${value.toLocaleString('es-PE', { maximumFractionDigits: 0 })}`;
}
