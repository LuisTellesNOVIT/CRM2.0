import type { CSSProperties } from 'react';
import type { User } from '@/types';

interface AvatarProps {
  user: User | null | undefined;
  size?: number;
  ring?: number;
  style?: CSSProperties;
}

export function Avatar({ user, size = 24, ring, style }: AvatarProps) {
  if (!user) return null;
  return (
    <div
      title={user.name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: user.color,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.42,
        fontWeight: 600,
        letterSpacing: 0.2,
        boxShadow: ring
          ? `0 0 0 2px var(--surface), 0 0 0 ${ring}px ${user.color}40`
          : undefined,
        flexShrink: 0,
        ...style,
      }}
    >
      {user.initials}
    </div>
  );
}
