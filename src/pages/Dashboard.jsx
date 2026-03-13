import { useWallet } from '@/context/WalletContext';
import BalanceCard  from '@/components/wallet/BalanceCard';
import VirtualCard  from '@/components/wallet/VirtualCard';
import AnalyticsChart from '@/components/charts/AnalyticsChart';
import Avatar       from '@/components/ui/Avatar';
import StatusBadge  from '@/components/ui/StatusBadge';
import { fmtCompact } from '@/utils/formatters';

export default function Dashboard({ onNav }) {
  const { transactions, recipients, balance } = useWallet();
  const recent      = transactions.slice(0, 5);
  const incomeTotal = transactions.filter(t => t.type === 'credit' && t.status === 'completed').reduce((s,t) => s+t.amount, 0);
  const expTotal    = transactions.filter(t => t.type === 'debit'  && t.status === 'completed').reduce((s,t) => s+t.amount, 0);

  return (
    <div className="page-enter dash-page">
      {/* TOP GRID */}
      <div className="dash-top-grid">
        <BalanceCard balance={balance} onSend={() => onNav('send')} onReceive={() => onNav('receive')} />

        <div className="dash-stat-col">
          {[
            { label:'Money In',  val:incomeTotal, pct:'+12.4%', color:'var(--green)', fill:72, good:true  },
            { label:'Money Out', val:expTotal,    pct:'-3.1%',  color:'var(--red)',   fill:38, good:false },
          ].map(s => (
            <div key={s.label} className="card dash-stat-card" style={{ flex:1, padding:'18px 20px', cursor:'pointer' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:9 }}>
                <span style={{ fontSize:12, color:'var(--text-s)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.07em' }}>{s.label}</span>
                <StatusBadge status={s.good ? 'credit' : 'debit'} label={s.pct} />
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, fontWeight:600, color:s.color, marginBottom:3 }}>
                ₦ {fmtCompact(s.val)}
              </div>
              <div style={{ fontSize:12, color:'var(--text-m)', marginBottom:11 }}>This month</div>
              <div style={{ height:4, borderRadius:99, background:'var(--border)' }}>
                <div style={{ height:'100%', borderRadius:99, background:s.color, width:`${s.fill}%`, transition:'width .5s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIRTUAL CARDS */}
      <div className="dash-section">
        <div className="section-header">
          <span className="section-title">My Cards</span>
          <button className="link-btn">Manage →</button>
        </div>
        <div style={{ display:'flex', gap:14, overflowX:'auto', paddingBottom:4, scrollbarWidth:'none' }}>
          <VirtualCard variant="blue" last4="4821" type="mastercard" index={0} />
          <VirtualCard variant="teal" last4="9034" type="visa"       index={1} />
          <div onClick={() => onNav('send')} className="add-card-tile">
            <div style={{ width:42, height:42, borderRadius:'50%', background:'var(--card-h)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color:'var(--primary)' }}>+</div>
            <span style={{ fontSize:13, color:'var(--text-s)', fontWeight:500 }}>Add Card</span>
          </div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="dash-bottom-grid">
        {/* Quick Transfer */}
        <div className="card-static dash-panel" style={{ padding:20 }}>
          <div className="section-header">
            <span className="section-title">Quick Transfer</span>
            <button className="link-btn" onClick={() => onNav('send')}>New →</button>
          </div>

          {/* Recipient avatars */}
          <div style={{ display:'flex', gap:14, overflowX:'auto', paddingBottom:6, scrollbarWidth:'none', marginBottom:18 }}>
            {recipients.slice(0,5).map(r => (
              <div key={r.id} onClick={() => onNav('send')} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, cursor:'pointer', flexShrink:0 }}>
                <Avatar name={r.name} size={48} radius={50} />
                <span style={{ fontSize:11, color:'var(--text-s)', fontWeight:500, whiteSpace:'nowrap' }}>
                  {r.name.split(' ')[0]}
                </span>
              </div>
            ))}
            <div onClick={() => onNav('send')} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, cursor:'pointer', flexShrink:0 }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:'var(--card-h)', border:'2px dashed var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, color:'var(--primary)' }}>+</div>
              <span style={{ fontSize:11, color:'var(--text-s)', fontWeight:500 }}>New</span>
            </div>
          </div>

          {/* Recent mini list */}
          <div className="section-header" style={{ marginBottom:8 }}>
            <span className="section-title" style={{ fontSize:13 }}>Recent</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
            {recent.map(tx => (
              <div key={tx.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 8px', borderRadius:9, transition:'background .12s', cursor:'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background='var(--card-h)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}
              >
                <Avatar name={tx.name} size={34} radius={8} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{tx.name}</div>
                  <div style={{ fontSize:11, color:'var(--text-s)', marginTop:1 }}>{tx.cat} · {tx.date}</div>
                </div>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:600, color:tx.type==='credit'?'var(--green)':'var(--text)', flexShrink:0 }}>
                  {tx.type==='credit'?'+':'-'}₦{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics */}
        <div className="card-static dash-panel" style={{ padding:20 }}>
          <div className="section-header">
            <span className="section-title">Analytics</span>
          </div>
          <AnalyticsChart />

          {/* Paystack gateway chip only */}
          <div style={{ marginTop:18 }}>
            <span style={{ fontSize:13, fontWeight:600, color:'var(--text-s)', marginBottom:9, display:'block' }}>Payment Gateway</span>
            <div style={{ display:'flex', gap:8 }}>
              <div style={{
                display:'flex', alignItems:'center', gap:7,
                padding:'6px 13px', borderRadius:9,
                background:'var(--card-h)',
                border:'1px solid var(--primary)',
                fontSize:12, fontWeight:600, color:'var(--primary)',
              }}>
                <img src="/images/paystack.png" alt="Paystack" style={{ height:16, width:'auto', objectFit:'contain', borderRadius:3 }} />
                Paystack · Active
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dash-page { padding: 26px; display: flex; flex-direction: column; gap: 22px; overflow-x: hidden; }
        .dash-section { display: flex; flex-direction: column; gap: 0; }
        .dash-top-grid {
          display: grid;
          grid-template-columns: 1fr 270px;
          gap: 18px;
          align-items: start;
        }
        .dash-stat-col { display: flex; flex-direction: column; gap: 14px; }
        .dash-stat-card {}
        .dash-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .dash-panel {}
        .add-card-tile {
          min-width: 130px;
          border-radius: var(--r-lg);
          border: 2px dashed var(--border);
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 10px; padding: 20px;
          cursor: pointer; background: var(--card);
          transition: all .2s; flex-shrink: 0;
        }
        .add-card-tile:hover { border-color: var(--primary); background: var(--primary-gl); }

        @media (max-width: 1100px) {
          .dash-top-grid    { grid-template-columns: 1fr !important; }
          .dash-stat-col    { flex-direction: row; }
          .dash-stat-card   { flex: 1; min-width: 0; }
          .dash-bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .dash-page { padding: 18px; gap: 16px; }
        }
        @media (max-width: 600px) {
          .dash-page        { padding: 14px; gap: 14px; }
          .dash-stat-col    { flex-direction: column; }
        }
        @media (max-width: 380px) {
          .dash-page { padding: 10px; gap: 12px; }
        }
      `}</style>
    </div>
  );
}
