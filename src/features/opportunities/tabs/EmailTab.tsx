import { Icon } from '@/components/icons/Icon';
import { Badge, Card } from '@/components/ui';
import { EMAIL_TEMPLATES } from '@/data/mock';
import { shortDate } from '@/lib/dates';
import { findClient, findUser } from '@/lib/lookups';
import { useAuthStore, useInteractionsStore } from '@/stores';
import type { Opportunity } from '@/types';
import { MessageComposer } from '../MessageComposer';

export function EmailTab({ opp }: { opp: Opportunity }) {
  const interactions = useInteractionsStore((s) => s.interactions);
  const addInteraction = useInteractionsStore((s) => s.add);
  const currentUser = useAuthStore((s) => s.currentUser);
  const c = findClient(opp.client_id);
  const owner = findUser(opp.owner_id);

  if (!c) return null;

  const oppInter = interactions
    .filter((i) => i.opportunity_id === opp.id && i.type === 'email')
    .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <MessageComposer
        kind="email"
        opp={opp}
        client={c}
        owner={owner}
        templates={EMAIL_TEMPLATES}
        onSend={({ subject, body }) => {
          if (!currentUser) return;
          addInteraction({
            id: `i${Date.now()}`,
            opportunity_id: opp.id,
            type: 'email',
            direction: 'out',
            subject: subject ?? '',
            message: body,
            status: 'enviado',
            sent_at: new Date().toISOString(),
            created_by: currentUser.id,
          });
        }}
      />
      <Card padding={0}>
        <div
          style={{
            padding: '12px 14px',
            borderBottom: '1px solid var(--border)',
            fontSize: 12.5,
            fontWeight: 600,
          }}
        >
          Correos enviados ({oppInter.length})
        </div>
        {oppInter.length === 0 && (
          <div
            style={{
              padding: 20,
              textAlign: 'center',
              fontSize: 12,
              color: 'var(--text-3)',
            }}
          >
            Sin correos
          </div>
        )}
        {oppInter.map((i) => (
          <div
            key={i.id}
            style={{ padding: 14, borderBottom: '1px solid var(--border)' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
              }}
            >
              <Icon name="mail" size={13} style={{ color: 'var(--text-3)' }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1 }}>{i.subject}</span>
              <Badge color="var(--success)" soft style={{ fontSize: 10 }}>
                {i.status}
              </Badge>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                {shortDate(i.sent_at)}
              </span>
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--text-2)',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
              }}
            >
              {i.message}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
