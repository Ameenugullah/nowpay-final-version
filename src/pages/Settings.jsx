import { useState } from 'react';
import { RiKeyLine, RiShieldCheckLine, RiEyeLine, RiEyeOffLine, RiFileCopyLine, RiAlertLine } from 'react-icons/ri';
import Toggle from '@/components/ui/Toggle';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { copyToClipboard } from '@/utils/formatters';
import { CURRENT_USER } from '@/utils/constants';

// ─────────────────────────────────────────────────────────────
// API KEY CONFIGURATION
// Replace the placeholder values below with your actual keys,
// OR set them in your .env file as VITE_PAYSTACK_SECRET_KEY, etc.
// NEVER hardcode real secrets — use environment variables.
// ─────────────────────────────────────────────────────────────
const API_KEY_INITIAL = {
  ps_sk:  import.meta.env.VITE_PAYSTACK_SECRET_KEY    || '',
  ps_pk:  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY    || '',
  fw_sk:  import.meta.env.VITE_FLUTTERWAVE_SECRET_KEY || '',
  fw_pk:  import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '',
  pp_id:  import.meta.env.VITE_PAYPAL_CLIENT_ID       || '',
  pp_sk:  import.meta.env.VITE_PAYPAL_SECRET          || '',
};

const GATEWAY_GROUPS = [
  {
    label: 'Paystack', img: '/images/paystack.png', active: true,
    fields: [
      { id: 'ps_sk', label: 'Secret Key',  ph: 'sk_live_xxxxxxxxxxxxxxxx' },
      { id: 'ps_pk', label: 'Public Key',  ph: 'pk_live_xxxxxxxxxxxxxxxx' },
    ],
  },
  {
    label: 'Flutterwave', img: '/images/flutterwave.jpg', active: true,
    fields: [
      { id: 'fw_sk', label: 'Secret Key',  ph: 'FLWSECK_xxxxxxxxxxxxxxxxxxxx' },
      { id: 'fw_pk', label: 'Public Key',  ph: 'FLWPUBK_xxxxxxxxxxxxxxxxxxxx' },
    ],
  },
  {
    label: 'PayPal', img: '/images/paypal.png', active: false,
    fields: [
      { id: 'pp_id', label: 'Client ID',   ph: 'YOUR_PAYPAL_CLIENT_ID_HERE' },
      { id: 'pp_sk', label: 'Secret Key',  ph: 'YOUR_PAYPAL_SECRET_HERE'    },
    ],
  },
];

