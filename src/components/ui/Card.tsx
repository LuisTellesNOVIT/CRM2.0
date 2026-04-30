import type { CSSProperties, ReactNode, MouseEvent } from 'react';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  padding?: number;
  hover?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export function Card({ children, style, padding = 20, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding,
        transition: 'border-color 0.15s, transform 0.15s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={
        hover
          ? (e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-strong)';
            }
          : undefined
      }
      onMouseLeave={
        hover
          ? (e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
