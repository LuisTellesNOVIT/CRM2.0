import { useMemo } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '@/components/icons/Icon';
import { useOpportunitiesStore, useUIStore } from '@/stores';
import { findClient, findStatus } from '@/lib/lookups';

interface ViewItem {
  kind: 'view';
  id: string;
  label: string;
  icon: IconName;
  to: string;
}

interface OppItem {
  kind: 'opp';
  id: string;
  label: string;
  sub: string;
  icon: IconName;
  company: string;
  to: string;
}

type Item = ViewItem | OppItem;

const VIEW_ITEMS: ViewItem[] = [
  { kind: 'view', id: 'dashboard', label: 'Ir a Dashboard', icon: 'dashboard', to: '/dashboard' },
  { kind: 'view', id: 'kanban', label: 'Ir a Kanban', icon: 'kanban', to: '/kanban' },
  { kind: 'view', id: 'leads', label: 'Ir a Oportunidades', icon: 'list', to: '/leads' },
  { kind: 'view', id: 'clients', label: 'Ir a Clientes', icon: 'users', to: '/clients' },
  { kind: 'view', id: 'tasks', label: 'Ir a Tareas', icon: 'check', to: '/tasks' },
];

export function CommandPalette() {
  const open = useUIStore((s) => s.cmdkOpen);
  const closeCmdk = useUIStore((s) => s.closeCmdk);
  const opportunities = useOpportunitiesStore((s) => s.opportunities);
  const navigate = useNavigate();

  const items = useMemo<Item[]>(() => {
    const oppItems: OppItem[] = opportunities.map((o) => {
      const c = findClient(o.client_id);
      const s = findStatus(o.status);
      return {
        kind: 'opp',
        id: o.id,
        label: `${c?.name ?? '—'} — ${o.project}`,
        sub: s?.label ?? '',
        icon: 'target',
        company: o.company,
        to: `/leads?opp=${o.id}`,
      };
    });
    return [...VIEW_ITEMS, ...oppItems];
  }, [opportunities]);

  if (!open) return null;

  const onSelect = (item: Item) => {
    closeCmdk();
    navigate(item.to);
  };

  return (
    <div
      onClick={closeCmdk}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,17,21,0.42)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          maxWidth: '90vw',
          background: 'var(--surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-overlay)',
          overflow: 'hidden',
        }}
      >
        <Command label="Comandos" loop>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 16px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <Icon name="search" size={16} />
            <Command.Input
              autoFocus
              placeholder="Buscar oportunidades, clientes, vistas…"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 14,
                color: 'var(--text)',
                fontFamily: 'inherit',
              }}
            />
            <kbd
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 5,
                padding: '1px 6px',
                fontSize: 11,
                color: 'var(--text-3)',
              }}
            >
              esc
            </kbd>
          </div>
          <Command.List
            style={{
              maxHeight: 360,
              overflow: 'auto',
              padding: 6,
            }}
          >
            <Command.Empty
              style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--text-3)',
                fontSize: 13,
              }}
            >
              Sin resultados
            </Command.Empty>
            {items.map((it) => (
              <Command.Item
                key={`${it.kind}:${it.id}`}
                value={`${it.label} ${'sub' in it ? it.sub : ''}`}
                onSelect={() => onSelect(it)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 7,
                  fontSize: 13,
                  cursor: 'pointer',
                  color: 'var(--text)',
                }}
              >
                <Icon name={it.icon} size={14} />
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.kind === 'opp' && (
                  <span style={{ fontSize: 10.5, color: 'var(--text-3)' }}>
                    {it.company} · {it.sub}
                  </span>
                )}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