export default function Settings() {
  const { theme, setThemeMode } = useTheme();
  const toast = useToast();

  const [apiKeys, setApiKeys] = useState(API_KEY_INITIAL);
  const [visible, setVisible] = useState({});
  const [notifs, setNotifs]   = useState({ txAlerts: true, loginAlerts: true, promo: false, weekly: true });

  const inputStyle = {
    flex: 1, padding: '9px 12px',
    background: 'var(--card)', border: '1.5px solid var(--border)',
    borderRadius: 8, fontFamily: "'JetBrains Mono',monospace",
    fontSize: 12, color: 'var(--text)', transition: 'all .2s', outline: 'none',
  };

  const copyKey = async (id) => {
    if (!apiKeys[id]?.trim()) { toast('⚠ No key entered', 'error'); return; }
    await copyToClipboard(apiKeys[id]);
    toast('✓ API key copied', 'success');
  };

  return (
    <div className="page-enter" style={{ padding: 26 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="settings-layout">

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Profile */}
          <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Profile Information</h3>
              <button style={{
                padding: '5px 14px', borderRadius: 7,
                background: 'var(--primary-gl)', border: '1px solid var(--primary)',
                color: 'var(--primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif",
              }}>
                Edit
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, paddingBottom: 18, borderBottom: '1px solid var(--border-s)' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} style={{ width: 62, height: 62, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
                <div style={{
                  position: 'absolute', bottom: -1, right: -1,
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'var(--primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, cursor: 'pointer', border: '2px solid var(--card)',
                }}>✏</div>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{CURRENT_USER.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-s)', marginBottom: 5 }}>{CURRENT_USER.email}</div>
                <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(246,201,78,.12)', color: 'var(--gold)' }}>
                  Premium Member
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[{ label: 'First Name', val: 'Abdul-malik' }, { label: 'Last Name', val: 'Aminu' }].map((f) => (
                  <div key={f.label}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-s)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{f.label}</label>
                    <input defaultValue={f.val} style={{
                      width: '100%', padding: '11px 13px',
                      background: 'var(--surface)', border: '1.5px solid var(--border)',
                      borderRadius: 'var(--r-sm)', fontSize: 14, color: 'var(--text)',
                      outline: 'none', transition: 'all .2s', fontFamily: "'Outfit', sans-serif",
                    }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-s)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Phone Number</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '4px 10px' }}>
                  <img src="/images/ng-flag.svg" alt="NG" style={{ height: 14, borderRadius: 2 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-s)' }}>+234</span>
                  <input type="tel" defaultValue="080 1234 5678" style={{ border: 'none', background: 'transparent', fontSize: 14, color: 'var(--text)', padding: '9px 4px', flex: 1, outline: 'none', fontFamily: "'Outfit', sans-serif" }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-s)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Email Address</label>
                <input type="email" defaultValue={CURRENT_USER.email} style={{
                  width: '100%', padding: '11px 13px',
                  background: 'var(--surface)', border: '1.5px solid var(--border)',
                  borderRadius: 'var(--r-sm)', fontSize: 14, color: 'var(--text)',
                  outline: 'none', transition: 'all .2s', fontFamily: "'Outfit', sans-serif",
                }} />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Appearance</h3>
            <div style={{ display: 'flex', gap: 14 }}>
              {[
                { mode: 'dark',  label: 'Dark Mode',  bg: '#070B14', bar: '#1E2D45', card: '#111827' },
                { mode: 'light', label: 'Light Mode', bg: '#EEF2FF', bar: '#D0D9F0', card: '#FFFFFF' },
              ].map((a) => (
                <div
                  key={a.mode}
                  onClick={() => setThemeMode(a.mode)}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, cursor: 'pointer' }}
                >
                  <div style={{
                    width: '100%', aspectRatio: '1.7', borderRadius: 11,
                    border: `2px solid ${theme === a.mode ? 'var(--primary)' : 'var(--border)'}`,
                    padding: 8, overflow: 'hidden',
                    background: a.bg, display: 'flex', flexDirection: 'column', gap: 5,
                    transition: 'border-color .2s',
                  }}>
                    <div style={{ height: 5, borderRadius: 2, background: a.bar }} />
                    <div style={{ flex: 1, borderRadius: 5, background: a.card }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: theme === a.mode ? 'var(--primary)' : 'var(--text)' }}>
                    {a.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 18 }}>Notifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { id: 'txAlerts',    label: 'Transaction Alerts', sub: 'Get notified on every transaction' },
                { id: 'loginAlerts', label: 'Login Alerts',       sub: 'Alert me on new sign-ins' },
                { id: 'promo',       label: 'Promotions',         sub: 'Special deals and cashback offers' },
                { id: 'weekly',      label: 'Weekly Summary',     sub: 'Weekly spending report via email' },
              ].map((n) => (
                <div key={n.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{n.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-s)' }}>{n.sub}</div>
                  </div>
                  <Toggle
                    id={n.id}
                    checked={notifs[n.id]}
                    onChange={(v) => setNotifs(p => ({ ...p, [n.id]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* API KEY CONFIGURATION */}
          <div style={{ background: 'var(--card)', border: '1.5px solid var(--primary)', borderRadius: 'var(--r-lg)', padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiKeyLine size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>API Key Configuration</h3>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(52,211,153,.12)', color: 'var(--green)' }}>
                <RiShieldCheckLine size={11} /> Secure
              </span>
            </div>

            <p style={{ fontSize: 12.5, color: 'var(--text-s)', marginBottom: 18, lineHeight: 1.65 }}>
              Manage your payment gateway API keys. Set these in your <code style={{ fontFamily: "'JetBrains Mono',monospace", background: 'var(--surface)', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>.env</code> file. Never share secret keys publicly.
            </p>

            {GATEWAY_GROUPS.map((grp) => (
              <div key={grp.label} style={{
                background: 'var(--surface)', border: '1.5px solid var(--border)',
                borderRadius: 'var(--r-sm)', padding: 14, marginBottom: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10, paddingBottom: 9, borderBottom: '1px solid var(--border-s)' }}>
                  <img src={grp.img} alt={grp.label} style={{ height: 20, width: 'auto', objectFit: 'contain', borderRadius: 3 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{grp.label}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                    background: grp.active ? 'rgba(52,211,153,.12)' : 'rgba(100,120,150,.1)',
                    color: grp.active ? 'var(--green)' : 'var(--text-s)',
                  }}>
                    {grp.active ? 'Active' : 'Not Connected'}
                  </span>
                </div>

                {grp.fields.map((f) => (
                  <div key={f.id} style={{ marginBottom: 9 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-s)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                      {f.label}
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type={visible[f.id] ? 'text' : 'password'}
                        placeholder={f.ph}
                        value={apiKeys[f.id]}
                        onChange={(e) => setApiKeys(p => ({ ...p, [f.id]: e.target.value }))}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-gl)'; }}
                        onBlur={(e)  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                      />
                      <button
                        onClick={() => setVisible(v => ({ ...v, [f.id]: !v[f.id] }))}
                        style={{ padding: '7px 10px', borderRadius: 7, background: 'var(--card-h)', border: '1.5px solid var(--border)', color: visible[f.id] ? 'var(--primary)' : 'var(--text-s)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all .15s' }}
                      >
                        {visible[f.id] ? <RiEyeOffLine size={14} /> : <RiEyeLine size={14} />}
                      </button>
                      <button
                        onClick={() => copyKey(f.id)}
                        style={{ padding: '7px 10px', borderRadius: 7, background: 'var(--card-h)', border: '1.5px solid var(--border)', color: 'var(--text-s)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, transition: 'all .15s', fontFamily: "'Outfit', sans-serif" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-s)'; }}
                      >
                        <RiFileCopyLine size={13} /> Copy
                      </button>
                    </div>
                  </div>
                ))}

                {!grp.active && (
                  <button onClick={() => toast(`Redirecting to ${grp.label} dashboard…`, 'info')} style={{
                    width: '100%', marginTop: 7, padding: '8px', borderRadius: 8,
                    background: 'var(--primary-gl)', border: '1.5px solid var(--primary)',
                    color: 'var(--primary)', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', transition: 'all .18s', fontFamily: "'Outfit', sans-serif",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-gl)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  >
                    Connect {grp.label}
                  </button>
                )}
              </div>
            ))}

            {/* Save / Revoke */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14 }}>
              <button
                onClick={() => toast('✓ API keys saved securely', 'success')}
                style={{
                  padding: '10px 20px', borderRadius: 'var(--r-sm)',
                  background: 'var(--primary)', color: '#fff',
                  border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  boxShadow: 'var(--sh-primary)', transition: 'all .2s',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Save Keys
              </button>
              <button
                onClick={() => { setApiKeys({ ps_sk: '', ps_pk: '', fw_sk: '', fw_pk: '', pp_id: '', pp_sk: '' }); toast('All API keys revoked', 'info'); }}
                style={{
                  padding: '9px 18px', borderRadius: 'var(--r-sm)',
                  background: 'rgba(248,113,113,.1)', border: '1.5px solid rgba(248,113,113,.3)',
                  color: 'var(--red)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  transition: 'all .18s', fontFamily: "'Outfit', sans-serif",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,.18)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,.1)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,.3)'; }}
              >
                Revoke All
              </button>
            </div>

            {/* Security warning */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '11px 13px', borderRadius: 9,
              background: 'rgba(246,201,78,.05)',
              border: '1.5px solid rgba(246,201,78,.18)',
              fontSize: 12, color: 'var(--text-s)', marginTop: 14, lineHeight: 1.6,
            }}>
              <RiAlertLine size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }} />
              <span>
                API keys are stored locally for demo purposes only. In production, always store secret keys server-side and never expose them in client code or public repositories.
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .settings-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
