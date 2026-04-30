import { isSameDay, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '@/components/icons/Icon';
import { TopBar } from '@/components/layout/TopBar';
import { Avatar, Badge, Card } from '@/components/ui';
import { calc } from '@/lib/calc';
import { daysBetween, shortDate } from '@/lib/dates';
import { findClient, findUser } from '@/lib/lookups';
import { formatMoney } from '@/lib/money';
import { useOpportunitiesStore, useTasksStore, useUIStore } from '@/stores';
import type { Opportunity, Task } from '@/types';

const PRIORITY_COLOR: Record<Task['priority'], string> = {
  alta: 'var(--danger)',
  media: 'var(--warning)',
  baja: 'var(--text-3)',
};

export function TasksView() {
  const navigate = useNavigate();
  const tasks = useTasksStore((s) => s.tasks);
  const update = useTasksStore((s) => s.update);
  const opportunities = useOpportunitiesStore((s) => s.opportunities);
  const currency = useUIStore((s) => s.currency);

  const today = new Date();

  const grouped = {
    vencidas: tasks.filter(
      (t) => t.status !== 'completada' && parseISO(t.due) < today && !isSameDay(parseISO(t.due), today),
    ),
    hoy: tasks.filter(
      (t) => t.status !== 'completada' && isSameDay(parseISO(t.due), today),
    ),
    proximas: tasks.filter(
      (t) =>
        t.status !== 'completada' &&
        parseISO(t.due) > today &&
        !isSameDay(parseISO(t.due), today),
    ),
    completadas: tasks.filter((t) => t.status === 'completada'),
  };

  const stale = opportunities.filter(
    (o) => !['won', 'lost'].includes(o.status) && daysBetween(o.last) >= 3,
  );
  const highValueNoNext = opportunities.filter(
    (o) =>
      !['won', 'lost'].includes(o.status) &&
      calc.pipelineValue(o) > 100000 &&
      !o.next_action,
  );

  const toggleTask = (id: string, status: Task['status']) => {
    const isDone = status === 'completada';
    update(id, {
      status: isDone ? 'pendiente' : 'completada',
      completed: isDone ? undefined : new Date().toISOString(),
    });
  };

  const onOppClick = (id: string) => navigate(`/leads?opp=${id}`);

  return (
    <>
      <TopBar
        title="Tareas y seguimiento"
        subtitle="Ordena tu día por urgencia comercial."
      />
      <div
        style={{
          padding: '4px 32px 40px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 320px',
          gap: 16,
          alignItems: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <Section
            title="Vencidas"
            list={grouped.vencidas}
            color="var(--danger)"
            icon="flame"
            today={today}
            opps={opportunities}
            onToggle={toggleTask}
            onOppClick={onOppClick}
          />
          <Section
            title="Hoy"
            list={grouped.hoy}
            color="var(--accent)"
            icon="bolt"
            today={today}
            opps={opportunities}
            onToggle={toggleTask}
            onOppClick={onOppClick}
          />
          <Section
            title="Próximas"
            list={grouped.proximas}
            color="var(--text-2)"
            icon="calendar"
            today={today}
            opps={opportunities}
            onToggle={toggleTask}
            onOppClick={onOppClick}
          />
          <Section
            title="Completadas"
            list={grouped.completadas}
            color="var(--success)"
            icon="check"
            today={today}
            opps={opportunities}
            onToggle={toggleTask}
            onOppClick={onOppClick}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            position: 'sticky',
            top: 16,
          }}
        >
          <Card padding={0}>
            <div
              style={{
                padding: '12px 14px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Icon name="clock" size={14} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Sin seguimiento (3d+)</span>
            </div>
            {stale.slice(0, 5).map((o) => {
              const c = findClient(o.client_id);
              return (
                <button
                  key={o.id}
                  onClick={() => onOppClick(o.id)}
                  style={sideRowStyle}
                >
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)' }}>
                    {c?.name ?? '—'}
                  </div>
                  <div
                    style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 1 }}
                  >
                    {o.project} · hace {daysBetween(o.last)}d
                  </div>
                </button>
              );
            })}
            {!stale.length && (
              <div
                style={{
                  padding: 18,
                  textAlign: 'center',
                  color: 'var(--text-3)',
                  fontSize: 12,
                }}
              >
                Todo al día ✓
              </div>
            )}
          </Card>
          <Card padding={0}>
            <div
              style={{
                padding: '12px 14px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Icon name="trend_up" size={14} style={{ color: 'var(--warning)' }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Alto valor sin acción</span>
            </div>
            {highValueNoNext.slice(0, 5).map((o) => {
              const c = findClient(o.client_id);
              return (
                <button
                  key={o.id}
                  onClick={() => onOppClick(o.id)}
                  style={sideRowStyle}
                >
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)' }}>
                    {c?.name ?? '—'}
                  </div>
                  <div
                    style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 1 }}
                  >
                    {formatMoney(calc.pipelineValue(o), currency, true)} · sin próxima acción
                  </div>
                </button>
              );
            })}
            {!highValueNoNext.length && (
              <div
                style={{
                  padding: 18,
                  textAlign: 'center',
                  color: 'var(--text-3)',
                  fontSize: 12,
                }}
              >
                Sin alertas
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

const sideRowStyle = {
  width: '100%',
  textAlign: 'left' as const,
  display: 'block',
  padding: '10px 14px',
  background: 'transparent',
  border: 'none',
  borderTop: '1px solid var(--border)',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

interface SectionProps {
  title: string;
  list: Task[];
  color: string;
  icon: IconName;
  today: Date;
  opps: Opportunity[];
  onToggle: (id: string, status: Task['status']) => void;
  onOppClick: (id: string) => void;
}

function Section({ title, list, color, icon, today, opps, onToggle, onOppClick }: SectionProps) {
  return (
    <Card padding={0}>
      <div
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Icon name={icon} size={14} style={{ color }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
          {title}
        </span>
        <Badge color={color} soft style={{ fontSize: 10.5, marginLeft: 'auto' }}>
          {list.length}
        </Badge>
      </div>
      <div>
        {list.length === 0 && (
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              color: 'var(--text-3)',
              fontSize: 12,
            }}
          >
            Sin tareas
          </div>
        )}
        {list.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            today={today}
            opps={opps}
            onToggle={onToggle}
            onOppClick={onOppClick}
          />
        ))}
      </div>
    </Card>
  );
}

interface TaskRowProps {
  task: Task;
  today: Date;
  opps: Opportunity[];
  onToggle: (id: string, status: Task['status']) => void;
  onOppClick: (id: string) => void;
}

function TaskRow({ task, today, opps, onToggle, onOppClick }: TaskRowProps) {
  const opp = opps.find((o) => o.id === task.opportunity_id);
  const c = opp ? findClient(opp.client_id) : null;
  const owner = findUser(task.owner_id);
  const done = task.status === 'completada';
  const overdue = !done && parseISO(task.due) < today && !isSameDay(parseISO(task.due), today);
  const priorityColor = PRIORITY_COLOR[task.priority];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <button
        onClick={() => onToggle(task.id, task.status)}
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
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: 3,
          background: priorityColor,
          flexShrink: 0,
        }}
      />
      <button
        onClick={() => opp && onOppClick(opp.id)}
        style={{
          flex: 1,
          minWidth: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
          padding: 0,
        }}
      >
        <div
          style={{
            fontSize: 12.5,
            color: done ? 'var(--text-3)' : 'var(--text)',
            textDecoration: done ? 'line-through' : 'none',
            fontWeight: 500,
          }}
        >
          {task.title}
        </div>
        {c && opp && (
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>
            {c.name} · {opp.project}
          </div>
        )}
      </button>
      <Badge color={priorityColor} soft style={{ fontSize: 10 }}>
        {task.type}
      </Badge>
      <Avatar user={owner} size={20} />
      <div
        style={{
          fontSize: 11.5,
          color: overdue ? 'var(--danger)' : 'var(--text-3)',
          minWidth: 60,
          textAlign: 'right',
          fontFeatureSettings: '"tnum"',
        }}
      >
        {shortDate(task.due)}
      </div>
    </div>
  );
}
