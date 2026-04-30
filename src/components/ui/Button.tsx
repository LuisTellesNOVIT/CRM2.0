import type { CSSProperties, ReactNode, MouseEvent } from 'react';
import { Icon, type IconName } from '@/components/icons/Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

const sizes: Record<ButtonSize, CSSProperties> = {
  sm: { padding: '5px 10px', fontSize: 12, height: 28, gap: 6 },
  md: { padding: '7px 12px', fontSize: 13, height: 34, gap: 7 },
  lg: { padding: '9px 16px', fontSize: 14, height: 40, gap: 8 },
};

const variants: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'var(--text)',
    color: 'var(--surface)',
    border: '1px solid var(--text)',
  },
  secondary: {
    background: 'var(--surface)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
  },
  ghost: { background: 'transparent', color: 'var(--text-2)', border: '1px solid transparent' },
  accent: { background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' },
  danger: {
    background: 'transparent',
    color: 'var(--danger)',
    border: '1px solid #ef444433',
  },
  success: { background: 'var(--success)', color: '#fff', border: '1px solid var(--success)' },
};

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  onClick,
  style,
  disabled,
  type = 'button',
  title,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        fontWeight: 500,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, border-color 0.15s, transform 0.05s',
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      onMouseDown={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 13 : 15} />}
      {children}
    </button>
  );
}
