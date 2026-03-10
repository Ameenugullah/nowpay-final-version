import { useState, useCallback, useEffect } from 'react';
import Sidebar   from '@/components/layout/Sidebar';
import TopBar    from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';
import Dashboard    from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import SendMoney    from '@/pages/SendMoney';
import Receive      from '@/pages/Receive';
import Settings     from '@/pages/Settings';

const SIDEBAR_W = 244; // px — must match Sidebar component

export default function App() {
  const [page, setPage]       = useState('dashboard');
  const [sideOpen, setSideOpen] = useState(false);

  const navigate = useCallback((p) => {
    setPage(p);
    setSideOpen(false);
    window.scrollTo(0, 0);
  }, []);

  // Close sidebar on wider screens
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 641px)');
    const handler = (e) => { if (e.matches) setSideOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const pageComponents = {
    dashboard:    <Dashboard    onNav={navigate} />,
    transactions: <Transactions />,
    send:         <SendMoney />,
    receive:      <Receive />,
    settings:     <Settings />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <Sidebar
        activePage={page}
        onNav={navigate}
        mobileOpen={sideOpen}
        onClose={() => setSideOpen(false)}
      />

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          marginLeft: SIDEBAR_W,
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left .28s ease',
        }}
        className="main-content-area"
      >
        {/* Topbar */}
        <TopBar
          activePage={page}
          onMenuClick={() => setSideOpen(v => !v)}
          sidebarWidth={SIDEBAR_W}
        />

        {/* Page content */}
        <main
          style={{ flex: 1, paddingTop: 68 }}
          className="main-content-area"
        >
          {pageComponents[page]}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav activePage={page} onNav={navigate} />

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 640px) {
          .main-content-area {
            margin-left: 0 !important;
            padding-bottom: 64px;
          }
        }
        @media (max-width: 900px) and (min-width: 641px) {
          .main-content-area {
            margin-left: ${SIDEBAR_W}px;
          }
        }
      `}</style>
    </div>
  );
}
