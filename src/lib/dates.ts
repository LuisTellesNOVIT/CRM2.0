import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function daysBetween(a: string | Date | null | undefined, b: Date = new Date()): number {
  if (!a) return 0;
  const da = typeof a === 'string' ? parseISO(a) : a;
  return differenceInCalendarDays(b, da);
}

export function relativeDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = daysBetween(iso);
  if (d === 0) return 'hoy';
  if (d === 1) return 'ayer';
  if (d > 0) return `hace ${d}d`;
  if (d === -1) return 'mañana';
  return `en ${-d}d`;
}

export function shortDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return format(parseISO(iso), 'dd MMM', { locale: es });
}
