import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/icons/Icon';
import { Badge } from '@/components/ui';
import type { Recommendation, RecommendationTarget } from '@/lib/recommendations';

const PALETTE: Record<
  Recommendation['priority'],
  { bg: string; border: string; dot: string; label: string }
> = {
  alta: { bg: '#fef2f2', border: '#fecaca', dot: 'var(--danger)', label: 'Alta' },
  media: { bg: '#fffbeb', border: '#fed7aa', dot: 'var(--warning)', label: 'Media' },
  baja: { bg: 'var(--surface-2)', border: 'var(--border)', dot: 'var(--text-3)', label: 'Baja' },
};

function targetToPath(t: RecommendationTarget): string {
  switch (t.view) {
    case 'kanban':
      return '/kanban';
    case 'leads':
      return '/leads';
    case 'clients':
      return t.id ? `/clients?id=${t.id}` : '/clients';
    case 'opp':
      return `/leads?opp=${t.id}`;
  }
}

export function RecommendationItem({ rec }: { rec: Recommendation }) {
  const navigate = useNavigate();
  const palette = PALETTE[rec.priority];

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: 14,
        borderBottom: '1px solid var(--border)',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          flexShrink: 0,
          background: palette.bg,
          border: `1px solid ${palette.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: palette.dot,
        }}
      >
        <Icon name="sparkles" size={15} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{rec.title}</span>
          <Badge color={palette.dot} soft style={{ fontSize: 10, padding: '1px 6px' }}>
            {palette.label}
          </Badge>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.45 }}>
          {rec.description}
        </div>
      </div>
      {rec.action && (
        <button
          onClick={() => navigate(targetToPath(rec.target))}
          style={{
            padding: '5px 10px',
            fontSize: 11.5,
            fontWeight: 500,
            fontFamily: 'inherit',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {rec.action} <Icon name="chevron" size={11} />
        </button>
      )}
    </div>
  );
}
