import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui';
import { STATUSES } from '@/data/mock';
import { useOpportunitiesStore } from '@/stores';
import type { StatusId } from '@/types';
import { KanbanCard } from './KanbanCard';
import { KanbanColumn } from './KanbanColumn';

export function Kanban() {
  const opportunities = useOpportunitiesStore((s) => s.opportunities);
  const setStatus = useOpportunitiesStore((s) => s.setStatus);
  const source = useOpportunitiesStore((s) => s.source);
  const readonly = source === 'sheets';
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const cols = useMemo(() => STATUSES.filter((s) => s.id !== 'lost'), []);
  const draggingOpp = draggingId ? opportunities.find((o) => o.id === draggingId) : null;

  const onDragStart = (e: DragStartEvent) => {
    if (readonly) return;
    setDraggingId(String(e.active.id));
  };

  const onDragEnd = (e: DragEndEvent) => {
    setDraggingId(null);
    if (readonly || !e.over) return;
    const newStatus = String(e.over.id) as StatusId;
    const opp = opportunities.find((o) => o.id === String(e.active.id));
    if (!opp || opp.status === newStatus) return;
    setStatus(opp.id, newStatus);
  };

  return (
    <>
      <TopBar
        title="Kanban comercial"
        subtitle={
          readonly
            ? 'Vista en vivo desde Google Sheets · solo lectura.'
            : 'Arrastra tarjetas para mover oportunidades entre estados.'
        }
        right={
          <Button icon="plus" variant="primary">
            Nueva
          </Button>
        }
      />
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setDraggingId(null)}
      >
        <div style={{ padding: '4px 0 30px 32px', overflow: 'auto' }}>
          <div
            style={{
              display: 'flex',
              gap: 12,
              paddingRight: 32,
              alignItems: 'flex-start',
              minHeight: 'calc(100vh - 130px)',
            }}
          >
            {cols.map((col) => {
              const list = opportunities.filter((o) => o.status === col.id);
              return (
                <KanbanColumn
                  key={col.id}
                  status={col}
                  opps={list}
                  draggingId={draggingId}
                  readonly={readonly}
                />
              );
            })}
          </div>
        </div>
        <DragOverlay>
          {draggingOpp ? (
            <div style={{ width: 280 }}>
              <KanbanCard opp={draggingOpp} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
