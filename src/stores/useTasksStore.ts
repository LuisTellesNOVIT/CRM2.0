import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TASKS } from '@/data/mock';
import type { Task } from '@/types';

interface TasksState {
  tasks: Task[];
  add: (task: Task) => void;
  update: (id: string, patch: Partial<Task>) => void;
  remove: (id: string) => void;
  reset: () => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: TASKS,
      add: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      update: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      remove: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      reset: () => set({ tasks: TASKS }),
    }),
    { name: 'crm:tasks' },
  ),
);
