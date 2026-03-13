import { useState, useCallback, useEffect } from 'react';
import Sidebar   from '@/components/layout/Sidebar';
import TopBar    from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';
import Dashboard    from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import SendMoney    from '@/pages/SendMoney';
import Receive      from '@/pages/Receive';
import Settings     from '@/pages/Settings';

const SIDEBAR_W = 244;

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 640);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const h = (e) => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

export default function App() {
  const [page, setPage]         = useState('dashboard');
  const [sideOpen, setSideOpen] = useState(false);
  const isMobile = useIsMobile();

  const navigate = useCallback((p) => {
    setPage(p);
    setSideOpen(false);
    window.scrollTo(0, 0);
  }, []);

  // Close sidebar when resizing to desktop
  useEffect(() => {
    if (!isMobile) setSideOpen(false);
  }, [isMobile]);

  const pages = {
    dashboard:    <Dashboard    onNav={navigate} />,
    transactions: <Transactions />,
    send:         <SendMoney />,
    receive:      <Receive />,
    settings:     <Settings />,
  };

  const mainLeft = isMobile ? 0 : SIDEBAR_W;

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)' }}>
      <Sidebar
        activePage={page}
        onNav={navigate}
        mobileOpen={sideOpen}
        onClose={() => setSideOpen(false)}
      />

      <div style={{
        flex: 1,
        marginLeft: mainLeft,
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left .28s ease',
        minWidth: 0,
        overflow: 'hidden',
      }}>
        <TopBar
          activePage={page}
          onMenuClick={() => setSideOpen((v) => !v)}
          sidebarWidth={mainLeft}
        />
        <main style={{
          flex: 1,
          paddingTop: 64,
          paddingBottom: isMobile ? 70 : 0,
          overflowX: 'hidden',
          minWidth: 0,
          /* iOS safe area for bottom nav */
          paddingBottom: isMobile ? 'calc(70px + env(safe-area-inset-bottom, 0px))' : 0,
        }}>
          {pages[page]}
        </main>
      </div>

      <MobileNav activePage={page} onNav={navigate} />
    </div>
  );
}
