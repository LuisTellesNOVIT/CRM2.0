import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/icons/Icon';
import { CompanyTag, StatusPill } from '@/components/ui';
import { calc } from '@/lib/calc';
import { findClient } from '@/lib/lookups';
import { formatMoney } from '@/lib/money';
import { useUIStore } from '@/stores';
import type { Opportunity } from '@/types';

interface OpportunityListModalProps {
  open: boolean;
  title: string;
  description?: string;
  opportunities: Opportunity[];
  onClose: () => void;
}

export function OpportunityListModal({
  open,
  title,
  description,
  opportunities,
  onClose,
}: OpportunityListModalProps) {
  const navigate = useNavigate();
  const currency = useUIStore((s) => s.currency);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const totalSetup = opportunities.reduce((s, o) => s + (o.setup || 0), 0);
  const totalMonthly = opportunities.reduce((s, o) => s + (o.monthly || 0), 0);
  const totalPipeline = opportunities.reduce((s, o) => s + calc.pipelineValue(o), 0);

  const goToOpp = (id: string) => {
    onClose();
    navigate(`/leads?opp=${id}`);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,17,21,0.42)',
        backdropFilter: 'blur(2px)',
        zIndex: 920,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '8vh',
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 900,
          maxWidth: '100%',
          maxHeight: '84vh',
          background: 'var(--surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-overlay)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}
            >
              {title}
            </div>
            {description && (
              <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 3 }}>
                {description}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-2)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="close" size={14} />
          </button>
        </div>

        <div
          style={{
            padding: '10px 22px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            gap: 24,
            background: 'var(--surface-2)',
            fontSize: 11.5,
            color: 'var(--text-2)',
            flexWrap: 'wrap',
          }}
        >
          <Stat label="Oportunidades" value={String(opportunities.length)} />
          <Stat label="Setup total" value={formatMoney(totalSetup, currency, true)} />
          <Stat label="Mensual total" value={formatMoney(totalMonthly, currency, true)} />
          <Stat
            label="Pipeline (setup + 12m)"
            value={formatMoney(totalPipeline, currency, true)}
          />
        </div>

        <div style={{ overflow: 'auto', flex: 1 }}>
          {opportunities.length === 0 ? (
            <div
              style={{
                padding: 40,
                textAlign: 'center',
                color: 'var(--text-3)',
                fontSize: 13,
              }}
            >
              No hay oportunidades en este grupo.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr
                  style={{
                    background: 'var(--surface-2)',
                    position: 'sticky',
                    top: 0,
                  }}
                >
                  {['Cliente', 'Proyecto', 'Empresa', 'Estado', 'Setup', 'Mensual', 'Pipeline'].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
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
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {opportunities.map((o) => {
                  const c = findClient(o.client_id);
                  return (
                    <tr
                      key={o.id}
                      onClick={() => goToOpp(o.id)}
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
                      <td
                        style={{
                          padding: '10px 14px',
                          color: 'var(--text)',
                          fontWeight: 500,
                        }}
                      >
                        {c?.name ?? '—'}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-2)' }}>
                        {o.project}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <CompanyTag company={o.company} size="sm" />
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <StatusPill status={o.status} size="sm" />
                      </td>
                      <td
                        style={{
                          padding: '10px 14px',
                          color: 'var(--text-2)',
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {formatMoney(o.setup, currency, true)}
                      </td>
                      <td
                        style={{
                          padding: '10px 14px',
                          color: 'var(--text-2)',
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {formatMoney(o.monthly, currency, true)}
                      </td>
                      <td
                        style={{
                          padding: '10px 14px',
                          color: 'var(--text)',
                          fontWeight: 500,
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {formatMoney(calc.pipelineValue(o), currency, true)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10.5,
          color: 'var(--text-3)',
          textTransform: 'uppercase',
          letterSpacing: 0.3,
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13.5,
          color: 'var(--text)',
          fontWeight: 600,
          fontFeatureSettings: '"tnum"',
        }}
      >
        {value}
      </div>
    </div>
  );
}
