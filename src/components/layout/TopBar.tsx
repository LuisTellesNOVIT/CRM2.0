import type { ReactNode } from 'react';
import { Icon } from '@/components/icons/Icon';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { useUIStore } from '@/stores';
import type { Currency } from '@/types';

interface TopBarProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export function TopBar({ title, subtitle, right }: TopBarProps) {
  const currency = useUIStore((s) => s.currency);
  const setCurrency = useUIStore((s) => s.setCurrency);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const isMobile = useMediaQuery('(max-width: 1023px)');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px 32px 12px',
        gap: 16,
      }}
    >
      {isMobile && (
        <button
          onClick={toggleSidebar}
          aria-label="Abrir menú"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name="list" size={16} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: -0.3,
            color: 'var(--text)',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 3 }}>{subtitle}</div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            display: 'inline-flex',
            borderRadius: 7,
            border: '1px solid var(--border)',
            padding: 2,
            background: 'var(--surface)',
          }}
        >
          {(['PEN', 'USD'] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              style={{
                padding: '4px 10px',
                fontSize: 11.5,
                fontWeight: 500,
                fontFamily: 'inherit',
                borderRadius: 5,
                border: 'none',
                background: currency === c ? 'var(--surface-2)' : 'transparent',
                color: currency === c ? 'var(--text)' : 'var(--text-3)',
                cursor: 'pointer',
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          title="Notificaciones"
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Icon name="bell" size={15} />
          <span
            style={{
              position: 'absolute',
              top: 7,
              right: 8,
              width: 6,
              height: 6,
              borderRadius: 3,
              background: 'var(--danger)',
            }}
          />
        </button>
        {right}
      </div>
    </div>
  );
}
