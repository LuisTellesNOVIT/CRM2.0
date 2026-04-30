import { formatMoney } from '@/lib/money';
import { useUIStore } from '@/stores';
import type { Opportunity } from '@/types';

interface Horizon {
  id: 'setup' | '12' | '24' | '36';
  label: string;
}

const HORIZONS: Horizon[] = [
  { id: 'setup', label: 'Setup' },
  { id: '12', label: '12 meses' },
  { id: '24', label: '24 meses' },
  { id: '36', label: '36 meses' },
];

function amountFor(opps: Opportunity[], h: Horizon['id']): number {
  if (h === 'setup') return opps.reduce((s, o) => s + (o.setup || 0), 0);
  const months = Number(h);
  return opps.reduce((s, o) => s + (o.monthly || 0) * months, 0);
}

export function ProjectionChart({ opps }: { opps: Opportunity[] }) {
  const currency = useUIStore((s) => s.currency);
  const novitOpps = opps.filter((o) => o.company === 'NOVIT');

  const data = HORIZONS.map((h) => {
    const amount = amountFor(opps, h.id);
    const novit = amountFor(novitOpps, h.id);
    return { ...h, amount, novit, sharky: amount - novit };
  });

  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 12,
        height: 200,
        padding: '0 4px',
      }}
    >
      {data.map((h) => {
        const totalH = (h.amount / max) * 170;
        const novitH = h.amount ? (h.novit / h.amount) * totalH : 0;
        return (
          <div
            key={h.id}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--text-2)',
                fontWeight: 500,
                fontFeatureSettings: '"tnum"',
              }}
            >
              {formatMoney(h.amount, currency, true)}
            </div>
            <div
              title={`NOVIT ${formatMoney(h.novit, currency, true)} · SHARKY ${formatMoney(
                h.sharky,
                currency,
                true,
              )}`}
              style={{
                width: '100%',
                height: totalH,
                borderRadius: 6,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                background: 'var(--surface-2)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: totalH - novitH,
                  background: 'var(--sharky)',
                  transition: 'height 0.4s',
                }}
              />
              <div
                style={{
                  height: novitH,
                  background: 'var(--novit)',
                  transition: 'height 0.4s',
                }}
              />
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{h.label}</div>
          </div>
        );
      })}
    </div>
  );
}
