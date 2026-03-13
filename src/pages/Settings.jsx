import { useState } from 'react';
import { RiKeyLine, RiShieldCheckLine, RiEyeLine, RiEyeOffLine, RiFileCopyLine, RiAlertLine } from 'react-icons/ri';
import Toggle from '@/components/ui/Toggle';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { copyToClipboard } from '@/utils/formatters';
import { CURRENT_USER } from '@/utils/constants';

// ── API KEY CONFIG ─────────────────────────────────────────
// Set real keys in your .env file:
//   VITE_PAYSTACK_SECRET_KEY=sk_live_xxxx
//   VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxx
// NEVER hardcode secret keys in source code.
const INITIAL_KEYS = {
  ps_sk: import.meta.env.VITE_PAYSTACK_SECRET_KEY || '',
  ps_pk: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
};

export default function Settings() {
  const { theme, setThemeMode } = useTheme();
  const toast = useToast();

  const [apiKeys, setApiKeys] = useState(INITIAL_KEYS);
  const [visible, setVisible] = useState({});
  const [notifs, setNotifs]   = useState({ txAlerts: true, loginAlerts: true, promo: false, weekly: true });

  const inputStyle = {
    flex: 1, padding: '10px 12px',
    background: 'var(--card)', border: '1.5px solid var(--border)',
    borderRadius: 8, fontFamily: "'JetBrains Mono',monospace",
    fontSize: 12, color: 'var(--text)', transition: 'all .2s', outline: 'none',
    minWidth: 0,
  };

  const label = (text) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-s)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{text}</div>
  );

  const copyKey = async (id) => {
    if (!apiKeys[id]?.trim()) { toast('⚠ No key entered', 'error'); return; }
    await copyToClipboard(apiKeys[id]);
    toast('✓ Copied to clipboard', 'success');
  };

  const PAYSTACK_FIELDS = [
    { id: 'ps_sk', label: 'Secret Key',  ph: 'sk_live_xxxxxxxxxxxxxxxx' },
    { id: 'ps_pk', label: 'Public Key',  ph: 'pk_live_xxxxxxxxxxxxxxxx' },
  ];

  return (
    <div className="page-enter settings-page">
      <div className="settings-grid">

        {/* ── LEFT COLUMN ─────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Profile */}
          <div className="card-static" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Profile Information</h3>
              <button style={{ padding: '5px 14px', borderRadius: 7, background: 'var(--primary-gl)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
                Edit
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, paddingBottom: 18, borderBottom: '1px solid var(--border-s)', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} style={{ width: 62, height: 62, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
                <div style={{ position: 'absolute', bottom: -1, right: -1, width: 20, height: 20, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, cursor: 'pointer', border: '2px solid var(--card)' }}>✏</div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{CURRENT_USER.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-s)', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis' }}>{CURRENT_USER.email}</div>
                <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(246,201,78,.12)', color: 'var(--gold)' }}>
                  Premium Member
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="settings-two-col">
                {[{ l: 'First Name', v: 'Abdul-malik' }, { l: 'Last Name', v: 'Aminu' }].map(f => (
                  <div key={f.l}>
                    {label(f.l)}
                    <input defaultValue={f.v} style={{ ...inputStyle, fontFamily: "'Outfit',sans-serif", width: '100%', borderRadius: 'var(--r-sm)', padding: '11px 13px' }} />
                  </div>
                ))}
              </div>
              <div>
                {label('Phone Number')}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '4px 10px' }}>
                  <img src="/images/ng-flag.svg" alt="NG" style={{ height: 14, borderRadius: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-s)', flexShrink: 0 }}>+234</span>
                  <input type="tel" defaultValue="080 1234 5678" style={{ border: 'none', background: 'transparent', fontSize: 14, color: 'var(--text)', padding: '9px 4px', flex: 1, outline: 'none', fontFamily: "'Outfit',sans-serif", minWidth: 0 }} />
                </div>
              </div>
              <div>
                {label('Email Address')}
                <input type="email" defaultValue={CURRENT_USER.email} style={{ ...inputStyle, fontFamily: "'Outfit',sans-serif", width: '100%', borderRadius: 'var(--r-sm)', padding: '11px 13px' }} />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="card-static" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Appearance</h3>
            <div style={{ display: 'flex', gap: 14 }}>
              {[
                { mode: 'dark',  label: 'Dark Mode',  bg: '#070B14', bar: '#1E2D45', card: '#111827' },
                { mode: 'light', label: 'Light Mode', bg: '#EEF2FF', bar: '#D0D9F0', card: '#FFFFFF' },
              ].map(a => (
                <div key={a.mode} onClick={() => setThemeMode(a.mode)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
                  <div style={{
                    width: '100%', aspectRatio: '1.7', borderRadius: 11,
                    border: `2px solid ${theme === a.mode ? 'var(--primary)' : 'var(--border)'}`,
                    padding: 8, background: a.bg, display: 'flex', flexDirection: 'column', gap: 5,
                    transition: 'border-color .2s',
                  }}>
                    <div style={{ height: 5, borderRadius: 2, background: a.bar }} />
                    <div style={{ flex: 1, borderRadius: 5, background: a.card }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: theme === a.mode ? 'var(--primary)' : 'var(--text)' }}>{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="card-static" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 18 }}>Notifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { id: 'txAlerts',    label: 'Transaction Alerts', sub: 'Get notified on every transaction' },
                { id: 'loginAlerts', label: 'Login Alerts',       sub: 'Alert me on new sign-ins' },
                { id: 'promo',       label: 'Promotions',         sub: 'Special deals and cashback offers' },
                { id: 'weekly',      label: 'Weekly Summary',     sub: 'Weekly spending report via email' },
              ].map(n => (
                <div key={n.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{n.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-s)' }}>{n.sub}</div>
                  </div>
                  <Toggle id={n.id} checked={notifs[n.id]} onChange={v => setNotifs(p => ({ ...p, [n.id]: v }))} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Paystack API Key */}
          <div className="card-static" style={{ padding: 22, border: '1.5px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiKeyLine size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>API Key Configuration</h3>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(52,211,153,.12)', color: 'var(--green)', whiteSpace: 'nowrap' }}>
                <RiShieldCheckLine size={11} /> Secure
              </span>
            </div>

            <p style={{ fontSize: 12.5, color: 'var(--text-s)', marginBottom: 16, lineHeight: 1.65 }}>
              Set your Paystack API keys in your <code style={{ fontFamily: "'JetBrains Mono',monospace", background: 'var(--surface)', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>.env</code> file.
              Never expose secret keys in client code.
            </p>

            {/* Paystack block */}
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border-s)' }}>
                <img src="/images/paystack.png" alt="Paystack" style={{ height: 20, width: 'auto', objectFit: 'contain', borderRadius: 3 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Paystack</span>
                <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: 'rgba(52,211,153,.12)', color: 'var(--green)', whiteSpace: 'nowrap' }}>Active</span>
              </div>

              {PAYSTACK_FIELDS.map(f => (
                <div key={f.id} style={{ marginBottom: 10 }}>
                  {label(f.label)}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type={visible[f.id] ? 'text' : 'password'}
                      placeholder={f.ph}
                      value={apiKeys[f.id]}
                      onChange={e => setApiKeys(p => ({ ...p, [f.id]: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-gl)'; }}
                      onBlur={e  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                    />
                    <button
                      onClick={() => setVisible(v => ({ ...v, [f.id]: !v[f.id] }))}
                      style={{ padding: '8px 10px', borderRadius: 7, background: 'var(--card-h)', border: '1.5px solid var(--border)', color: visible[f.id] ? 'var(--primary)' : 'var(--text-s)', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'all .15s' }}
                    >
                      {visible[f.id] ? <RiEyeOffLine size={14} /> : <RiEyeLine size={14} />}
                    </button>
                    <button
                      onClick={() => copyKey(f.id)}
                      style={{ padding: '8px 10px', borderRadius: 7, background: 'var(--card-h)', border: '1.5px solid var(--border)', color: 'var(--text-s)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, flexShrink: 0, transition: 'all .15s', fontFamily: "'Outfit',sans-serif" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-s)'; }}
                    >
                      <RiFileCopyLine size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Save / Revoke */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => toast('✓ API keys saved securely', 'success')}
                style={{ padding: '10px 20px', borderRadius: 'var(--r-sm)', background: 'var(--primary)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--sh-primary)', fontFamily: "'Outfit',sans-serif" }}
              >
                Save Keys
              </button>
              <button
                onClick={() => { setApiKeys({ ps_sk: '', ps_pk: '' }); toast('Keys revoked', 'info'); }}
                style={{ padding: '10px 18px', borderRadius: 'var(--r-sm)', background: 'rgba(248,113,113,.1)', border: '1.5px solid rgba(248,113,113,.3)', color: 'var(--red)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}
              >
                Revoke All
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '11px 13px', borderRadius: 9, background: 'rgba(246,201,78,.05)', border: '1.5px solid rgba(246,201,78,.18)', fontSize: 12, color: 'var(--text-s)', marginTop: 14, lineHeight: 1.6 }}>
              <RiAlertLine size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }} />
              <span>Secret keys must live on your backend server, not in client code. Public keys are safe to use in the frontend.</span>
            </div>
          </div>

          {/* .env reference card */}
          <div className="card-static" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Environment Setup</h3>
            <p style={{ fontSize: 12, color: 'var(--text-s)', marginBottom: 12, lineHeight: 1.6 }}>
              Create a <code style={{ fontFamily: "'JetBrains Mono',monospace", background: 'var(--surface)', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>.env</code> file in your project root:
            </p>
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 9, padding: '12px 14px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: 'var(--text-s)', lineHeight: 1.9, overflowX: 'auto' }}>
              <div><span style={{ color: 'var(--text-m)' }}># Paystack Keys</span></div>
              <div><span style={{ color: 'var(--green)' }}>VITE_PAYSTACK_PUBLIC_KEY</span>=pk_live_xxx</div>
              <div><span style={{ color: 'var(--green)' }}>VITE_PAYSTACK_SECRET_KEY</span>=sk_live_xxx</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .settings-page { padding: 26px; overflow-x: hidden; }
        .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .settings-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        @media (max-width: 960px) {
          .settings-grid { grid-template-columns: 1fr !important; }
          .settings-page { padding: 18px; }
        }
        @media (max-width: 480px) {
          .settings-page { padding: 14px; }
          .settings-two-col { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 360px) {
          .settings-page { padding: 10px; }
        }
      `}</style>
    </div>
  );
}
