import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { CommandPalette } from '@/components/command/CommandPalette';
import { LeadDrawer } from '@/features/opportunities/LeadDrawer';
import { useApplyTheme } from '@/lib/useApplyTheme';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { useOpportunitiesStore, useUIStore } from '@/stores';
import { SHEET_ID } from '@/config';

export function AppShell() {
  useApplyTheme();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const openCmdk = useUIStore((s) => s.openCmdk);
  const closeCmdk = useUIStore((s) => s.closeCmdk);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const closeSidebar = useUIStore((s) => s.closeSidebar);
  const hydrateFromSheet = useOpportunitiesStore((s) => s.hydrateFromSheet);

  useEffect(() => {
    hydrateFromSheet(SHEET_ID).catch(() => {
      // Errors are surfaced via store.error and the TopBar
    });
  }, [hydrateFromSheet]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCmdk();
      }
      if (e.key === 'Escape') {
        closeCmdk();
        closeSidebar();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openCmdk, closeCmdk, closeSidebar]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar mobile={isMobile} />
      {isMobile && sidebarOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,17,21,0.42)',
            backdropFilter: 'blur(2px)',
            zIndex: 940,
          }}
        />
      )}
      <main style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </main>
      <CommandPalette />
      <LeadDrawer />
    </div>
  );
}
