import { Card } from '@/components/ui';
import { EMAIL_TEMPLATES, WHATSAPP_TEMPLATES } from '@/data/mock';

export function TemplatesSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card padding={0}>
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Plantillas WhatsApp
        </div>
        {WHATSAPP_TEMPLATES.map((t) => (
          <div
            key={t.id}
            style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 4 }}>
              {t.name}
            </div>
            <div
              style={{ fontSize: 11.5, color: 'var(--text-3)', lineHeight: 1.45 }}
            >
              {t.body}
            </div>
          </div>
        ))}
      </Card>
      <Card padding={0}>
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Plantillas Correo
        </div>
        {EMAIL_TEMPLATES.map((t) => (
          <div
            key={t.id}
            style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 4 }}>
              {t.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>
              <strong>Asunto:</strong> {t.subject}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--text-3)',
                lineHeight: 1.45,
                whiteSpace: 'pre-wrap',
              }}
            >
              {t.body}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
