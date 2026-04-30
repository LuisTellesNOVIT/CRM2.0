import { Avatar, Badge, Button, Card } from '@/components/ui';
import { USERS } from '@/data/mock';
import { useAuthStore } from '@/stores';
import type { UserRole } from '@/types';

const ROLE_COLOR: Record<UserRole, string> = {
  Admin: 'var(--danger)',
  'Gerente Comercial': 'var(--violet)',
  'Ejecutivo Comercial': 'var(--accent)',
  'Solo Lectura': 'var(--text-3)',
};

export function UsersSection() {
  const currentUser = useAuthStore((s) => s.currentUser);
  return (
    <Card padding={0}>
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600 }}>Usuarios y roles</span>
        <Button icon="plus" size="sm" variant="primary" style={{ marginLeft: 'auto' }}>
          Invitar
        </Button>
      </div>
      {USERS.map((u) => (
        <div
          key={u.id}
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Avatar user={u} size={32} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>
              {u.name}{' '}
              {u.id === currentUser?.id && (
                <Badge
                  color="var(--accent)"
                  soft
                  style={{ fontSize: 10, marginLeft: 6 }}
                >
                  Tú
                </Badge>
              )}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{u.email}</div>
          </div>
          <Badge color={ROLE_COLOR[u.role]} soft>
            {u.role}
          </Badge>
          <Badge color="var(--success)" soft dot>
            activo
          </Badge>
        </div>
      ))}
      <div
        style={{
          padding: '14px 16px',
          fontSize: 11.5,
          color: 'var(--text-3)',
          background: 'var(--surface-2)',
        }}
      >
        <strong style={{ color: 'var(--text-2)' }}>Permisos:</strong> Admin gestiona
        todo · Gerente ve todo y dashboards · Ejecutivo ve y edita sus oportunidades ·
        Solo Lectura sólo visualiza.
      </div>
    </Card>
  );
}
