import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Badge, Card, CompanyTag, StatusPill } from '@/components/ui';
import { calc } from '@/lib/calc';
import { findClient } from '@/lib/lookups';
import { formatMoney } from '@/lib/money';
import { useOpportunitiesStore, useUIStore } from '@/stores';
import type { Client, Opportunity } from '@/types';

interface Group {
  client: Client;
  opps: Opportunity[];
}

export function ClientsView() {
  const navigate = useNavigate();
  const opportunities = useOpportunitiesStore((s) => s.opportunities);
  const currency = useUIStore((s) => s.currency);

  const groups = useMemo<Group[]>(() => {
    const map: Record<string, Group> = {};
    opportunities.forEach((o) => {
      const c = findClient(o.client_id);
      if (!c) return;
      if (!map[c.id]) map[c.id] = { client: c, opps: [] };
      map[c.id].opps.push(o);
    });
    return Object.values(map).sort((a, b) => {
      const av = a.opps.reduce((s, o) => s + calc.pipelineValue(o), 0);
      const bv = b.opps.reduce((s, o) => s + calc.pipelineValue(o), 0);
      return bv - av;
    });
  }, [opportunities]);

  const total = groups.reduce(
    (s, g) => s + g.opps.reduce((ss, o) => ss + calc.pipelineValue(o), 0),
    0,
  );
  const avg = groups.length ? total / groups.length : 0;
  const top = groups[0];
  const totalDeals = opportunities.length;
  const topPipe = top?.opps.reduce((s, o) => s + calc.pipelineValue(o), 0) ?? 0;

  return (
    <>
      <TopBar title="Clientes" subtitle="Pipeline agrupado por cuenta." />
      <div
        style={{
          padding: '4px 32px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <SummaryCard
            label="Clientes únicos"
            value={String(groups.length)}
            sub={`${totalDeals} deals totales`}
          />
          <SummaryCard
            label="Pipeline total"
            value={formatMoney(total, currency, true)}
            sub="setup + 12m"
          />
          <SummaryCard
            label="Ticket promedio"
            value={formatMoney(avg, currency, true)}
            sub="por cliente"
          />
          <SummaryCard
            label="Top cliente"
            value={top?.client.name ?? '—'}
            sub={formatMoney(topPipe, currency, true)}
            small
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {groups.map((g) => (
            <ClientCard
              key={g.client.id}
              group={g}
              currency={currency}
              onOppClick={(id) => navigate(`/leads?opp=${id}`)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  small,
}: {
  label: string;
  value: string;
  sub: string;
  small?: boolean;
}) {
  return (
    <Card padding={16}>
      <div
        style={{
          fontSize: 11.5,
          color: 'var(--text-3)',
          textTransform: 'uppercase',
          letterSpacing: 0.3,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: small ? 18 : 22, fontWeight: 600, color: 'var(--text)' }}>
        {value}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 }}>{sub}</div>
    </Card>
  );
}

function ClientCard({
  group,
  currency,
  onOppClick,
}: {
  group: Group;
  currency: ReturnType<typeof useUIStore.getState>['currency'];
  onOppClick: (id: string) => void;
}) {
  const setupTotal = group.opps.reduce((s, o) => s + (o.setup || 0), 0);
  const monthlyTotal = group.opps.reduce((s, o) => s + (o.monthly || 0), 0);
  const ltv36 = group.opps.reduce((s, o) => s + calc.ltv36(o), 0);
  const pipe = group.opps.reduce((s, o) => s + calc.pipelineValue(o), 0);
  const novitN = group.opps.filter((o) => o.company === 'NOVIT').length;
  const sharkyN = group.opps.filter((o) => o.company === 'SHARKY').length;
  const initials = group.client.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <Card padding={0}>
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-2)',
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
            {group.client.name}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
            {group.client.industry} · {group.client.contact}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {novitN > 0 && (
            <Badge color="var(--novit)" soft style={{ fontSize: 10 }}>
              {novitN} NOVIT
            </Badge>
          )}
          {sharkyN > 0 && (
            <Badge color="var(--sharky)" soft style={{ fontSize: 10 }}>
              {sharkyN} SHARKY
            </Badge>
          )}
        </div>
      </div>

      <div
        style={{
          padding: '12px 16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
          borderBottom: '1px solid var(--border)',
        }}
      >
        {[
          { l: 'Pipeline', v: formatMoney(pipe, currency, true), c: 'var(--accent)' },
          { l: 'Setup', v: formatMoney(setupTotal, currency, true) },
          { l: 'Mensual', v: formatMoney(monthlyTotal, currency, true) },
          { l: 'LTV 36m', v: formatMoney(ltv36, currency, true), c: 'var(--success)' },
        ].map((s) => (
          <div key={s.l}>
            <div
              style={{
                fontSize: 10.5,
                color: 'var(--text-3)',
                textTransform: 'uppercase',
                letterSpacing: 0.3,
              }}
            >
              {s.l}
            </div>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: s.c || 'var(--text)',
                marginTop: 2,
                fontFeatureSettings: '"tnum"',
              }}
            >
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <div>
        {group.opps.map((o) => (
          <button
            key={o.id}
            onClick={() => onOppClick(o.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              borderTop: '1px solid var(--border)',
              borderLeft: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'var(--surface-2)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          >
            <CompanyTag company={o.company} size="sm" />
            <span
              style={{
                fontSize: 12.5,
                color: 'var(--text)',
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {o.project}
            </span>
            <StatusPill status={o.status} size="sm" />
            <span
              style={{
                fontSize: 12,
                color: 'var(--text-2)',
                fontFeatureSettings: '"tnum"',
                minWidth: 80,
                textAlign: 'right',
              }}
            >
              {formatMoney(calc.pipelineValue(o), currency, true)}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
