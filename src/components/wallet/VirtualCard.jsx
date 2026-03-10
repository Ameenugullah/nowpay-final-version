export default function VirtualCard({ variant = 'blue', last4, type = 'mastercard', index = 0 }) {
  const VARIANTS = {
    blue: {
      bg: 'linear-gradient(135deg, #1E3AC4 0%, #2B4FE0 50%, #5B7FF6 100%)',
      shadow: '0 12px 36px rgba(30,58,196,.42)',
    },
    teal: {
      bg: 'linear-gradient(135deg, #0D6B62 0%, #0F8577 50%, #2DD4BF 100%)',
      shadow: '0 12px 36px rgba(13,107,98,.42)',
    },
  };

  const v = VARIANTS[variant] || VARIANTS.blue;

  return (
    <div
      style={{
        borderRadius: 'var(--r-lg)',
        padding: '20px 22px',
        minWidth: 290,
        aspectRatio: '1.586',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        background: v.bg,
        boxShadow: v.shadow,
        transition: 'transform .22s ease, box-shadow .22s ease',
        animationDelay: `${index * 60}ms`,
        animation: 'fadeUp .35s ease both',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = v.shadow.replace('36px', '44px');
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = v.shadow;
      }}
    >
      {/* Deco circles */}
      <span style={{ position:'absolute', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.06)', top:-80, right:-50 }} />
      <span style={{ position:'absolute', width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,.04)', bottom:-50, left:10 }} />

      {/* Top row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative', zIndex:1 }}>
        <span style={{ color:'rgba(255,255,255,.85)', fontSize:14, fontWeight:700 }}>NowPay</span>
        <img src="/images/chip.png" alt="chip" style={{ width:34, opacity:.8, filter:'brightness(1.2) saturate(0.4)' }} />
      </div>

      {/* Card number */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 15,
        color: 'rgba(255,255,255,.8)',
        letterSpacing: 3,
        position: 'relative', zIndex: 1,
      }}>
        •••• •••• •••• {last4}
      </div>

      {/* Bottom row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', position:'relative', zIndex:1 }}>
        <div>
          <div style={{ fontSize:9, color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:2 }}>Card Holder</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.9)', fontWeight:600 }}>Abdul-malik Aminu</div>
        </div>
        <div>
          <div style={{ fontSize:9, color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:2 }}>Expires</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.9)', fontWeight:600 }}>09/27</div>
        </div>
        {type === 'mastercard' && (
          <img src="/images/mastercard.png" alt="Mastercard" style={{ height:26, opacity:.9 }} />
        )}
        {type === 'visa' && (
          <img src="/images/visa.png" alt="Visa" style={{ height:18, opacity:.9, filter:'brightness(10)' }} />
        )}
      </div>
    </div>
  );
}
