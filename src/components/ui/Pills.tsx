interface PillOption {
  id: string;
  label: string;
  color?: string;
}

interface PillsProps {
  value: string;
  onChange: (id: string) => void;
  options: PillOption[];
}

export function Pills({ value, onChange, options }: PillsProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        gap: 4,
        padding: 3,
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        flexWrap: 'wrap',
      }}
    >
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            style={{
              padding: '4px 10px',
              fontSize: 11.5,
              fontWeight: 500,
              fontFamily: 'inherit',
              borderRadius: 5,
              border: 'none',
              background: active ? 'var(--surface)' : 'transparent',
              color: active ? 'var(--text)' : 'var(--text-3)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              boxShadow: active ? '0 1px 0 var(--border)' : 'none',
            }}
          >
            {o.color && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  background: o.color,
                }}
              />
            )}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
