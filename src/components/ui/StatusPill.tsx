import { findStatus } from '@/lib/lookups';
import type { StatusId } from '@/types';
import { Badge } from './Badge';

interface StatusPillProps {
  status: StatusId;
  size?: 'sm' | 'md';
}

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const s = findStatus(status);
  if (!s) return null;
  return (
    <Badge color={s.color} soft dot style={{ fontSize: size === 'sm' ? 10.5 : 11.5 }}>
      {s.label}
    </Badge>
  );
}
