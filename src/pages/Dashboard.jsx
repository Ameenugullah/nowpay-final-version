import { useWallet } from '@/context/WalletContext';
import BalanceCard from '@/components/wallet/BalanceCard';
import VirtualCard from '@/components/wallet/VirtualCard';
import AnalyticsChart from '@/components/charts/AnalyticsChart';
import Avatar from '@/components/ui/Avatar';
import StatusBadge from '@/components/ui/StatusBadge';
import { fmtCompact } from '@/utils/formatters';

const PROVIDER_CHIPS = [
  { label: 'Paystack',    img: '/images/paystack.png',    active: true  },
  { label: 'Flutterwave', img: '/images/flutterwave.jpg', active: true  },
  { label: 'PayPal',      img: '/images/paypal.png',      active: false },
];

export default function Dashboard({ onNav }) {
  const { transactions, recipients, balance } = useWallet();
  const recent = transactions.slice(0, 5);
  const incomeTotal = transactions.filter(t => t.type === 'credit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const expTotal    = transactions.filter(t => t.type === 'debit'  && t.status === 'completed').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="page-enter" style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* TOP GRID: Balance + Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 270px', gap: 18 }} className="dash-top-grid">
        <BalanceCard
          balance={balance}
          onSend={() => onNav('send')}
          onReceive={() => onNav('receive')}
        />

        {/* Stat cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Money In',  val: incomeTotal, pct: '+12.4%', color: 'var(--green)', fill: 72, good: true  },
            { label: 'Money Out', val: expTotal,     pct: '-3.1%',  color: 'var(--red)',   fill: 38, good: false },
          ].map((s) => (
            <div key={s.label} className="card" style={{ flex: 1, padding: '18px 20px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
                <span style={{ fontSize: 12, color: 'var(--text-s)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {s.label}
                </span>
                <StatusBadge status={s.good ? 'credit' : 'debit'} label={s.pct} />
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 600, color: s.color, marginBottom: 3 }}>
                ₦ {fmtCompact(s.val)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-m)', marginBottom: 11 }}>This month</div>
              <div style={{ height: 4, borderRadius: 99, background: 'var(--border)' }}>
                <div style={{ height: '100%', borderRadius: 99, background: s.color, width: `${s.fill}%`, transition: 'width .5s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIRTUAL CARDS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }}>
          <span className="section-title">My Cards</span>
          <button className="link-btn">Manage →</button>
        </div>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          <VirtualCard variant="blue" last4="4821" type="mastercard" index={0} />
          <VirtualCard variant="teal" last4="9034" type="visa"       index={1} />
          {/* Add card button */}
          <div
            onClick={() => onNav('send')}
            style={{
              minWidth: 150, borderRadius: 'var(--r-lg)',
              border: '2px dashed var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 10, padding: '20px',
              cursor: 'pointer', background: 'var(--card)',
              transition: 'all .2s', flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-gl)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card)'; }}
          >
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--card-h)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'var(--primary)' }}>+</div>
            <span style={{ fontSize: 13, color: 'var(--text-s)', fontWeight: 500 }}>Add Card</span>
          </div>
        </div>
      </div>

      {/* BOTTOM GRID: Quick Transfer + Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="dash-bottom-grid">

        {/* Quick Transfer */}
        <div className="card-static" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span className="section-title">Quick Transfer</span>
            <button className="link-btn" onClick={() => onNav('send')}>New →</button>
          </div>

          {/* Recipient avatars */}
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none', marginBottom: 18 }}>
            {recipients.slice(0, 5).map((r) => (
              <div key={r.id} onClick={() => onNav('send')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer', flexShrink: 0 }}>
                <div style={{ position: 'relative' }}>
                  <Avatar img={r.img} name={r.name} size={48} radius={50} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-s)', fontWeight: 500 }}>
                  {r.name.split(' ')[0]}
                </span>
              </div>
            ))}
            <div onClick={() => onNav('send')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--card-h)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'var(--primary)' }}>+</div>
              <span style={{ fontSize: 11, color: 'var(--text-s)', fontWeight: 500 }}>New</span>
            </div>
          </div>

          {/* Mini tx list */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span className="section-title" style={{ fontSize: 13 }}>Recent</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {recent.map((tx) => (
              <div key={tx.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 8px', borderRadius: 9,
                transition: 'background .12s', cursor: 'pointer',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--card-h)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Avatar img={tx.img} name={tx.name} size={34} radius={8} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-s)', marginTop: 1 }}>{tx.cat} · {tx.date}</div>
                </div>
                <span style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 13, fontWeight: 600,
                  color: tx.type === 'credit' ? 'var(--green)' : 'var(--text)',
                  flexShrink: 0,
                }}>
                  {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics */}
        <div className="card-static" style={{ padding: 20 }}>
          <div style={{ marginBottom: 4 }}>
            <span className="section-title">Analytics</span>
          </div>
          <AnalyticsChart />

          {/* Gateways */}
          <div style={{ marginTop: 18 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-s)', marginBottom: 9, display: 'block' }}>Connected Gateways</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PROVIDER_CHIPS.map((p) => (
                <div key={p.label} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '6px 11px', borderRadius: 9,
                  background: 'var(--card-h)',
                  border: `1px solid ${p.active ? 'var(--primary)' : 'var(--border)'}`,
                  fontSize: 12, fontWeight: 500,
                  color: p.active ? 'var(--primary)' : 'var(--text-s)',
                  cursor: 'pointer',
                }}>
                  <img src={p.img} alt={p.label} style={{ height: 15, width: 'auto', objectFit: 'contain', borderRadius: 3 }} />
                  {p.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .dash-top-grid  { grid-template-columns: 1fr !important; }
          .dash-bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
