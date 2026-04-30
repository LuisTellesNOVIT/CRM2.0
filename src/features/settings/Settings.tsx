import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Icon, type IconName } from '@/components/icons/Icon';
import { AppearanceSection } from './sections/AppearanceSection';
import { IntegrationsSection } from './sections/IntegrationsSection';
import { PipelineSection } from './sections/PipelineSection';
import { TemplatesSection } from './sections/TemplatesSection';
import { UsersSection } from './sections/UsersSection';

type SectionId = 'appearance' | 'users' | 'templates' | 'integrations' | 'pipeline';

interface SectionItem {
  id: SectionId;
  label: string;
  icon: IconName;
}

const SECTIONS: SectionItem[] = [
  { id: 'appearance', label: 'Apariencia', icon: 'sparkles' },
  { id: 'users', label: 'Usuarios y roles', icon: 'users' },
  { id: 'templates', label: 'Plantillas', icon: 'file' },
  { id: 'integrations', label: 'Integraciones', icon: 'bolt' },
  { id: 'pipeline', label: 'Pipeline', icon: 'kanban' },
];

export function Settings() {
  const [section, setSection] = useState<SectionId>('appearance');

  return (
    <>
      <TopBar
        title="Configuración"
        subtitle="Apariencia, usuarios, plantillas e integraciones."
      />
      <div
        style={{
          padding: '4px 32px 40px',
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          gap: 24,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SECTIONS.map((s) => {
            const active = section === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 7,
                  background: active ? 'var(--surface-2)' : 'transparent',
                  border: '1px solid',
                  borderColor: active ? 'var(--border)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--text-2)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  textAlign: 'left',
                }}
              >
                <Icon name={s.icon} size={14} />
                {s.label}
              </button>
            );
          })}
        </div>
        <div>
          {section === 'appearance' && <AppearanceSection />}
          {section === 'users' && <UsersSection />}
          {section === 'templates' && <TemplatesSection />}
          {section === 'integrations' && <IntegrationsSection />}
          {section === 'pipeline' && <PipelineSection />}
        </div>
      </div>
    </>
  );
}
