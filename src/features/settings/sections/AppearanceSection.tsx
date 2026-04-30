import { Card } from '@/components/ui';
import { useUIStore } from '@/stores';
import type { Density, Theme } from '@/types';

const ACCENTS: Array<{ id: string; label: string; value: string }> = [
  { id: 'indigo', label: 'Indigo', value: '#4f46e5' },
  { id: 'emerald', label: 'Esmeralda', value: '#059669' },
  { id: 'orange', label: 'Naranja', value: '#ea580c' },
  { id: 'rose', label: 'Rosa', value: '#e11d48' },
  { id: 'slate', label: 'Pizarra', value: '#334155' },
];

export function AppearanceSection() {
  const { theme, accent, density, novitColor, sharkyColor } = useUIStore();
  const setTheme = useUIStore((s) => s.setTheme);
  const setAccent = useUIStore((s) => s.setAccent);
  const setDensity = useUIStore((s) => s.setDensity);
  const setNovitColor = useUIStore((s) => s.setNovitColor);
  const setSharkyColor = useUIStore((s) => s.setSharkyColor);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <SettingsCard
        title="Tema"
        description="Cambia entre claro y oscuro. La preferencia se guarda en este navegador."
      >
        <Segmented
          value={theme}
          options={[
            { id: 'light', label: 'Claro' },
            { id: 'dark', label: 'Oscuro' },
          ]}
          onChange={(v) => setTheme(v as Theme)}
        />
      </SettingsCard>

      <SettingsCard
        title="Color de acento"
        description="Aplica al botón primario, links y resaltados del producto."
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ACCENTS.map((a) => {
            const active = accent === a.value;
            return (
              <button
                key={a.id}
                onClick={() => setAccent(a.value)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: `1px solid ${active ? a.value : 'var(--border)'}`,
                  background: active
                    ? `color-mix(in srgb, ${a.value} 10%, transparent)`
                    : 'var(--surface)',
                  color: active ? a.value : 'var(--text-2)',
                  fontSize: 12.5,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    background: a.value,
                  }}
                />
                {a.label}
              </button>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Densidad"
        description="Cómoda usa más respiración; densa muestra más contenido por pantalla."
      >
        <Segmented
          value={density}
          options={[
            { id: 'comfortable', label: 'Cómoda' },
            { id: 'compact', label: 'Densa' },
          ]}
          onChange={(v) => setDensity(v as Density)}
        />
      </SettingsCard>

      <SettingsCard
        title="Marca"
        description="Colores corporativos de NOVIT y SHARKY usados en tags y gráficos."
      >
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <ColorPicker label="NOVIT" value={novitColor} onChange={setNovitColor} />
          <ColorPicker label="SHARKY" value={sharkyColor} onChange={setSharkyColor} />
        </div>
      </SettingsCard>
    </div>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card padding={18}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
          {description}
        </div>
      </div>
      {children}
    </Card>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        gap: 4,
        padding: 3,
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 8,
      }}
    >
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            style={{
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'inherit',
              borderRadius: 5,
              border: 'none',
              background: active ? 'var(--surface)' : 'transparent',
              color: active ? 'var(--text)' : 'var(--text-3)',
              cursor: 'pointer',
              boxShadow: active ? '0 1px 0 var(--border)' : 'none',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 38,
          height: 38,
          padding: 0,
          border: '1px solid var(--border)',
          borderRadius: 8,
          background: 'var(--surface)',
          cursor: 'pointer',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>
          {label}
        </span>
        <code
          style={{
            fontSize: 11,
            color: 'var(--text-3)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {value}
        </code>
      </div>
    </label>
  );
}
