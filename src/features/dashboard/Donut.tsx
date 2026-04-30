import { formatMoney } from '@/lib/money';
import { useUIStore } from '@/stores';

interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

interface DonutProps {
  data: DonutDatum[];
  size?: number;
}

export function Donut({ data, size = 140 }: DonutProps) {
  const currency = useUIStore((s) => s.currency);
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = size / 2 - 14;
  const circumference = 2 * Math.PI * r;
  let off = 0;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d) => {
          const pct = total ? d.value / total : 0;
          const dash = pct * circumference;
          const gap = circumference - dash;
          const seg = (
            <circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={14}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-off}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          off += dash;
          return seg;
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--text)',
            letterSpacing: -0.4,
            fontFeatureSettings: '"tnum"',
          }}
        >
          {formatMoney(total, currency, true)}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 2 }}>
          Total pipeline
        </div>
      </div>
    </div>
  );
}
