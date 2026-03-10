import {
  RiDashboardLine, RiFileList3Line, RiSendPlaneLine,
  RiDownloadLine, RiSettings4Line,
} from 'react-icons/ri';

const NAV = [
  { key: 'dashboard',    Icon: RiDashboardLine, label: 'Home'     },
  { key: 'transactions', Icon: RiFileList3Line,  label: 'History'  },
  { key: 'send',         Icon: RiSendPlaneLine,  label: '',         isSend: true },
  { key: 'receive',      Icon: RiDownloadLine,   label: 'Receive'  },
  { key: 'settings',     Icon: RiSettings4Line,  label: 'Settings' },
];

export default function MobileNav({ activePage, onNav }) {
  return (
    <nav style={{
      display: 'none',
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      height: 64,
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 200,
      padding: '0 6px',
    }} className="mobile-nav">
      {NAV.map(({ key, Icon, label, isSend }) => {
        const active = activePage === key;
        return (
          <button
            key={key}
            onClick={() => onNav(key)}
            style={{
              display: 'flex', flexDirection: isSend ? undefined : 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: isSend ? 0 : 3,
              padding: isSend ? 0 : '6px 10px',
              borderRadius: isSend ? 14 : 11,
              width: isSend ? 52 : 'auto',
              height: isSend ? 52 : 'auto',
              minWidth: isSend ? 52 : 48,
              background: isSend
                ? 'var(--primary)'
                : active ? 'var(--primary-gl)' : 'transparent',
              color: isSend ? '#fff' : active ? 'var(--primary)' : 'var(--text-s)',
              border: 'none', cursor: 'pointer',
              transition: 'all .18s',
              transform: isSend ? 'translateY(-12px)' : undefined,
              boxShadow: isSend ? 'var(--sh-primary)' : undefined,
            }}
          >
            <Icon size={isSend ? 22 : 20} />
            {!isSend && (
              <span style={{ fontSize: 10, fontWeight: 500, fontFamily: "'Outfit', sans-serif" }}>
                {label}
              </span>
            )}
          </button>
        );
      })}

      <style>{`
        @media (max-width: 640px) {
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
