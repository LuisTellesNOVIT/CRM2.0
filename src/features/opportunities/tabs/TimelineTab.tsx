import { Icon, type IconName } from '@/components/icons/Icon';
import { Badge } from '@/components/ui';
import { relativeDate, shortDate } from '@/lib/dates';
import { useInteractionsStore } from '@/stores';
import type { InteractionType, Opportunity } from '@/types';

const ICON_FOR: Record<InteractionType, IconName> = {
  whatsapp: 'whatsapp',
  email: 'mail',
  call: 'phone',
  meeting: 'calendar',
  note: 'edit',
};

const COLOR_FOR: Record<InteractionType, string> = {
  whatsapp: '#25d366',
  email: 'var(--accent)',
  call: 'var(--violet)',
  meeting: 'var(--info)',
  note: 'var(--text-3)',
};

export function TimelineTab({ opp }: { opp: Opportunity }) {
  const interactions = useInteractionsStore((s) => s.interactions);
  const oppInter = interactions
    .filter((i) => i.opportunity_id === opp.id)
    .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());

  if (!oppInter.length) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: 'center',
          color: 'var(--text-3)',
          fontSize: 13,
        }}
      >
        Sin actividad
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: 13,
          top: 12,
          bottom: 12,
          width: 1,
          background: 'var(--border)',
        }}
      />
      {oppInter.map((i) => {
        const color = COLOR_FOR[i.type];
        return (
          <div
            key={i.id}
            style={{
              display: 'flex',
              gap: 14,
              paddingBottom: 16,
              position: 'relative',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                background: 'var(--surface)',
                border: `2px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color,
                flexShrink: 0,
                zIndex: 1,
              }}
            >
              <Icon name={ICON_FOR[i.type]} size={12} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 3,
                }}
              >
                <span
                  style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}
                >
                  {i.subject || i.type}
                </span>
                <Badge color="var(--text-3)" soft style={{ fontSize: 10 }}>
                  {i.direction === 'in'
                    ? '← entrante'
                    : i.direction === 'out'
                      ? 'saliente →'
                      : i.type}
                </Badge>
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--text-3)',
                    marginLeft: 'auto',
                  }}
                >
                  {shortDate(i.sent_at)} · {relativeDate(i.sent_at)}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: 'var(--text-2)',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {i.message}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
