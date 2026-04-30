import { useEffect, useState } from 'react';
import { Icon } from '@/components/icons/Icon';
import { Badge, Button, Card } from '@/components/ui';
import type { Client, Opportunity, Template, User } from '@/types';

interface MessageComposerProps {
  kind: 'whatsapp' | 'email';
  opp: Opportunity;
  client: Client;
  owner: User | undefined;
  templates: Template[];
  onSend: (msg: { subject?: string; body: string }) => void;
}

function fillPlaceholders(text: string, opp: Opportunity, client: Client, owner: User | undefined): string {
  return text
    .replace(/\{\{cliente\}\}/g, client.contact)
    .replace(/\{\{proyecto\}\}/g, opp.project)
    .replace(/\{\{empresa\}\}/g, opp.company)
    .replace(/\{\{owner\}\}/g, owner?.name ?? '');
}

export function MessageComposer({
  kind,
  opp,
  client,
  owner,
  templates,
  onSend,
}: MessageComposerProps) {
  const [tplId, setTplId] = useState(templates[0]?.id ?? '');
  const [body, setBody] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;
    setBody(fillPlaceholders(tpl.body, opp, client, owner));
    if (tpl.subject) setSubject(fillPlaceholders(tpl.subject, opp, client, owner));
  }, [tplId, opp.id, client.id, owner?.id, templates]);

  const send = () => {
    if (!body.trim()) return;
    onSend({ subject: kind === 'email' ? subject : undefined, body });
    setBody('');
  };

  return (
    <Card padding={16}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Icon
          name={kind === 'whatsapp' ? 'whatsapp' : 'mail'}
          size={15}
          style={{ color: kind === 'whatsapp' ? '#25d366' : 'var(--accent)' }}
        />
        <span style={{ fontSize: 13, fontWeight: 600 }}>
          Nuevo {kind === 'whatsapp' ? 'WhatsApp' : 'correo'}
        </span>
        <select
          value={tplId}
          onChange={(e) => setTplId(e.target.value)}
          style={{
            ...inputBase,
            marginLeft: 'auto',
            maxWidth: 220,
            width: 220,
            height: 30,
            fontSize: 11.5,
          }}
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginBottom: 8 }}>
        Para: <span style={{ color: 'var(--text)' }}>{client.contact}</span> ·{' '}
        {kind === 'whatsapp' ? client.phone : client.email}
      </div>
      {kind === 'email' && (
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Asunto"
          style={{ ...inputBase, marginBottom: 8 }}
        />
      )}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        style={{
          ...inputBase,
          height: 'auto',
          resize: 'vertical',
          fontFamily: 'inherit',
          lineHeight: 1.5,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
        <Badge color="var(--text-3)" soft style={{ fontSize: 10 }}>
          Modo demo · no se envía
        </Badge>
        <Button
          variant="primary"
          icon={kind === 'whatsapp' ? 'whatsapp' : 'mail'}
          style={{ marginLeft: 'auto' }}
          onClick={send}
        >
          Enviar {kind === 'whatsapp' ? 'WhatsApp' : 'correo'}
        </Button>
      </div>
    </Card>
  );
}

const inputBase = {
  width: '100%',
  padding: '7px 10px',
  borderRadius: 7,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  fontSize: 12.5,
  color: 'var(--text)',
  fontFamily: 'inherit',
  outline: 'none',
  height: 34,
  boxSizing: 'border-box' as const,
};
