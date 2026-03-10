import { useState, useCallback } from 'react';
import {
  RiUserLine, RiAddLine, RiCloseLine, RiCheckLine,
  RiArrowRightLine, RiLoaderLine,
} from 'react-icons/ri';
import { useWallet } from '@/context/WalletContext';
import { useTransaction } from '@/hooks/useTransaction';
import Modal from '@/components/ui/Modal';
import Avatar from '@/components/ui/Avatar';
import { fmtNGN, fmtUSD, genRef } from '@/utils/formatters';
import { NIGERIAN_BANKS, GATEWAYS, APP_CONFIG } from '@/utils/constants';
import { calcFee } from '@/services/api';

export default function SendMoney() {
  const { recipients } = useWallet();
  const { sendMoney, isProcessing } = useTransaction();

  // Form state
  const [recipient, setRecipient] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [amount, setAmount]       = useState('');
  const [isNGN, setIsNGN]         = useState(true);
  const [method, setMethod]       = useState('paystack');
  const [note, setNote]           = useState('');

  // New recipient form
  const [nrName,  setNrName]  = useState('');
  const [nrAcct,  setNrAcct]  = useState('');
  const [nrBank,  setNrBank]  = useState('');
  const [nrPhone, setNrPhone] = useState('');
  const [isNewRecipient, setIsNewRecipient] = useState(false);

  // Modal state
  const [modal, setModal] = useState(null); // null | 'confirm' | 'success'
  const [txRef, setTxRef] = useState('');
  const [localError, setLocalError] = useState('');

  // Derived amounts
  const rawAmt  = parseFloat(amount) || 0;
  const ngnAmt  = isNGN ? rawAmt : rawAmt * APP_CONFIG.NGN_PER_USD;
  const { fee, total } = calcFee(ngnAmt);
  const convHint = rawAmt > 0
    ? isNGN ? `≈ $${fmtUSD(ngnAmt / APP_CONFIG.NGN_PER_USD)} USD` : `≈ ₦${fmtNGN(ngnAmt)} NGN`
    : `Rate: 1 USD = ₦${APP_CONFIG.NGN_PER_USD.toLocaleString()}`;

  const canSubmit = recipient && ngnAmt > 0;

  // Save new recipient
  const handleSaveNewRecipient = useCallback(() => {
    if (!nrName.trim())   { setLocalError('Full name is required'); return; }
    if (nrAcct.replace(/\D/g,'').length < 10) { setLocalError('Account number must be 10 digits'); return; }
    if (!nrBank)          { setLocalError('Please select a bank'); return; }
    setLocalError('');

    const nr = {
      id:    'r_' + Date.now(),
      name:  nrName.trim(),
      acct:  nrAcct.trim(),
      bank:  nrBank,
      phone: nrPhone.trim(),
      img:   '',
    };
    setRecipient(nr);
    setIsNewRecipient(true);
    setShowNewForm(false);
    setNrName(''); setNrAcct(''); setNrBank(''); setNrPhone('');
  }, [nrName, nrAcct, nrBank, nrPhone]);

  // Initiate confirm
  const handleSubmit = () => {
    if (!recipient) { setLocalError('Please select or add a recipient'); return; }
    if (ngnAmt <= 0) { setLocalError('Please enter a valid amount'); return; }
    setLocalError('');
    setTxRef(genRef());
    setModal('confirm');
  };

  // Execute transaction
  const handleConfirm = async () => {
    setModal(null);
    const ok = await sendMoney({ recipient, amount: ngnAmt, method, note, isNewRecipient });
    if (ok) {
      setModal('success');
      setAmount(''); setNote(''); setRecipient(null); setIsNewRecipient(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--r-sm)',
    fontSize: 14, color: 'var(--text)',
    transition: 'all .2s',
    fontFamily: "'Outfit', sans-serif",
  };

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 600,
    color: 'var(--text-s)', textTransform: 'uppercase',
    letterSpacing: '0.07em', marginBottom: 7,
  };

  return (
    <div className="page-enter" style={{ padding: 26 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 22, alignItems: 'start' }} className="send-layout">

        {/* ── Left: Form ── */}
        <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 28 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 21, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Send Money</h2>
            <p style={{ fontSize: 13, color: 'var(--text-s)' }}>Transfer funds instantly to anyone in Nigeria</p>
          </div>

          {/* Error banner */}
          {localError && (
            <div style={{
              padding: '11px 14px', borderRadius: 9, marginBottom: 16,
              background: 'rgba(248,113,113,.1)', border: '1.5px solid rgba(248,113,113,.3)',
              color: 'var(--red)', fontSize: 13,
            }}>
              ⚠ {localError}
            </div>
          )}

          {/* RECIPIENT */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Recipient</label>
            <div
              onClick={() => !recipient && setShowNewForm(false)}
              style={{
                padding: '13px 15px',
                background: 'var(--surface)',
                border: `1.5px solid ${recipient ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--r-sm)',
                cursor: recipient ? 'default' : 'pointer',
                transition: 'border-color .2s',
              }}
            >
              {recipient ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar img={recipient.img} name={recipient.name} size={34} radius={8} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{recipient.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-s)' }}>{recipient.bank} · {recipient.acct}</div>
                  </div>
                  <button
                    onClick={() => { setRecipient(null); setIsNewRecipient(false); }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'var(--text-m)', fontSize: 14 }}>
                  <RiUserLine size={17} />
                  Select a recipient below or add a new one
                </div>
              )}
            </div>
          </div>

          {/* ADD NEW RECIPIENT FORM */}
          {!recipient && (
            <div style={{ marginBottom: 18 }}>
              <button
                onClick={() => setShowNewForm(v => !v)}
                style={{
                  width: '100%', padding: '10px', borderRadius: 'var(--r-sm)',
                  background: 'transparent', border: '1.5px dashed var(--border)',
                  color: showNewForm ? 'var(--red)' : 'var(--text-s)',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  transition: 'all .2s', fontFamily: "'Outfit', sans-serif",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = showNewForm ? 'var(--red)' : 'var(--primary)'; e.currentTarget.style.color = showNewForm ? 'var(--red)' : 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = showNewForm ? 'var(--red)' : 'var(--text-s)'; }}
              >
                {showNewForm ? <><RiCloseLine size={16} /> Cancel</> : <><RiAddLine size={16} /> Add New Recipient</>}
              </button>

              {showNewForm && (
                <div style={{
                  marginTop: 10,
                  background: 'var(--surface)', border: '1.5px solid var(--primary)',
                  borderRadius: 'var(--r-sm)', padding: 16,
                  animation: 'fadeUp .22s ease both',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
                    NEW RECIPIENT DETAILS
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={labelStyle}>Full Name <span style={{ color: 'var(--red)' }}>*</span></label>
                      <input className="input-field" placeholder="e.g. Yusuf Sale" value={nrName} onChange={e => setNrName(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Account Number <span style={{ color: 'var(--red)' }}>*</span></label>
                      <input
                        className="input-field"
                        placeholder="10-digit number"
                        value={nrAcct}
                        onChange={e => setNrAcct(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        maxLength={10}
                        style={{ ...inputStyle, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={labelStyle}>Bank <span style={{ color: 'var(--red)' }}>*</span></label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={nrBank}
                          onChange={e => setNrBank(e.target.value)}
                          style={{ ...inputStyle, appearance: 'none', paddingRight: 36, cursor: 'pointer' }}
                        >
                          <option value="">Select bank…</option>
                          {NIGERIAN_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-s)' }}>▾</span>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Phone (optional)</label>
                      <input className="input-field" placeholder="+234 080…" value={nrPhone} onChange={e => setNrPhone(e.target.value)} style={inputStyle} />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveNewRecipient}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '10px 18px', borderRadius: 'var(--r-sm)',
                      background: 'var(--primary)', color: '#fff',
                      border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      boxShadow: 'var(--sh-primary)', transition: 'all .2s',
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    <RiCheckLine size={15} /> Save &amp; Select Recipient
                  </button>
                </div>
              )}
            </div>
          )}

          {/* AMOUNT */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Amount</label>
            <div style={{
              display: 'flex', overflow: 'hidden',
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: 'var(--r-sm)', transition: 'all .2s',
            }}
              onFocusCapture={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-gl)'; }}
              onBlurCapture={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div
                onClick={() => setIsNGN(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0 12px', background: 'var(--card-h)',
                  borderRight: '1px solid var(--border)',
                  fontSize: 13, fontWeight: 600, color: 'var(--text)',
                  cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none',
                }}
              >
                <img src={isNGN ? '/images/ng-flag.svg' : '/images/us-flag.png'} alt="" style={{ height: 15, borderRadius: 2 }} />
                {isNGN ? 'NGN' : 'USD'}
                <span style={{ fontSize: 11, color: 'var(--text-s)' }}>▾</span>
              </div>
              <input
                type="number" min="0" placeholder="0.00"
                value={amount} onChange={e => setAmount(e.target.value)}
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  padding: '13px 14px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 17, fontWeight: 600, color: 'var(--text)',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-s)', marginTop: 5 }}>{convHint}</div>
            {ngnAmt > 0 && (
              <div style={{ fontSize: 12, color: 'var(--text-m)', marginTop: 3 }}>
                Balance after: ₦{fmtNGN(Math.max(0, 4820500 - total))}
              </div>
            )}
          </div>

          {/* TRANSFER METHOD */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Transfer via</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 9 }}>
              {GATEWAYS.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setMethod(g.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                    padding: '13px 10px', borderRadius: 'var(--r-sm)',
                    background: 'var(--surface)',
                    border: `2px solid ${method === g.id ? 'var(--primary)' : 'var(--border)'}`,
                    background: method === g.id ? 'var(--primary-gl)' : 'var(--surface)',
                    cursor: 'pointer', transition: 'all .18s',
                  }}
                >
                  <img src={g.img} alt={g.label} style={{ height: 26, width: 'auto', objectFit: 'contain', borderRadius: 3 }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: method === g.id ? 'var(--primary)' : 'var(--text-s)' }}>
                    {g.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* NOTE */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Note (optional)</label>
            <input
              placeholder="What's this transfer for?"
              value={note} onChange={e => setNote(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* FEE BREAKDOWN */}
          <div style={{
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 'var(--r-sm)', padding: '14px 16px', marginBottom: 22,
          }}>
            {[
              { label: 'Transfer Amount', val: `₦ ${fmtNGN(ngnAmt)}` },
              { label: 'Fee (1.5%)',      val: `₦ ${fmtNGN(fee)}` },
            ].map((r) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-s)', marginBottom: 9 }}>
                <span>{r.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 500, color: 'var(--text)' }}>{r.val}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 9, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Total Debit</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                ₦ {fmtNGN(total)}
              </span>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isProcessing}
            style={{
              width: '100%', padding: '14px',
              background: canSubmit && !isProcessing ? 'var(--primary)' : 'var(--border)',
              color: canSubmit && !isProcessing ? '#fff' : 'var(--text-s)',
              border: 'none', borderRadius: 'var(--r-sm)',
              fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: canSubmit && !isProcessing ? 'pointer' : 'not-allowed',
              boxShadow: canSubmit ? 'var(--sh-primary)' : 'none',
              transition: 'all .2s',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {isProcessing ? (
              <><RiLoaderLine size={17} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</>
            ) : (
              <> Continue to Confirm <RiArrowRightLine size={17} /></>
            )}
          </button>
        </div>

        {/* ── Right: Recipients panel ── */}
        <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Recent Recipients</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 480, overflowY: 'auto' }}>
            {recipients.map((r) => (
              <div
                key={r.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 13px', borderRadius: 'var(--r-sm)',
                  background: recipient?.id === r.id ? 'var(--primary-gl)' : 'var(--surface)',
                  border: `1.5px solid ${recipient?.id === r.id ? 'var(--primary)' : 'var(--border)'}`,
                  cursor: 'pointer', transition: 'all .18s',
                }}
                onClick={() => { setRecipient(r); setIsNewRecipient(false); setShowNewForm(false); }}
              >
                <Avatar img={r.img} name={r.name} size={38} radius={9} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-s)', marginTop: 1 }}>{r.bank} · {r.acct}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setRecipient(r); setIsNewRecipient(false); setShowNewForm(false); }}
                  style={{
                    padding: '5px 11px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                    background: recipient?.id === r.id ? 'var(--primary)' : 'var(--primary-gl)',
                    border: '1px solid var(--primary)',
                    color: recipient?.id === r.id ? '#fff' : 'var(--primary)',
                    cursor: 'pointer', transition: 'all .18s', flexShrink: 0,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {recipient?.id === r.id ? '✓' : 'Select'}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setShowNewForm(true); setRecipient(null); }}
            style={{
              width: '100%', marginTop: 12, padding: '10px',
              borderRadius: 'var(--r-sm)',
              background: 'transparent', border: '1.5px dashed var(--border)',
              color: 'var(--text-s)', fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              cursor: 'pointer', transition: 'all .2s',
              fontFamily: "'Outfit', sans-serif",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-s)'; }}
          >
            <RiAddLine size={16} /> Add New Recipient
          </button>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {modal === 'confirm' && (
        <Modal onClose={() => setModal(null)}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'rgba(246,201,78,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 26 }}>📤</div>
            <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Confirm Transfer</div>
            <div style={{ fontSize: 13.5, color: 'var(--text-s)', lineHeight: 1.55 }}>
              Send <strong style={{ color: 'var(--text)' }}>₦{fmtNGN(ngnAmt)}</strong> to <strong style={{ color: 'var(--text)' }}>{recipient?.name}</strong> via {GATEWAYS.find(g => g.id === method)?.label}?
            </div>
          </div>

          {[
            ['Recipient',  recipient?.name],
            ['Bank',       recipient?.bank],
            ['Account No', recipient?.acct],
            ['Amount',     '₦ ' + fmtNGN(ngnAmt)],
            ['Fee (1.5%)', '₦ ' + fmtNGN(fee)],
            ['Total',      '₦ ' + fmtNGN(total)],
            ['Reference',  txRef],
          ].map(([k, v]) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 13px', background: 'var(--surface)', borderRadius: 9, marginBottom: 6, fontSize: 13,
            }}>
              <span style={{ color: 'var(--text-s)' }}>{k}</span>
              <span style={{ fontFamily: ['Amount','Fee (1.5%)','Total','Reference'].includes(k) ? "'JetBrains Mono',monospace" : undefined, fontWeight: 600, color: 'var(--text)' }}>{v}</span>
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 20 }}>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              style={{
                width: '100%', padding: '13px',
                background: 'var(--primary)', color: '#fff',
                border: 'none', borderRadius: 'var(--r-sm)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: 'var(--sh-primary)', transition: 'all .2s',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <RiCheckLine size={17} /> Confirm &amp; Send
            </button>
            <button
              onClick={() => setModal(null)}
              style={{
                width: '100%', padding: '12px',
                background: 'transparent', border: '1.5px solid var(--border)',
                borderRadius: 'var(--r-sm)', color: 'var(--text-s)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                transition: 'all .2s', fontFamily: "'Outfit', sans-serif",
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* SUCCESS MODAL */}
      {modal === 'success' && (
        <Modal onClose={() => setModal(null)}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 70, height: 70, borderRadius: '50%',
              background: 'rgba(52,211,153,.12)', color: 'var(--green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px', fontSize: 32,
              animation: 'pulseRing 1.6s ease infinite',
            }}>
              ✓
            </div>
            <div style={{ fontSize: 21, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Transfer Successful!
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text-s)', lineHeight: 1.6, marginBottom: 6 }}>
              Your transfer has been processed successfully.
            </div>
            <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", color: 'var(--text-m)', marginBottom: 24 }}>
              Ref: {txRef}
            </div>
            <button
              onClick={() => setModal(null)}
              style={{
                width: '100%', padding: '13px',
                background: 'var(--primary)', color: '#fff',
                border: 'none', borderRadius: 'var(--r-sm)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                boxShadow: 'var(--sh-primary)', fontFamily: "'Outfit', sans-serif",
              }}
            >
              Done
            </button>
          </div>
        </Modal>
      )}

      <style>{`
        @media (max-width: 900px) { .send-layout { grid-template-columns: 1fr !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseRing {
          0%,100% { box-shadow: 0 0 0 0 rgba(52,211,153,.3); }
          50%      { box-shadow: 0 0 0 16px rgba(52,211,153,0); }
        }
      `}</style>
    </div>
  );
}
