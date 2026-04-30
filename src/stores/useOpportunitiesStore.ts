import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OPPORTUNITIES } from '@/data/mock';
import type { Opportunity, StatusId } from '@/types';

interface OpportunitiesState {
  opportunities: Opportunity[];
  setStatus: (id: string, status: StatusId) => void;
  update: (id: string, patch: Partial<Opportunity>) => void;
  reset: () => void;
}

export const useOpportunitiesStore = create<OpportunitiesState>()(
  persist(
    (set) => ({
      opportunities: OPPORTUNITIES,
      setStatus: (id, status) =>
        set((state) => ({
          opportunities: state.opportunities.map((o) =>
            o.id === id ? { ...o, status, last: new Date().toISOString() } : o,
          ),
        })),
      update: (id, patch) =>
        set((state) => ({
          opportunities: state.opportunities.map((o) =>
            o.id === id ? { ...o, ...patch, last: new Date().toISOString() } : o,
          ),
        })),
      reset: () => set({ opportunities: OPPORTUNITIES }),
    }),
    { name: 'crm:opportunities' },
  ),
);
