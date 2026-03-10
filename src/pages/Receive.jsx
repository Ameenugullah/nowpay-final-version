import { useRef, useState } from 'react';
import { RiShareLine, RiDownload2Line, RiFileCopyLine } from 'react-icons/ri';
import { useQR } from '@/hooks/useQR';
import { useToast } from '@/context/ToastContext';
import { copyToClipboard } from '@/utils/formatters';
import { CURRENT_USER, APP_CONFIG } from '@/utils/constants';

export default function Receive() {
  const canvasRef = useRef(null);
  const toast = useToast();
  useQR(canvasRef);

  const [ngnVal, setNgnVal] = useState('1000');
  const [usdVal, setUsdVal] = useState((1000 / APP_CONFIG.NGN_PER_USD).toFixed(2));

  const handleNgn = (v) => { setNgnVal(v); setUsdVal(((parseFloat(v) || 0) / APP_CONFIG.NGN_PER_USD).toFixed(2)); };
  const handleUsd = (v) => { setUsdVal(v); setNgnVal(((parseFloat(v) || 0) * APP_CONFIG.NGN_PER_USD).toFixed(2)); };

  const copy = async (text, label) => {
    await copyToClipboard(text);
    toast(`✓ ${label} copied`, 'success');
  };

  const shareDetails = async () => {
    const text = `${CURRENT_USER.name} | ${CURRENT_USER.bank} | ${CURRENT_USER.accountNo} | ${CURRENT_USER.nowpayId}`;
    if (navigator.share) {
      navigator.share({ title: 'NowPay Account Details', text }).catch(() => copy(text, 'Account details'));
    } else {
      await copy(text, 'Account details');
    }
  };

  const downloadQR = () => {
    const c = canvasRef.current;
    if (!c) return;
    const a = document.createElement('a');
    a.download = 'nowpay-qr.png';
    a.href = c.toDataURL();
    a.click();
    toast('✓ QR code downloaded', 'success');
  };

  const inputStyle = {
    flex: 1, border: 'none', background: 'transparent',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 17, fontWeight: 600, color: 'var(--text)', outline: 'none',
    padding: '11px 14px',
  };

  return (
    <div className="page-enter" style={{ padding: 26 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 22 }} className="receive-layout">

        {/* Left: QR + Details */}
        <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 30 }}>
          <h2 style={{ fontSize: 21, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Receive Money</h2>
          <p style={{ fontSize: 13, color: 'var(--text-s)', marginBottom: 26 }}>Share your account details to receive funds instantly</p>

          {/* QR Code */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
            <div style={{
              width: 200, height: 200, borderRadius: 18,
              padding: 10, background: '#fff',
              boxShadow: 'var(--sh-lg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12,
            }}>
              <canvas ref={canvasRef} width={180} height={180} style={{ width: 180, height: 180 }} />
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-s)', fontWeight: 500 }}>
              Scan to send to{' '}
              <span style={{ color: 'var(--primary)', fontFamily: "'JetBrains Mono',monospace" }}>
                {CURRENT_USER.nowpayId}
              </span>
            </div>
          </div>

          {/* Account details grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Account Name',   value: CURRENT_USER.name,      copy: false },
              { label: 'Account Number', value: CURRENT_USER.accountNo, copy: true  },
              { label: 'Bank',           value: CURRENT_USER.bank,      copy: false },
              { label: 'NowPay ID',      value: CURRENT_USER.nowpayId,  copy: true  },
            ].map((d) => (
              <div key={d.label} style={{
                background: 'var(--surface)', border: '1.5px solid var(--border)',
                borderRadius: 'var(--r-sm)', padding: '13px 14px',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-s)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>
                  {d.label}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1, wordBreak: 'break-all' }}>
                    {d.value}
                  </span>
                  {d.copy && (
                    <button
                      onClick={() => copy(d.value, d.label)}
                      style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: 'var(--card-h)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-s)', cursor: 'pointer', transition: 'all .18s',
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-s)'; }}
                    >
                      <RiFileCopyLine size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={shareDetails} style={{
              width: '100%', padding: '13px',
              background: 'var(--primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--r-sm)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: 'var(--sh-primary)', transition: 'all .2s',
              fontFamily: "'Outfit', sans-serif",
            }}>
              <RiShareLine size={17} /> Share Account Details
            </button>
            <button onClick={downloadQR} style={{
              width: '100%', padding: '12px',
              background: 'transparent', color: 'var(--primary)',
              border: '2px solid var(--primary)', borderRadius: 'var(--r-sm)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all .2s', fontFamily: "'Outfit', sans-serif",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-gl)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <RiDownload2Line size={17} /> Download QR Code
            </button>
          </div>
        </div>

        {/* Right: Currency Converter */}
        <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 18 }}>Currency Converter</h3>

          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 13px', borderRight: '1px solid var(--border)', fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>
              <img src="/images/ng-flag.svg" alt="NGN" style={{ height: 16, borderRadius: 2 }} />
              NGN
            </div>
            <input type="number" value={ngnVal} onChange={e => handleNgn(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ textAlign: 'center', fontSize: 20, color: 'var(--primary)', margin: '4px 0', cursor: 'pointer' }}
            onClick={() => { const tmp = ngnVal; setNgnVal(usdVal); setUsdVal(tmp); }}
          >
            ⇅
          </div>

          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 13px', borderRight: '1px solid var(--border)', fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>
              <img src="/images/us-flag.png" alt="USD" style={{ height: 16, borderRadius: 2 }} />
              USD
            </div>
            <input type="number" value={usdVal} onChange={e => handleUsd(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-s)', textAlign: 'center', marginBottom: 20 }}>
            1 USD = ₦{APP_CONFIG.NGN_PER_USD.toLocaleString()} · Live Rate
          </div>

          <div>
            <p style={{ fontSize: 11, color: 'var(--text-m)', marginBottom: 9 }}>Powered by</p>
            <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
              <img src="/images/paystack.png" alt="Paystack"    style={{ height: 22, width: 'auto', objectFit: 'contain', borderRadius: 3 }} />
              <img src="/images/flutterwave.jpg" alt="Flutterwave" style={{ height: 22, width: 'auto', objectFit: 'contain', borderRadius: 3 }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .receive-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
