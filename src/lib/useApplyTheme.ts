import { useEffect } from 'react';
import { useUIStore } from '@/stores';

const DARK = {
  '--bg': '#0c0d10',
  '--surface': '#15171c',
  '--surface-2': '#1d2026',
  '--border': '#262a32',
  '--border-strong': '#363b46',
  '--text': '#e9eaee',
  '--text-2': '#a8aeba',
  '--text-3': '#71778a',
};

const LIGHT = {
  '--bg': '#f7f7f8',
  '--surface': '#ffffff',
  '--surface-2': '#f4f4f6',
  '--border': '#e8e8ec',
  '--border-strong': '#d1d3d8',
  '--text': '#0f1115',
  '--text-2': '#4b5160',
  '--text-3': '#8a90a0',
};

export function useApplyTheme() {
  const { theme, accent, novitColor, sharkyColor, density } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    const palette = theme === 'dark' ? DARK : LIGHT;
    Object.entries(palette).forEach(([k, v]) => root.style.setProperty(k, v));
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-soft', `${accent}1a`);
    root.style.setProperty('--novit', novitColor);
    root.style.setProperty('--sharky', sharkyColor);
    root.style.setProperty('--density', density === 'compact' ? '0.92' : '1');
    root.dataset.theme = theme;
  }, [theme, accent, novitColor, sharkyColor, density]);
}
