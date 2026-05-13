import { calc } from '@/lib/calc';
import { findStatus } from '@/lib/lookups';
import { formatMoney } from '@/lib/money';
import { useUIStore } from '@/stores';
import type { Opportunity, StatusId } from '@/types';

const STAGES: StatusId[] = [
  'lead',
  'contacted',
  'demo',
  'proposal',
  'negotiation',
  'signing',
  'won',
];

interface FunnelProps {
  opps: Opportunity[];
  onStageClick?: (status: StatusId) => void;
}

export function Funnel({ opps, onStageClick }: FunnelProps) {
  const currency = useUIStore((s) => s.currency);
  const data = STAGES.map((s) => {
    const list = opps.filter((o) => o.status === s);
    const value = list.reduce((sum, o) => sum + calc.pipelineValue(o), 0);
    return { status: findStatus(s)!, count: list.length, value };
  });
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map((d) => {
        const pct = (d.value / maxVal) * 100;
        const clickable = !!onStageClick;
        return (
          <div
            key={d.status.id}
            onClick={() => clickable && onStageClick(d.status.id)}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={
              clickable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onStageClick(d.status.id);
                    }
                  }
                : undefined
            }
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr 130px',
              alignItems: 'center',
              gap: 12,
              cursor: clickable ? 'pointer' : 'default',
              padding: '4px 0',
              borderRadius: 6,
              transition: 'background 0.15s',
            }}
            onMouseEnter={
              clickable
                ? (e) => (e.currentTarget.style.background = 'var(--surface-2)')
                : undefined
            }
            onMouseLeave={
              clickable
                ? (e) => (e.currentTarget.style.background = 'transparent')
                : undefined
            }
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  background: d.status.color,
                }}
              />
              <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{d.status.label}</span>
            </div>
            <div
              style={{
                position: 'relative',
                height: 28,
                background: 'var(--surface-2)',
                borderRadius: 6,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${Math.max(pct, 2)}%`,
                  background: `linear-gradient(90deg, ${d.status.color}cc, ${d.status.color})`,
                  borderRadius: 6,
                  transition: 'width 0.4s ease',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: '#fff',
                }}
              >
                {d.count} {d.count === 1 ? 'oportunidad' : 'oportunidades'}
              </div>
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: 'var(--text)',
                fontWeight: 500,
                textAlign: 'right',
                fontFeatureSettings: '"tnum"',
              }}
            >
              {formatMoney(d.value, currency, true)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
