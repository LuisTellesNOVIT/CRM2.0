import { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '@/components/icons/Icon';
import { Avatar } from '@/components/ui';
import { useAuthStore, useUIStore } from '@/stores';

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

const ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/kanban', label: 'Kanban', icon: 'kanban' },
  { to: '/leads', label: 'Oportunidades', icon: 'list' },
  { to: '/clients', label: 'Clientes', icon: 'users' },
  { to: '/tasks', label: 'Tareas', icon: 'check' },
  { to: '/settings', label: 'Configuración', icon: 'settings' },
];

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const openCmdk = useUIStore((s) => s.openCmdk);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  useEffect(() => {
    if (mobile) closeSidebar();
  }, [location.pathname, mobile, closeSidebar]);

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const baseStyle = {
    width: 232,
    flexShrink: 0,
    background: 'var(--surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const layoutStyle = mobile
    ? {
        ...baseStyle,
        position: 'fixed' as const,
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 950,
        height: '100vh',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.2s ease-out',
        boxShadow: sidebarOpen ? '4px 0 24px rgba(0,0,0,0.12)' : 'none',
      }
    : {
        ...baseStyle,
        height: '100vh',
        position: 'sticky' as const,
        top: 0,
      };

  return (
    <aside style={layoutStyle}>
      <div style={{ padding: '20px 18px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'linear-gradient(135deg, var(--novit), var(--sharky))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 0.5,
            flexShrink: 0,
          }}
        >
          NS
        </div>
        <div style={{ minWidth: 0, lineHeight: 1.2 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>
            Novit · Sharky
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 1 }}>CRM Comercial</div>
        </div>
      </div>

      <div style={{ padding: '4px 10px 10px' }}>
        <button
          onClick={openCmdk}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 10px',
            borderRadius: 8,
            fontSize: 12.5,
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            color: 'var(--text-3)',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <Icon name="search" size={13} />
          <span style={{ flex: 1, textAlign: 'left' }}>Buscar</span>
          <kbd
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 5,
              padding: '1px 6px',
              fontSize: 11,
              fontFamily: 'inherit',
              color: 'var(--text-3)',
            }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      <nav style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {ITEMS.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '7px 10px',
              borderRadius: 7,
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? 'var(--text)' : 'var(--text-2)',
              background: isActive ? 'var(--surface-2)' : 'transparent',
              border: '1px solid',
              borderColor: isActive ? 'var(--border)' : 'transparent',
              textDecoration: 'none',
            })}
          >
            <Icon name={it.icon} size={15} />
            {it.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 6 }}>
          <Avatar user={currentUser} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentUser?.name ?? '—'}
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>
              {currentUser?.role ?? ''}
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              color: 'var(--text-3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="logout" size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
