import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Login } from '@/features/auth/Login';
import { ClientsView } from '@/features/clients/ClientsView';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { Kanban } from '@/features/kanban/Kanban';
import { LeadsView } from '@/features/opportunities/LeadsView';
import { Settings } from '@/features/settings/Settings';
import { TasksView } from '@/features/tasks/TasksView';
import { useAuthStore } from '@/stores';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'kanban', element: <Kanban /> },
      { path: 'leads', element: <LeadsView /> },
      { path: 'clients', element: <ClientsView /> },
      { path: 'tasks', element: <TasksView /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
