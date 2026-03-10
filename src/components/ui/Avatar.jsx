import { initials } from '@/utils/formatters';

const IMG_MAP = {
  'paystack.png':    '/images/paystack.png',
  'flutterwave.jpg': '/images/flutterwave.jpg',
  'paypal.png':      '/images/paypal.png',
};

export default function Avatar({ img, name = '?', size = 36, radius = 10, className = '' }) {
  const s = { width: size, height: size, borderRadius: radius, flexShrink: 0 };

  // Provider logos
  if (img && IMG_MAP[img]) {
    return (
      <div style={{ ...s, background: 'var(--card-h)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }} className={className}>
        <img src={IMG_MAP[img]} alt={name} style={{ height: size * 0.55, width: 'auto', objectFit: 'contain', borderRadius: 3 }} />
      </div>
    );
  }

  // User photo
  if (img && img.startsWith('/images/')) {
    return <img src={img} alt={name} style={{ ...s, objectFit: 'cover' }} className={className} />;
  }

  // Initials fallback
  const ini = initials(name);
  const colors = [
    ['#1730C8','#4E7CF6'], ['#0D6B62','#2DD4BF'], ['#6B3E0D','#F6C94E'],
    ['#6B0D3E','#F64E9A'], ['#1E0D6B','#9A7CF6'],
  ];
  const [bg, fg] = colors[ini.charCodeAt(0) % colors.length];

  return (
    <div
      style={{
        ...s,
        background: `linear-gradient(135deg, ${bg}, ${fg})`,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: 700,
        fontFamily: "'Outfit', sans-serif",
        letterSpacing: 0.5,
      }}
      className={className}
    >
      {ini}
    </div>
  );
}
