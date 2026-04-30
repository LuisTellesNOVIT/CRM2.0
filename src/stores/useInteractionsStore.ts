import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INTERACTIONS } from '@/data/mock';
import type { Interaction } from '@/types';

interface InteractionsState {
  interactions: Interaction[];
  add: (interaction: Interaction) => void;
  remove: (id: string) => void;
  reset: () => void;
}

export const useInteractionsStore = create<InteractionsState>()(
  persist(
    (set) => ({
      interactions: INTERACTIONS,
      add: (interaction) =>
        set((state) => ({ interactions: [interaction, ...state.interactions] })),
      remove: (id) =>
        set((state) => ({
          interactions: state.interactions.filter((i) => i.id !== id),
        })),
      reset: () => set({ interactions: INTERACTIONS }),
    }),
    { name: 'crm:interactions' },
  ),
);
