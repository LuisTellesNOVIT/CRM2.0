import { Icon, type IconName } from '@/components/icons/Icon';
import { Badge, Button, Card } from '@/components/ui';

interface Integration {
  name: string;
  provider: string;
  status: 'sandbox' | 'no-conectado';
  icon: IconName;
  color: string;
}

const ITEMS: Integration[] = [
  {
    name: 'WhatsApp Business API',
    provider: '360Dialog · ApiChat · Twilio',
    status: 'sandbox',
    icon: 'whatsapp',
    color: '#25d366',
  },
  {
    name: 'Email transaccional',
    provider: 'Resend · SendGrid',
    status: 'sandbox',
    icon: 'mail',
    color: 'var(--accent)',
  },
  {
    name: 'Supabase Postgres',
    provider: 'Datos + Auth',
    status: 'no-conectado',
    icon: 'file',
    color: '#3ecf8e',
  },
  {
    name: 'Vercel deploy',
    provider: 'Producción',
    status: 'no-conectado',
    icon: 'bolt',
    color: 'var(--text)',
  },
];

export function IntegrationsSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {ITEMS.map((it) => (
        <Card key={it.name} padding={16}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: `color-mix(in srgb, ${it.color} 10%, transparent)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: it.color,
              }}
            >
              <Icon name={it.icon} size={15} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{it.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{it.provider}</div>
            </div>
            <Badge
              color={it.status === 'sandbox' ? 'var(--warning)' : 'var(--text-3)'}
              soft
            >
              {it.status}
            </Badge>
          </div>
          <Button size="sm" variant="secondary" style={{ width: '100%' }}>
            Configurar credenciales
          </Button>
        </Card>
      ))}
    </div>
  );
}
