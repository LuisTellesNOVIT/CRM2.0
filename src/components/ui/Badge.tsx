import type { CSSProperties, ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  soft?: boolean;
  dot?: boolean;
  style?: CSSProperties;
}

export function Badge({ children, color, soft, dot, style }: BadgeProps) {
  const c = color || 'var(--text-2)';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 500,
        lineHeight: 1.2,
        color: soft ? c : '#fff',
        background: soft ? `${c}1a` : c,
        border: `1px solid ${soft ? `${c}33` : c}`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            background: c,
            boxShadow: soft ? `0 0 0 2px ${c}22` : 'none',
          }}
        />
      )}
      {children}
    </span>
  );
}
