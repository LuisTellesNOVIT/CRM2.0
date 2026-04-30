import { Icon } from '@/components/icons/Icon';
import { Card } from '@/components/ui';
import { STATUSES } from '@/data/mock';

export function PipelineSection() {
  return (
    <Card padding={0}>
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Etapas del pipeline
      </div>
      {STATUSES.map((s) => (
        <div
          key={s.id}
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Icon name="drag" size={14} style={{ color: 'var(--text-3)' }} />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: s.color,
            }}
          />
          <span style={{ fontSize: 13, flex: 1 }}>{s.label}</span>
          <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
            Probabilidad {s.prob}%
          </span>
        </div>
      ))}
    </Card>
  );
}
