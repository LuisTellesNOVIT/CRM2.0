import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OPPORTUNITIES } from '@/data/mock';
import { fetchSheetOpportunities } from '@/data/sheetsAdapter';
import type { Client, Opportunity, StatusId } from '@/types';

export type DataSource = 'mock' | 'sheets';

interface OpportunitiesState {
  opportunities: Opportunity[];
  sheetClients: Client[];
  source: DataSource;
  loading: boolean;
  error: string | null;
  lastFetched: string | null;
  setStatus: (id: string, status: StatusId) => void;
  update: (id: string, patch: Partial<Opportunity>) => void;
  reset: () => void;
  hydrateFromSheet: (sheetId: string) => Promise<void>;
  setSource: (s: DataSource) => void;
}

export const useOpportunitiesStore = create<OpportunitiesState>()(
  persist(
    (set, get) => ({
      opportunities: OPPORTUNITIES,
      sheetClients: [],
      source: 'mock',
      loading: false,
      error: null,
      lastFetched: null,
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
      reset: () =>
        set({
          opportunities: OPPORTUNITIES,
          sheetClients: [],
          source: 'mock',
          error: null,
          lastFetched: null,
        }),
      setSource: (source) => set({ source }),
      hydrateFromSheet: async (sheetId) => {
        set({ loading: true, error: null });
        try {
          const result = await fetchSheetOpportunities(sheetId);
          set({
            opportunities: result.opportunities,
            sheetClients: result.clients,
            source: 'sheets',
            loading: false,
            lastFetched: result.fetchedAt,
            error: null,
          });
        } catch (err) {
          set({
            loading: false,
            error: err instanceof Error ? err.message : 'Error al leer Google Sheets',
          });
          throw err;
        }
        void get();
      },
    }),
    {
      name: 'crm:opportunities',
      partialize: (state) => ({
        opportunities: state.opportunities,
        sheetClients: state.sheetClients,
        source: state.source,
        lastFetched: state.lastFetched,
      }),
    },
  ),
);
