import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon } from '@/components/icons/Icon';
import { CompanyTag, StatusPill } from '@/components/ui';
import { findClient, findStatus } from '@/lib/lookups';
import { useOpportunitiesStore } from '@/stores';
import type { Opportunity } from '@/types';
import { EmailTab } from './tabs/EmailTab';
import { SummaryTab } from './tabs/SummaryTab';
import { TasksTab } from './tabs/TasksTab';
import { TimelineTab } from './tabs/TimelineTab';
import { WhatsAppTab } from './tabs/WhatsAppTab';

type Tab = 'overview' | 'tasks' | 'whatsapp' | 'email' | 'timeline';

const ACTION_TO_TAB: Record<string, Tab> = {
  whatsapp: 'whatsapp',
  email: 'email',
  task: 'tasks',
};

const TAB_LABELS: Record<Tab, string> = {
  overview: 'Resumen',
  tasks: 'Tareas',
  whatsapp: 'WhatsApp',
  email: 'Correo',
  timeline: 'Historial',
};

export function LeadDrawer() {
  const [params, setParams] = useSearchParams();
  const oppId = params.get('opp');
  const action = params.get('action');
  const opportunities = useOpportunitiesStore((s) => s.opportunities);
  const opp = oppId ? opportunities.find((o) => o.id === oppId) : null;
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    if (action && ACTION_TO_TAB[action]) {
      setTab(ACTION_TO_TAB[action]);
    } else if (oppId) {
      setTab('overview');
    }
  }, [oppId, action]);

  useEffect(() => {
    if (!opp) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opp?.id]);

  if (!opp) return null;

  const close = () => {
    const next = new URLSearchParams(params);
    next.delete('opp');
    next.delete('action');
    setParams(next, { replace: true });
  };

  return <DrawerContents opp={opp} tab={tab} setTab={setTab} onClose={close} />;
}

function DrawerContents({
  opp,
  tab,
  setTab,
  onClose,
}: {
  opp: Opportunity;
  tab: Tab;
  setTab: (t: Tab) => void;
  onClose: () => void;
}) {
  const c = findClient(opp.client_id);
  const status = findStatus(opp.status);

  if (!c) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,17,21,0.32)',
        backdropFilter: 'blur(2px)',
        zIndex: 900,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 720,
          maxWidth: '92vw',
          height: '100vh',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-12px 0 40px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
              }}
            >
              <CompanyTag company={opp.company} />
              <StatusPill status={opp.status} />
              {status && (
                <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                  · prob. {status.prob}%
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--text)',
                letterSpacing: -0.3,
              }}
            >
              {c.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{opp.project}</div>
          </div>
          <button
            onClick={onClose}
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
            padding: '0 22px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            gap: 4,
          }}
        >
          {(Object.keys(TAB_LABELS) as Tab[]).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '10px 12px',
                  fontSize: 12.5,
                  fontWeight: active ? 600 : 500,
                  fontFamily: 'inherit',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${active ? 'var(--text)' : 'transparent'}`,
                  color: active ? 'var(--text)' : 'var(--text-3)',
                  cursor: 'pointer',
                }}
              >
                {TAB_LABELS[t]}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px' }}>
          {tab === 'overview' && <SummaryTab opp={opp} />}
          {tab === 'tasks' && <TasksTab opp={opp} />}
          {tab === 'whatsapp' && <WhatsAppTab opp={opp} />}
          {tab === 'email' && <EmailTab opp={opp} />}
          {tab === 'timeline' && <TimelineTab opp={opp} />}
        </div>
      </div>
    </div>
  );
}
