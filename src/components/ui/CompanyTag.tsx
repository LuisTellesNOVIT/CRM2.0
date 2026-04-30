import type { Company } from '@/types';

interface CompanyTagProps {
  company: Company;
  size?: 'sm' | 'md';
}

export function CompanyTag({ company, size = 'md' }: CompanyTagProps) {
  const isNovit = company === 'NOVIT';
  const c = isNovit ? 'var(--novit)' : 'var(--sharky)';
  const padding = size === 'sm' ? '2px 7px' : '3px 8px';
  const fontSize = size === 'sm' ? 10.5 : 11;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding,
        borderRadius: 6,
        fontSize,
        fontWeight: 600,
        letterSpacing: 0.4,
        color: c,
        background: `color-mix(in srgb, ${c} 8%, transparent)`,
        border: `1px solid color-mix(in srgb, ${c} 19%, transparent)`,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: 1, background: c }} />
      {company}
    </span>
  );
}
