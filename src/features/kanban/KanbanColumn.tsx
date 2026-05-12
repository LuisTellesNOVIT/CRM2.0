import { useDroppable } from '@dnd-kit/core';
import { calc } from '@/lib/calc';
import { formatMoney } from '@/lib/money';
import { useUIStore } from '@/stores';
import type { Opportunity, Status } from '@/types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: Status;
  opps: Opportunity[];
  draggingId: string | null;
  readonly?: boolean;
}

export function KanbanColumn({ status, opps, draggingId, readonly }: KanbanColumnProps) {
  const currency = useUIStore((s) => s.currency);
  const { isOver, setNodeRef } = useDroppable({ id: status.id });
  const total = opps.reduce((s, o) => s + calc.pipelineValue(o), 0);

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 280,
        flexShrink: 0,
        background: 'var(--surface-2)',
        border: `1px solid ${isOver ? status.color : 'var(--border)'}`,
        borderRadius: 12,
        padding: 10,
        transition: 'border-color 0.15s, background 0.15s',
        boxShadow: isOver
          ? `0 0 0 3px color-mix(in srgb, ${status.color} 12%, transparent)`
          : 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 6px 10px',
          gap: 8,
        }}
      >
        <span
          style={{ width: 8, height: 8, borderRadius: 4, background: status.color }}
        />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>
          {status.label}
        </span>
        <span
          style={{
            fontSize: 11,
            color: 'var(--text-3)',
            padding: '1px 6px',
            borderRadius: 999,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          {opps.length}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 11,
            color: 'var(--text-3)',
            fontFeatureSettings: '"tnum"',
          }}
        >
          {formatMoney(total, currency, true)}
        </span>
      </div>
      <div style={{ minHeight: 60 }}>
        {opps.map((o) => (
          <KanbanCard
            key={o.id}
            opp={o}
            ghost={draggingId === o.id}
            readonly={readonly}
          />
        ))}
        {opps.length === 0 && (
          <div
            style={{
              padding: 20,
              textAlign: 'center',
              fontSize: 11.5,
              color: 'var(--text-3)',
              border: '1px dashed var(--border)',
              borderRadius: 8,
            }}
          >
            Sin oportunidades
          </div>
        )}
      </div>
    </div>
  );
}
