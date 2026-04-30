import { Card } from '@/components/ui';
import { WHATSAPP_TEMPLATES } from '@/data/mock';
import { shortDate } from '@/lib/dates';
import { findClient, findUser } from '@/lib/lookups';
import { useAuthStore, useInteractionsStore } from '@/stores';
import type { Opportunity } from '@/types';
import { MessageComposer } from '../MessageComposer';

export function WhatsAppTab({ opp }: { opp: Opportunity }) {
  const interactions = useInteractionsStore((s) => s.interactions);
  const addInteraction = useInteractionsStore((s) => s.add);
  const currentUser = useAuthStore((s) => s.currentUser);
  const c = findClient(opp.client_id);
  const owner = findUser(opp.owner_id);

  if (!c) return null;

  const oppInter = interactions
    .filter((i) => i.opportunity_id === opp.id && i.type === 'whatsapp')
    .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <MessageComposer
        kind="whatsapp"
        opp={opp}
        client={c}
        owner={owner}
        templates={WHATSAPP_TEMPLATES}
        onSend={({ body }) => {
          if (!currentUser) return;
          addInteraction({
            id: `i${Date.now()}`,
            opportunity_id: opp.id,
            type: 'whatsapp',
            direction: 'out',
            subject: 'WhatsApp manual',
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
          Historial WhatsApp ({oppInter.length})
        </div>
        <div
          style={{
            padding: 14,
            background: '#ece5dd',
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {oppInter.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: 'var(--text-3)',
                padding: 20,
              }}
            >
              Sin mensajes
            </div>
          )}
          {[...oppInter].reverse().map((i) => {
            const out = i.direction === 'out';
            return (
              <div
                key={i.id}
                style={{
                  display: 'flex',
                  justifyContent: out ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '78%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: out ? '#dcf8c6' : '#fff',
                    fontSize: 12.5,
                    color: '#111',
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                    boxShadow: '0 1px 1px rgba(0,0,0,0.06)',
                  }}
                >
                  {i.message}
                  <div
                    style={{
                      fontSize: 9.5,
                      color: '#667781',
                      marginTop: 4,
                      textAlign: 'right',
                    }}
                  >
                    {shortDate(i.sent_at)} · {i.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
