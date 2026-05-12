import type { ReactNode } from 'react';
import { Icon } from '@/components/icons/Icon';
import { SHEET_ID, SHEET_URL } from '@/config';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { useOpportunitiesStore, useUIStore } from '@/stores';
import type { Currency } from '@/types';

interface TopBarProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

function formatRelative(iso: string | null): string {
  if (!iso) return '—';
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `hace ${seconds}s`;
  if (seconds < 3600) return `hace ${Math.round(seconds / 60)}m`;
  const hours = Math.round(seconds / 3600);
  return `hace ${hours}h`;
}

export function TopBar({ title, subtitle, right }: TopBarProps) {
  const currency = useUIStore((s) => s.currency);
  const setCurrency = useUIStore((s) => s.setCurrency);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const source = useOpportunitiesStore((s) => s.source);
  const loading = useOpportunitiesStore((s) => s.loading);
  const error = useOpportunitiesStore((s) => s.error);
  const lastFetched = useOpportunitiesStore((s) => s.lastFetched);
  const hydrateFromSheet = useOpportunitiesStore((s) => s.hydrateFromSheet);

  const onReload = () => {
    hydrateFromSheet(SHEET_ID).catch(() => {});
  };

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
          title={
            error
              ? `Error: ${error}`
              : source === 'sheets'
                ? `Datos en vivo · Google Sheets · actualizado ${formatRelative(lastFetched)}`
                : 'Datos mock locales'
          }
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 7,
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            background: 'var(--surface)',
            fontSize: 11,
            color: error
              ? 'var(--danger)'
              : source === 'sheets'
                ? 'var(--success)'
                : 'var(--text-3)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              background: error
                ? 'var(--danger)'
                : source === 'sheets'
                  ? 'var(--success)'
                  : 'var(--text-3)',
              boxShadow:
                source === 'sheets' && !error
                  ? '0 0 0 3px color-mix(in srgb, var(--success) 25%, transparent)'
                  : 'none',
            }}
          />
          {error
            ? 'Sin conexión'
            : source === 'sheets'
              ? `En vivo · ${formatRelative(lastFetched)}`
              : 'Mock'}
        </div>
        <button
          onClick={onReload}
          disabled={loading}
          title="Recargar desde Google Sheets"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 30,
            padding: '0 10px',
            borderRadius: 7,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-2)',
            fontSize: 11.5,
            fontFamily: 'inherit',
            fontWeight: 500,
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Icon
            name="bolt"
            size={12}
            style={loading ? { animation: 'spin 0.9s linear infinite' } : undefined}
          />
          {loading ? 'Cargando…' : 'Recargar'}
        </button>
        <a
          href={SHEET_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir Google Sheet"
          style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-2)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
          }}
        >
          <Icon name="file" size={13} />
        </a>
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
