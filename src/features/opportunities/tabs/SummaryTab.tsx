import type { ReactNode } from 'react';
import { Icon } from '@/components/icons/Icon';
import { Avatar, Badge } from '@/components/ui';
import { STATUSES } from '@/data/mock';
import { calc } from '@/lib/calc';
import { daysBetween, relativeDate, shortDate } from '@/lib/dates';
import { findClient, findStatus, findUser } from '@/lib/lookups';
import { formatMoney } from '@/lib/money';
import { useOpportunitiesStore, useUIStore } from '@/stores';
import type { Opportunity, StatusId } from '@/types';

interface Props {
  opp: Opportunity;
}

export function SummaryTab({ opp }: Props) {
  const currency = useUIStore((s) => s.currency);
  const setStatus = useOpportunitiesStore((s) => s.setStatus);
  const c = findClient(opp.client_id);
  const owner = findUser(opp.owner_id);

  if (!c) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { l: 'Setup', v: formatMoney(opp.setup, currency, true), c: 'var(--warning)' },
          { l: 'Mensual', v: formatMoney(opp.monthly, currency, true), c: 'var(--accent)' },
          {
            l: 'Pipeline (s+12m)',
            v: formatMoney(calc.pipelineValue(opp), currency, true),
            c: 'var(--violet)',
          },
          {
            l: 'LTV 36m',
            v: formatMoney(calc.ltv36(opp), currency, true),
            c: 'var(--success)',
          },
        ].map((s) => (
          <div
            key={s.l}
            style={{
              padding: 12,
              border: '1px solid var(--border)',
              borderRadius: 10,
              background: 'var(--surface-2)',
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                color: 'var(--text-3)',
                textTransform: 'uppercase',
                letterSpacing: 0.3,
                marginBottom: 4,
              }}
            >
              {s.l}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: s.c,
                fontFeatureSettings: '"tnum"',
              }}
            >
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div style={labelStyle}>Mover a estado</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {STATUSES.filter((s) => s.id !== 'lost').map((s) => {
            const active = opp.status === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStatus(opp.id, s.id)}
                style={{
                  padding: '6px 10px',
                  fontSize: 11.5,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  borderRadius: 6,
                  border: `1px solid ${active ? s.color : 'var(--border)'}`,
                  background: active
                    ? `color-mix(in srgb, ${s.color} 12%, transparent)`
                    : 'var(--surface)',
                  color: active ? s.color : 'var(--text-2)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    background: s.color,
                  }}
                />
                {s.label}
              </button>
            );
          })}
          <button
            onClick={() => setStatus(opp.id, 'lost')}
            style={{
              padding: '6px 10px',
              fontSize: 11.5,
              fontWeight: 500,
              fontFamily: 'inherit',
              borderRadius: 6,
              border: '1px dashed color-mix(in srgb, var(--danger) 40%, transparent)',
              background: 'var(--surface)',
              color: 'var(--danger)',
              cursor: 'pointer',
            }}
          >
            Marcar perdido
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DetailGrid
          title="Cliente"
          rows={[
            ['Empresa', c.name],
            ['Industria', c.industry],
            ['Contacto', c.contact],
            ['Email', c.email],
            ['Teléfono', c.phone],
          ]}
        />
        <DetailGrid
          title="Comercial"
          rows={[
            [
              'Responsable',
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Avatar user={owner} size={18} />
                {owner?.name ?? '—'}
              </span>,
            ],
            ['Fuente', opp.source],
            ['Probabilidad', `${findStatus(opp.status)?.prob ?? 0}%`],
            ['Ingreso', shortDate(opp.created)],
            ['Última interacción', `${shortDate(opp.last)} · ${relativeDate(opp.last)}`],
            ['Próxima acción', opp.next_action || '—'],
            ['Fecha próx. acción', opp.next_date ? shortDate(opp.next_date) : '—'],
          ]}
        />
      </div>

      {opp.tags?.length > 0 && (
        <div>
          <div style={labelStyle}>Etiquetas</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {opp.tags.map((t) => (
              <Badge key={t} color="var(--text-2)" soft>
                {t}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {opp.notes && (
        <div>
          <div style={labelStyle}>Observaciones</div>
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              fontSize: 12.5,
              color: 'var(--text-2)',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
            }}
          >
            {opp.notes}
          </div>
        </div>
      )}

      {opp.lost_reason && (
        <div
          style={{
            padding: 12,
            borderRadius: 10,
            background: '#fef2f2',
            border: '1px solid #fecaca',
            fontSize: 12.5,
            color: 'var(--danger)',
          }}
        >
          <strong>Motivo de pérdida:</strong> {opp.lost_reason}
        </div>
      )}

      <SmartHint opp={opp} />
    </div>
  );
}

function SmartHint({ opp }: { opp: Opportunity }) {
  const status = opp.status as StatusId;
  let hint: { msg: string; color: string } | null = null;
  if (status === 'signing')
    hint = {
      msg: 'Cierre inmediato — coordina firma esta semana y prepara onboarding.',
      color: 'var(--warning)',
    };
  else if (status === 'proposal' && daysBetween(opp.last) >= 7)
    hint = {
      msg: `Propuesta sin respuesta hace ${daysBetween(opp.last)}d. Envía WhatsApp de seguimiento o agenda llamada.`,
      color: 'var(--danger)',
    };
  else if (status === 'demo')
    hint = {
      msg: 'Buen momento para enviar propuesta — la temperatura del lead es alta dentro de 7 días post-demo.',
      color: 'var(--accent)',
    };
  else if (status === 'negotiation')
    hint = {
      msg: 'Identifica el bloqueo (precio, alcance, timing) y mueve a firma.',
      color: 'var(--violet)',
    };
  else if (status === 'lead')
    hint = {
      msg: 'Primer contacto en menos de 24h aumenta la conversión 3x.',
      color: 'var(--info)',
    };
  if (!hint) return null;
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 10,
        background: `color-mix(in srgb, ${hint.color} 7%, transparent)`,
        border: `1px solid color-mix(in srgb, ${hint.color} 22%, transparent)`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
      }}
    >
      <Icon name="sparkles" size={15} style={{ color: hint.color, marginTop: 1 }} />
      <div>
        <div
          style={{
            fontSize: 11,
            color: hint.color,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.3,
            marginBottom: 2,
          }}
        >
          Recomendación
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--text)' }}>{hint.msg}</div>
      </div>
    </div>
  );
}

function DetailGrid({
  title,
  rows,
}: {
  title: string;
  rows: [string, ReactNode][];
}) {
  return (
    <div>
      <div style={labelStyle}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map(([k, v], i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 12.5,
              padding: '4px 0',
              borderBottom:
                i < rows.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <span style={{ color: 'var(--text-3)', minWidth: 110 }}>{k}</span>
            <span style={{ color: 'var(--text)', flex: 1, textAlign: 'right' }}>
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 11.5,
  color: 'var(--text-3)',
  textTransform: 'uppercase' as const,
  letterSpacing: 0.3,
  marginBottom: 8,
};
