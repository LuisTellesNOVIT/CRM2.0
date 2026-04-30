import type { CSSProperties, MouseEvent } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/icons/Icon';
import { Avatar, Badge, CompanyTag } from '@/components/ui';
import { calc } from '@/lib/calc';
import { shortDate } from '@/lib/dates';
import { findClient, findUser } from '@/lib/lookups';
import { formatMoney } from '@/lib/money';
import { useUIStore } from '@/stores';
import type { Opportunity } from '@/types';

interface KanbanCardProps {
  opp: Opportunity;
  ghost?: boolean;
}

export function KanbanCard({ opp, ghost }: KanbanCardProps) {
  const navigate = useNavigate();
  const currency = useUIStore((s) => s.currency);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: opp.id,
  });

  const c = findClient(opp.client_id);
  const owner = findUser(opp.owner_id);
  const overdue = opp.next_date && new Date(opp.next_date) < new Date();
  const value = calc.pipelineValue(opp);

  const open = () => navigate(`/leads?opp=${opp.id}`);
  const action = (a: string) => (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/leads?opp=${opp.id}&action=${a}`);
  };

  const style: CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    cursor: 'grab',
    opacity: isDragging || ghost ? 0.4 : 1,
    transition: 'border-color 0.15s, box-shadow 0.15s, opacity 0.1s',
    boxShadow: '0 1px 0 rgba(15,17,21,0.02)',
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={open}
      style={style}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 6,
        }}
      >
        <CompanyTag company={opp.company} size="sm" />
        {overdue && (
          <Badge color="var(--danger)" soft style={{ fontSize: 10, padding: '1px 6px' }} dot>
            Vencido
          </Badge>
        )}
        <span style={{ marginLeft: 'auto' }}>
          <Avatar user={owner} size={20} />
        </span>
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text)',
          lineHeight: 1.3,
          marginBottom: 2,
        }}
      >
        {c?.name ?? '—'}
      </div>
      <div
        style={{
          fontSize: 12,
          color: 'var(--text-2)',
          marginBottom: 10,
          lineHeight: 1.3,
        }}
      >
        {opp.project}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text)',
              fontFeatureSettings: '"tnum"',
              letterSpacing: -0.2,
            }}
          >
            {formatMoney(value, currency, true)}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>setup + 12m</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-2)',
              fontFeatureSettings: '"tnum"',
            }}
          >
            {formatMoney(opp.monthly, currency, true)}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>/ mes</div>
        </div>
      </div>

      {opp.next_action && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 8px',
            borderRadius: 6,
            background: 'var(--surface-2)',
            fontSize: 11.5,
            color: overdue ? 'var(--danger)' : 'var(--text-2)',
            marginBottom: 8,
          }}
        >
          <Icon name="clock" size={11} />
          <span
            style={{
              flex: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {opp.next_action}
          </span>
          <span style={{ fontFeatureSettings: '"tnum"' }}>{shortDate(opp.next_date)}</span>
        </div>
      )}

      <div
        style={{ display: 'flex', gap: 4 }}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button onClick={action('whatsapp')} title="WhatsApp" style={iconBtn}>
          <Icon name="whatsapp" size={13} />
        </button>
        <button onClick={action('email')} title="Correo" style={iconBtn}>
          <Icon name="mail" size={13} />
        </button>
        <button onClick={action('task')} title="Crear tarea" style={iconBtn}>
          <Icon name="check" size={13} />
        </button>
        <button onClick={open} title="Ver detalle" style={{ ...iconBtn, marginLeft: 'auto' }}>
          <Icon name="arrow_right" size={13} />
        </button>
      </div>
    </div>
  );
}

const iconBtn: CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: 6,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text-2)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'inherit',
};
