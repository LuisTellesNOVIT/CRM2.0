import { useState } from 'react';
import { Icon } from '@/components/icons/Icon';
import { Badge, Button, Card } from '@/components/ui';
import { shortDate } from '@/lib/dates';
import { useAuthStore, useTasksStore } from '@/stores';
import type { Opportunity, Task, TaskType } from '@/types';

const TASK_TYPES: TaskType[] = [
  'llamada',
  'WhatsApp',
  'correo',
  'reunión',
  'propuesta',
  'contrato',
  'seguimiento',
];

const PRIORITY_COLOR: Record<Task['priority'], string> = {
  alta: 'var(--danger)',
  media: 'var(--warning)',
  baja: 'var(--text-3)',
};

export function TasksTab({ opp }: { opp: Opportunity }) {
  const allTasks = useTasksStore((s) => s.tasks);
  const addTask = useTasksStore((s) => s.add);
  const updateTask = useTasksStore((s) => s.update);
  const currentUser = useAuthStore((s) => s.currentUser);

  const oppTasks = allTasks.filter((t) => t.opportunity_id === opp.id);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskType>('llamada');

  const add = () => {
    if (!title.trim() || !currentUser) return;
    addTask({
      id: `t${Date.now()}`,
      opportunity_id: opp.id,
      owner_id: currentUser.id,
      title: title.trim(),
      type,
      priority: 'media',
      status: 'pendiente',
      due: new Date(Date.now() + 86400000).toISOString(),
      created: new Date().toISOString(),
    });
    setTitle('');
  };

  const toggle = (t: Task) => {
    const done = t.status === 'completada';
    updateTask(t.id, {
      status: done ? 'pendiente' : 'completada',
      completed: done ? undefined : new Date().toISOString(),
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card padding={14}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Nueva tarea</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Llamar a contacto…"
            onKeyDown={(e) => e.key === 'Enter' && add()}
            style={{ ...inputBase, flex: 1 }}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TaskType)}
            style={{ ...inputBase, width: 130, flex: 'none' }}
          >
            {TASK_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Button variant="primary" icon="plus" onClick={add}>
            Crear
          </Button>
        </div>
      </Card>

      <Card padding={0}>
        {oppTasks.length === 0 && (
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              color: 'var(--text-3)',
              fontSize: 13,
            }}
          >
            Sin tareas. Crea la primera arriba.
          </div>
        )}
        {oppTasks.map((t) => {
          const done = t.status === 'completada';
          return (
            <div
              key={t.id}
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <button
                onClick={() => toggle(t)}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  border: `1.5px solid ${done ? 'var(--success)' : 'var(--border)'}`,
                  background: done ? 'var(--success)' : 'transparent',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {done && <Icon name="check" size={11} style={{ color: '#fff' }} />}
              </button>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 12.5,
                    color: 'var(--text)',
                    textDecoration: done ? 'line-through' : 'none',
                  }}
                >
                  {t.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>
                  {t.type} · {shortDate(t.due)}
                </div>
              </div>
              <Badge color={PRIORITY_COLOR[t.priority]} soft style={{ fontSize: 10 }}>
                {t.priority}
              </Badge>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

const inputBase = {
  padding: '7px 10px',
  borderRadius: 7,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  fontSize: 12.5,
  color: 'var(--text)',
  fontFamily: 'inherit',
  outline: 'none',
  height: 34,
  boxSizing: 'border-box' as const,
};
