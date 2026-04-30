import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/stores';

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('diego.ramirez@novit.pe');
  const [password, setPassword] = useState('demo');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(email);
    void password;
    navigate('/dashboard', { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: 24,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: 400,
          maxWidth: '100%',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: 'linear-gradient(135deg, var(--novit), var(--sharky))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 0.5,
            }}
          >
            NS
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
              Novit · Sharky
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
              CRM Comercial
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Correo</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <Button type="submit" variant="primary" size="lg">
          Ingresar
        </Button>

        <div style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>
          Cualquier credencial entra. Usa un email del seed para entrar como ese usuario.
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  height: 36,
  padding: '0 12px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  fontSize: 13,
  color: 'var(--text)',
  outline: 'none',
};
