import { useState } from 'react';
import { RiEyeLine, RiEyeOffLine, RiSendPlaneLine, RiDownloadLine, RiMoreLine } from 'react-icons/ri';
import { fmtNGN, fmtUSD } from '@/utils/formatters';
import { APP_CONFIG } from '@/utils/constants';

export default function BalanceCard({ balance, onSend, onReceive }) {
  const [hidden, setHidden] = useState(false);
  const usd = balance / APP_CONFIG.NGN_PER_USD;

  const ActionBtn = ({ icon: Icon, label, onClick, primary }) => (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '9px 15px', borderRadius: 9,
        fontSize: 13, fontWeight: 600,
        background: primary ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.08)',
        border: `1px solid rgba(255,255,255,${primary ? '.22' : '.12'})`,
        color: primary ? '#fff' : 'rgba(255,255,255,.75)',
        cursor: 'pointer', transition: 'all .18s',
        backdropFilter: 'blur(6px)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = primary ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.15)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = primary ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.08)'; }}
    >
      <Icon size={14} /> {label}
    </button>
  );

  return (
    <div className="balance-card-root" style={{
      position: 'relative',
      background: 'linear-gradient(135deg, #1730C8 0%, #2944D4 50%, #4E7CF6 100%)',
      borderRadius: 'var(--r-lg)',
      padding: '28px 30px',
      overflow: 'hidden',
      minHeight: 210,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      boxShadow: '0 14px 48px rgba(78,124,246,.4)',
    }}>
      {/* Decorative world map */}
      <img
        src="/images/world.svg"
        alt=""
        aria-hidden
        style={{
          position: 'absolute', right: -20, top: -10,
          width: 280, opacity: 0.06, pointerEvents: 'none',
          filter: 'invert(1)',
        }}
      />

      {/* Decorative circles */}
      <span style={{ position:'absolute', width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,.05)', top:-90, right:-60, pointerEvents:'none' }} />
      <span style={{ position:'absolute', width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,.04)', bottom:-70, left:50, pointerEvents:'none' }} />

      {/* Chip graphic top-right */}
      <img
        src="/images/chip.png"
        alt=""
        aria-hidden
        style={{
          position: 'absolute', top: 22, right: 22,
          width: 44, opacity: 0.55,
          filter: 'brightness(1.4) saturate(0)',
          pointerEvents: 'none',
        }}
      />

      {/* Label row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 11.5, fontWeight: 500,
        color: 'rgba(255,255,255,.5)',
        textTransform: 'uppercase', letterSpacing: '0.1em',
        marginBottom: 8,
        position: 'relative', zIndex: 1,
      }}>
        Total Balance
        <button
          onClick={() => setHidden(h => !h)}
          style={{
            background: 'rgba(255,255,255,.12)', border: 'none',
            borderRadius: 6, width: 24, height: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,.65)', cursor: 'pointer', transition: 'background .2s',
          }}
          aria-label={hidden ? 'Show balance' : 'Hide balance'}
        >
          {hidden ? <RiEyeOffLine size={13} /> : <RiEyeLine size={13} />}
        </button>
      </div>

      {/* Amount */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 3, position: 'relative', zIndex: 1, flexWrap: 'nowrap', overflow: 'hidden' }}>
        <span style={{ fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,.7)', flexShrink: 0 }}>₦</span>
        <span className="balance-amount" style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(20px, 5vw, 40px)',
          fontWeight: 600, color: '#fff',
          letterSpacing: -1, lineHeight: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          minWidth: 0,
        }}>
          {hidden ? '••••••••' : fmtNGN(balance)}
        </span>
      </div>

      {/* USD equivalent */}
      <div style={{
        fontSize: 12.5, color: 'rgba(255,255,255,.4)',
        marginBottom: 24, position: 'relative', zIndex: 1,
      }}>
        {hidden ? '≈ ••••••• USD' : `≈ $${fmtUSD(usd)} USD`}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        <ActionBtn icon={RiSendPlaneLine} label="Send"    onClick={onSend}    primary />
        <ActionBtn icon={RiDownloadLine}  label="Receive" onClick={onReceive} />
        <ActionBtn icon={RiMoreLine}      label="More"    onClick={() => {}}  />
      </div>

      <style>{`
        @media (max-width: 480px) {
          .balance-card-root { padding: 20px 18px !important; min-height: 190px !important; }
        }
        @media (max-width: 360px) {
          .balance-card-root { padding: 16px 14px !important; }
        }
      `}</style>
    </div>
  );
}
