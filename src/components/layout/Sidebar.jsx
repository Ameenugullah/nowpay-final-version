import {
  RiDashboardLine, RiFileList3Line, RiSendPlaneLine,
  RiDownloadLine, RiSettings4Line,
} from 'react-icons/ri';
import { CURRENT_USER } from '@/utils/constants';

const NAV_ITEMS = [
  { key: 'dashboard',    Icon: RiDashboardLine,  label: 'Dashboard'    },
  { key: 'transactions', Icon: RiFileList3Line,   label: 'Transactions' },
  { key: 'send',         Icon: RiSendPlaneLine,   label: 'Send Money'   },
  { key: 'receive',      Icon: RiDownloadLine,    label: 'Receive'      },
  { key: 'settings',     Icon: RiSettings4Line,   label: 'Settings'     },
];

export default function Sidebar({ activePage, onNav, mobileOpen, onClose }) {
  return (
    <>
      {/* Overlay (mobile) */}
      {mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 190,
          }}
        />
      )}

      <aside
        style={{
          width: 244,
          minHeight: '100dvh',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          position: 'fixed', left: 0, top: 0,
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform .28s ease, background .3s, border-color .3s',
          transform: mobileOpen ? 'translateX(0)' : undefined,
        }}
        className="sidebar-aside"
      >
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '24px 20px 20px',
          borderBottom: '1px solid var(--border-s)',
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px var(--primary-gl)', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fff" />
              <path d="M2 17l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeOpacity=".6"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.4 }}>NowPay</div>
            <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>Digital Wallet</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV_ITEMS.map(({ key, Icon, label }) => {
            const active = activePage === key;
            return (
              <button
                key={key}
                onClick={() => { onNav(key); onClose?.(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '11px 13px', borderRadius: 'var(--r-sm)',
                  fontSize: 13.5, fontWeight: active ? 600 : 500,
                  color: active ? 'var(--primary)' : 'var(--text-s)',
                  background: active ? 'var(--primary-gl)' : 'transparent',
                  border: 'none', width: '100%', textAlign: 'left',
                  cursor: 'pointer', transition: 'all .15s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'var(--card-h)'; e.currentTarget.style.color = 'var(--text)'; }}}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-s)'; }}}
              >
                <Icon size={18} />
                {label}
                {active && (
                  <span style={{
                    position: 'absolute', right: 13,
                    width: 5, height: 5, borderRadius: '50%',
                    background: 'var(--primary)',
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: 12, borderTop: '1px solid var(--border-s)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 'var(--r-sm)',
            background: 'var(--card-h)',
          }}>
            <img
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.name}
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {CURRENT_USER.firstName}
              </div>
              <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500 }}>Premium</div>
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 640px) {
          .sidebar-aside {
            transform: translateX(${mobileOpen ? '0' : '-100%'}) !important;
          }
        }
      `}</style>
    </>
  );
}
