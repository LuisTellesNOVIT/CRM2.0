import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/icons/Icon';
import { TopBar } from '@/components/layout/TopBar';
import { Avatar, Button, Card, CompanyTag, Pills, StatusPill } from '@/components/ui';
import { STATUSES } from '@/data/mock';
import { calc } from '@/lib/calc';
import { relativeDate, shortDate } from '@/lib/dates';
import { findClient, findUser } from '@/lib/lookups';
import { formatMoney } from '@/lib/money';
import { useOpportunitiesStore, useUIStore } from '@/stores';

export function LeadsView() {
  const navigate = useNavigate();
  const opportunities = useOpportunitiesStore((s) => s.opportunities);
  const currency = useUIStore((s) => s.currency);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [q, setQ] = useState('');

  const filtered = opportunities.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (companyFilter !== 'all' && o.company !== companyFilter) return false;
    if (q) {
      const name = findClient(o.client_id)?.name ?? '';
      const hay = `${name} ${o.project}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const total = opportunities.length;
  const active = opportunities.filter((o) => !['won', 'lost'].includes(o.status)).length;

  return (
    <>
      <TopBar
        title="Oportunidades"
        subtitle={`${total} en total · ${active} activas`}
        right={
          <Button icon="plus" variant="primary">
            Nueva
          </Button>
        }
      />
      <div
        style={{
          padding: '4px 32px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div
          style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: 240, maxWidth: 360 }}>
            <Icon
              name="search"
              size={14}
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-3)',
              }}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar cliente o proyecto…"
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: 12.5,
                color: 'var(--text)',
                outline: 'none',
              }}
            />
          </div>
          <Pills
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { id: 'all', label: 'Todas' },
              ...STATUSES.map((s) => ({ id: s.id, label: s.label, color: s.color })),
            ]}
          />
          <Pills
            value={companyFilter}
            onChange={setCompanyFilter}
            options={[
              { id: 'all', label: 'Ambas' },
              { id: 'NOVIT', label: 'NOVIT', color: 'var(--novit)' },
              { id: 'SHARKY', label: 'SHARKY', color: 'var(--sharky)' },
            ]}
          />
        </div>

        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  {[
                    'Cliente',
                    'Proyecto',
                    'Empresa',
                    'Estado',
                    'Setup',
                    'Mensual',
                    '12m',
                    'LTV 36m',
                    'Resp.',
                    'Próx. acción',
                    'Últ. inter.',
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '10px 12px',
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'var(--text-3)',
                        textTransform: 'uppercase',
                        letterSpacing: 0.3,
                        borderBottom: '1px solid var(--border)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const c = findClient(o.client_id);
                  const owner = findUser(o.owner_id);
                  const overdue = o.next_date && new Date(o.next_date) < new Date();
                  return (
                    <tr
                      key={o.id}
                      onClick={() => navigate(`/leads?opp=${o.id}`)}
                      style={{
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = 'var(--surface-2)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = 'transparent')
                      }
                    >
                      <td style={{ padding: '10px 12px', color: 'var(--text)', fontWeight: 500 }}>
                        {c?.name ?? '—'}
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-2)' }}>
                        {o.project}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <CompanyTag company={o.company} size="sm" />
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <StatusPill status={o.status} size="sm" />
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          color: 'var(--text-2)',
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {formatMoney(o.setup, currency, true)}
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          color: 'var(--text-2)',
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {formatMoney(o.monthly, currency, true)}
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          color: 'var(--text-2)',
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {formatMoney(calc.amount12(o), currency, true)}
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          color: 'var(--text)',
                          fontWeight: 500,
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {formatMoney(calc.ltv36(o), currency, true)}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <Avatar user={owner} size={22} />
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          color: overdue ? 'var(--danger)' : 'var(--text-2)',
                          fontSize: 11.5,
                        }}
                      >
                        {o.next_action ? (
                          <span>
                            <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                              {o.next_action}
                            </span>
                            <br />
                            <span style={{ fontSize: 10.5, color: 'var(--text-3)' }}>
                              {shortDate(o.next_date)}
                            </span>
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          color: 'var(--text-3)',
                          fontSize: 11.5,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {relativeDate(o.last)}
                      </td>
                    </tr>
                  );
                })}
                {!filtered.length && (
                  <tr>
                    <td
                      colSpan={11}
                      style={{
                        padding: 32,
                        textAlign: 'center',
                        color: 'var(--text-3)',
                        fontSize: 13,
                      }}
                    >
                      Sin oportunidades que coincidan con los filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
