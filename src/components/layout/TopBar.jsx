import { RiSunLine, RiMoonLine, RiBellLine, RiSearchLine, RiMenu2Line } from 'react-icons/ri';
import { useTheme } from '@/context/ThemeContext';
import { CURRENT_USER } from '@/utils/constants';

const PAGE_META = {
  dashboard:    { title: 'Dashboard',     sub: `Welcome back, ${CURRENT_USER.firstName} 👋` },
  transactions: { title: 'Transactions',  sub: 'Your complete payment history' },
  send:         { title: 'Send Money',    sub: 'Transfer funds instantly and securely' },
  receive:      { title: 'Receive',       sub: 'Share your account details' },
  settings:     { title: 'Settings',      sub: 'Manage your wallet and preferences' },
};

export default function TopBar({ activePage, onMenuClick, sidebarWidth = 244 }) {
  const { theme, toggleTheme } = useTheme();
  const meta = PAGE_META[activePage] || { title: 'NowPay', sub: '' };

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0, left: sidebarWidth, right: 0,
        height: 64,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 100,
        transition: 'background .3s, border-color .3s',
      }} className="topbar">
        {/* Left: menu + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button
            onClick={onMenuClick}
            className="topbar-menu-btn"
            aria-label="Open menu"
            style={{
              width: 36, height: 36, borderRadius: 9,
              background: 'var(--card)', border: '1px solid var(--border)',
              display: 'none', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-s)', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <RiMenu2Line size={19} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {meta.title}
            </div>
            <div className="topbar-sub" style={{ fontSize: 12, color: 'var(--text-s)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {meta.sub}
            </div>
          </div>
        </div>

        {/* Right: controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Search — desktop only */}
          <div className="topbar-search" style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 9, padding: '7px 13px', color: 'var(--text-s)' }}>
            <RiSearchLine size={14} />
            <input
              placeholder="Search…"
              style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 12.5, width: 140, outline: 'none', fontFamily: "'Outfit',sans-serif" }}
            />
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-s)', cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-s)'; }}
          >
            {theme === 'dark' ? <RiSunLine size={17} /> : <RiMoonLine size={17} />}
          </button>

          {/* Notifications */}
          <button style={{ width: 36, height: 36, borderRadius: 9, position: 'relative', background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-s)', cursor: 'pointer' }}>
            <RiBellLine size={18} />
            <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--surface)' }} />
          </button>

          {/* Avatar */}
          <img
            src={CURRENT_USER.avatar}
            alt={CURRENT_USER.name}
            style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', cursor: 'pointer', flexShrink: 0 }}
          />
        </div>
      </header>

      <style>{`
        @media (max-width: 640px) {
          .topbar           { left: 0 !important; padding: 0 14px !important; }
          .topbar-menu-btn  { display: flex !important; }
          .topbar-search    { display: none !important; }
          .topbar-sub       { display: none !important; }
        }
        @media (max-width: 900px) and (min-width: 641px) {
          .topbar-search { display: none !important; }
        }
      `}</style>
    </>
  );
}
