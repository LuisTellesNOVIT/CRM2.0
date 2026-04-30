import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Currency, Density, Theme } from '@/types';

interface UIState {
  currency: Currency;
  theme: Theme;
  accent: string;
  density: Density;
  novitColor: string;
  sharkyColor: string;
  cmdkOpen: boolean;
  sidebarOpen: boolean;
  setCurrency: (c: Currency) => void;
  setTheme: (t: Theme) => void;
  setAccent: (a: string) => void;
  setDensity: (d: Density) => void;
  setNovitColor: (c: string) => void;
  setSharkyColor: (c: string) => void;
  openCmdk: () => void;
  closeCmdk: () => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      currency: 'PEN',
      theme: 'light',
      accent: '#4f46e5',
      density: 'comfortable',
      novitColor: '#4f46e5',
      sharkyColor: '#0d9488',
      cmdkOpen: false,
      sidebarOpen: false,
      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => set({ theme }),
      setAccent: (accent) => set({ accent }),
      setDensity: (density) => set({ density }),
      setNovitColor: (novitColor) => set({ novitColor }),
      setSharkyColor: (sharkyColor) => set({ sharkyColor }),
      openCmdk: () => set({ cmdkOpen: true }),
      closeCmdk: () => set({ cmdkOpen: false }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      closeSidebar: () => set({ sidebarOpen: false }),
    }),
    {
      name: 'crm:ui',
      partialize: (state) => ({
        currency: state.currency,
        theme: state.theme,
        accent: state.accent,
        density: state.density,
        novitColor: state.novitColor,
        sharkyColor: state.sharkyColor,
      }),
    },
  ),
);
