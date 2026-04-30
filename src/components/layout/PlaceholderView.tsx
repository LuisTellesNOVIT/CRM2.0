import type { ReactNode } from 'react';
import { Card } from '@/components/ui';
import { TopBar } from './TopBar';

interface PlaceholderViewProps {
  title: string;
  subtitle?: string;
  hint?: string;
  children?: ReactNode;
}

export function PlaceholderView({ title, subtitle, hint, children }: PlaceholderViewProps) {
  return (
    <>
      <TopBar title={title} subtitle={subtitle} />
      <div style={{ padding: '8px 32px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
        <Card>
          <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
            Esta vista se implementa en una fase posterior.
            {hint && (
              <>
                <br />
                <span style={{ color: 'var(--text-3)', fontSize: 12 }}>{hint}</span>
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
