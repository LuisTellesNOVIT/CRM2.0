import type { CSSProperties } from 'react';
import { formatMoney } from '@/lib/money';
import { useUIStore } from '@/stores';
import type { Currency } from '@/types';

interface MoneyProps {
  amount: number | null | undefined;
  currency?: Currency;
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Money({ amount, currency, compact, className, style }: MoneyProps) {
  const storeCurrency = useUIStore((s) => s.currency);
  const c = currency ?? storeCurrency;
  return (
    <span className={className} style={style}>
      {formatMoney(amount, c, compact)}
    </span>
  );
}
