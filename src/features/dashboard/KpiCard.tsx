import { Icon, type IconName } from '@/components/icons/Icon';
import { Sparkline } from '@/components/ui';

interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  delta?: number;
  deltaLabel?: string;
  accent?: string;
  spark?: number[];
  sparkColor?: string;
  icon?: IconName;
  large?: boolean;
}

export function KpiCard({
  label,
  value,
  hint,
  delta,
  deltaLabel,
  accent,
  spark,
  sparkColor,
  icon,
  large,
}: KpiCardProps) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: large ? 22 : 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        position: 'relative',
        minHeight: large ? 140 : 112,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {accent && (
          <span style={{ width: 6, height: 6, borderRadius: 2, background: accent }} />
        )}
        <span
          style={{
            fontSize: 10.5,
            color: 'var(--text-3)',
            fontWeight: 500,
            letterSpacing: 0.3,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        {icon && (
          <Icon
            name={icon}
            size={13}
            style={{ color: 'var(--text-3)', marginLeft: 'auto' }}
          />
        )}
      </div>
      <div
        style={{
          fontSize: large ? 30 : 24,
          fontWeight: 600,
          color: 'var(--text)',
          letterSpacing: -0.6,
          lineHeight: 1.1,
          fontFeatureSettings: '"tnum"',
        }}
      >
        {value}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 'auto',
          flexWrap: 'wrap',
        }}
      >
        {delta != null && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 11.5,
              fontWeight: 500,
              color: delta >= 0 ? 'var(--success)' : 'var(--danger)',
            }}
          >
            <Icon name={delta >= 0 ? 'arrow_up' : 'arrow_down'} size={11} />
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        {hint && (
          <span
            style={{
              fontSize: 11.5,
              color: 'var(--text-3)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
              flex: 1,
            }}
          >
            {hint}
          </span>
        )}
        {deltaLabel && (
          <span style={{ fontSize: 11.5, color: 'var(--text-3)', marginLeft: 'auto' }}>
            {deltaLabel}
          </span>
        )}
        {spark && (
          <div style={{ marginLeft: 'auto' }}>
            <Sparkline
              data={spark}
              color={sparkColor || 'var(--accent)'}
              width={70}
              height={24}
            />
          </div>
        )}
      </div>
    </div>
  );
}
