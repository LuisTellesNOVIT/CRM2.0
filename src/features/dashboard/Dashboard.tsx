import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/icons/Icon';
import { TopBar } from '@/components/layout/TopBar';
import { Badge, Card } from '@/components/ui';
import { calc } from '@/lib/calc';
import { findClient } from '@/lib/lookups';
import { formatMoney } from '@/lib/money';
import { generateRecommendations } from '@/lib/recommendations';
import { useAuthStore, useOpportunitiesStore, useUIStore } from '@/stores';
import { Donut } from './Donut';
import { Funnel } from './Funnel';
import { KpiCard } from './KpiCard';
import { ProjectionChart } from './ProjectionChart';
import { RecommendationItem } from './RecommendationItem';

export function Dashboard() {
  const navigate = useNavigate();
  const opportunities = useOpportunitiesStore((s) => s.opportunities);
  const currency = useUIStore((s) => s.currency);
  const currentUser = useAuthStore((s) => s.currentUser);
  const firstName = currentUser?.name.split(' ')[0] ?? '';

  const active = opportunities.filter((o) => o.status !== 'lost');
  const won = opportunities.filter((o) => o.status === 'won' || o.status === 'signing');
  const decided = opportunities.filter((o) =>
    ['won', 'signing', 'lost'].includes(o.status),
  );
  const lost = opportunities.filter((o) => o.status === 'lost');
  const inProposal = opportunities.filter((o) =>
    ['proposal', 'negotiation'].includes(o.status),
  );

  const pipelineActive = active.reduce((s, o) => s + calc.pipelineValue(o), 0);
  const wonValue = won.reduce((s, o) => s + calc.pipelineValue(o), 0);
  const arrWon = won.reduce((s, o) => s + calc.amount12(o), 0);
  const ltv36Won = won.reduce((s, o) => s + calc.ltv36(o), 0);
  const proposalValue = inProposal.reduce((s, o) => s + calc.pipelineValue(o), 0);
  const lostValue = lost.reduce((s, o) => s + calc.pipelineValue(o), 0);
  const closeRate = decided.length ? (won.length / decided.length) * 100 : 0;

  const novitTotal = active
    .filter((o) => o.company === 'NOVIT')
    .reduce((s, o) => s + calc.pipelineValue(o), 0);
  const sharkyTotal = active
    .filter((o) => o.company === 'SHARKY')
    .reduce((s, o) => s + calc.pipelineValue(o), 0);

  const topClients = useMemo(() => {
    const map: Record<string, number> = {};
    active.forEach((o) => {
      map[o.client_id] = (map[o.client_id] || 0) + calc.pipelineValue(o);
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([id, v]) => ({ client: findClient(id), value: v }));
  }, [active]);

  const recs = useMemo(() => generateRecommendations(opportunities), [opportunities]);

  return (
    <>
      <TopBar
        title="Dashboard ejecutivo"
        subtitle={`${firstName}, esto es lo que importa hoy.`}
      />
      <div
        style={{
          padding: '4px 32px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Featured KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 14 }}>
          <KpiCard
            large
            label="Pipeline activo"
            value={formatMoney(pipelineActive, currency, true)}
            hint={`${active.length} opp · setup + 12m`}
            accent="var(--accent)"
            spark={[60, 55, 72, 68, 78, 82, 90, 88, 95]}
            sparkColor="var(--accent)"
            delta={12.4}
          />
          <KpiCard
            label="Ganado"
            value={formatMoney(wonValue, currency, true)}
            hint={`${won.length} cuentas`}
            accent="var(--success)"
            delta={8.2}
          />
          <KpiCard
            label="ARR 12m"
            value={formatMoney(arrWon, currency, true)}
            hint="MRR × 12"
            accent="var(--violet)"
          />
          <KpiCard
            label="LTV 36m"
            value={formatMoney(ltv36Won, currency, true)}
            hint="Setup + 36m"
            accent="var(--info)"
          />
        </div>

        {/* Secondary KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <KpiCard
            label="En propuesta"
            value={formatMoney(proposalValue, currency, true)}
            hint={`${inProposal.length} en juego`}
            accent="var(--warning)"
          />
          <KpiCard
            label="Tasa de cierre"
            value={`${closeRate.toFixed(1)}%`}
            hint={`${won.length} de ${decided.length} decididas`}
            accent="var(--success)"
          />
          <KpiCard
            label="Perdidas"
            value={formatMoney(lostValue, currency, true)}
            hint={`${lost.length} cuentas`}
            accent="var(--danger)"
          />
          <KpiCard
            label="Total opp."
            value={opportunities.length}
            hint={`${active.length} activas`}
            accent="var(--text-2)"
          />
        </div>

        {/* Funnel + recommendations */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
          <Card padding={20}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  Embudo comercial
                </div>
                <div
                  style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}
                >
                  Cantidad y valor por estado
                </div>
              </div>
              <button
                onClick={() => navigate('/kanban')}
                style={linkBtn}
              >
                Ver Kanban <Icon name="arrow_right" size={11} />
              </button>
            </div>
            <Funnel opps={opportunities} />
          </Card>

          <Card padding={0}>
            <div
              style={{
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Icon name="sparkles" size={15} />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                Recomendaciones
              </div>
              <Badge
                color="var(--accent)"
                soft
                style={{ marginLeft: 'auto', fontSize: 10.5 }}
              >
                {recs.length} acciones
              </Badge>
            </div>
            <div
              style={{
                maxHeight: 400,
                overflow: 'auto',
                borderTop: '1px solid var(--border)',
              }}
            >
              {recs.slice(0, 6).map((r) => (
                <RecommendationItem key={r.id} rec={r} />
              ))}
              {!recs.length && (
                <div
                  style={{
                    padding: 24,
                    textAlign: 'center',
                    color: 'var(--text-3)',
                    fontSize: 13,
                  }}
                >
                  Sin recomendaciones por ahora.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Distribution + projection + top clients */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 1.4fr', gap: 14 }}
        >
          <Card padding={20}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: 14,
              }}
            >
              NOVIT vs SHARKY
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}
            >
              <Donut
                data={[
                  { label: 'NOVIT', value: novitTotal, color: 'var(--novit)' },
                  { label: 'SHARKY', value: sharkyTotal, color: 'var(--sharky)' },
                ]}
              />
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {[
                {
                  label: 'NOVIT',
                  value: novitTotal,
                  color: 'var(--novit)',
                  count: active.filter((o) => o.company === 'NOVIT').length,
                },
                {
                  label: 'SHARKY',
                  value: sharkyTotal,
                  color: 'var(--sharky)',
                  count: active.filter((o) => o.company === 'SHARKY').length,
                },
              ].map((d) => (
                <div
                  key={d.label}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 2,
                      background: d.color,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: 'var(--text)',
                      flex: 1,
                    }}
                  >
                    {d.label}
                  </span>
                  <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                    {d.count} opp
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      color: 'var(--text)',
                      fontWeight: 500,
                      fontFeatureSettings: '"tnum"',
                      minWidth: 70,
                      textAlign: 'right',
                    }}
                  >
                    {formatMoney(d.value, currency, true)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding={20}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  Proyección de ingresos
                </div>
                <div
                  style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}
                >
                  Setup + horizontes 12 / 24 / 36 meses · pipeline activo
                </div>
              </div>
              <div
                style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-3)' }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      background: 'var(--novit)',
                      borderRadius: 2,
                    }}
                  />
                  NOVIT
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      background: 'var(--sharky)',
                      borderRadius: 2,
                    }}
                  />
                  SHARKY
                </span>
              </div>
            </div>
            <ProjectionChart opps={active} />
          </Card>

          <Card padding={20}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                Top clientes por pipeline
              </div>
              <button onClick={() => navigate('/clients')} style={linkBtn}>
                Ver todos <Icon name="arrow_right" size={11} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {topClients.map((c, i) => {
                const top = topClients[0].value || 1;
                const pct = (c.value / top) * 100;
                return (
                  <button
                    key={c.client?.id ?? i}
                    onClick={() =>
                      c.client && navigate(`/clients?id=${c.client.id}`)
                    }
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '6px 0',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11.5,
                          color: 'var(--text-3)',
                          width: 14,
                        }}
                      >
                        #{i + 1}
                      </span>
                      <span
                        style={{
                          fontSize: 12.5,
                          color: 'var(--text)',
                          fontWeight: 500,
                          flex: 1,
                        }}
                      >
                        {c.client?.name ?? '—'}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: 'var(--text-2)',
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {formatMoney(c.value, currency, true)}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        borderRadius: 2,
                        background: 'var(--surface-2)',
                        overflow: 'hidden',
                        marginLeft: 22,
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: 'var(--accent)',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

const linkBtn = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-3)',
  fontSize: 12,
  fontFamily: 'inherit',
  cursor: 'pointer',
  display: 'inline-flex',
  gap: 4,
  alignItems: 'center',
} as const;
