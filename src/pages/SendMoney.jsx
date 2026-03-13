import { useState, useEffect, useRef, useCallback } from 'react';
import { RiLoaderLine, RiCheckLine, RiArrowRightLine, RiCloseLine, RiSearchLine } from 'react-icons/ri';
import { useWallet }      from '@/context/WalletContext';
import { useTransaction } from '@/hooks/useTransaction';
import { useToast }       from '@/context/ToastContext';
import Modal  from '@/components/ui/Modal';
import Avatar from '@/components/ui/Avatar';
import { fmtNGN, fmtUSD, genRef } from '@/utils/formatters';
import { NIGERIAN_BANKS, APP_CONFIG } from '@/utils/constants';
import { calcFee, resolveAccountName } from '@/services/api';

// ── Shared input style ──────────────────────────────────
const field = {
  width: '100%', padding: '13px 14px',
  background: 'var(--surface)',
  border: '1.5px solid var(--border)',
  borderRadius: 'var(--r-sm)',
  fontSize: 14, color: 'var(--text)',
  outline: 'none', transition: 'border-color .2s, box-shadow .2s',
  fontFamily: "'Outfit', sans-serif",
  boxSizing: 'border-box',
};

const label = {
  display: 'block', fontSize: 11, fontWeight: 700,
  color: 'var(--text-s)', textTransform: 'uppercase',
  letterSpacing: '0.08em', marginBottom: 7,
};

// ── Searchable bank dropdown ────────────────────────────
function BankDropdown({ value, onChange }) {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const filtered = NIGERIAN_BANKS.filter((b) =>
    b.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (bank) => { onChange(bank); setSearch(''); setOpen(false); };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          ...field,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', textAlign: 'left',
          borderColor: open ? 'var(--primary)' : 'var(--border)',
          boxShadow: open ? '0 0 0 3px var(--primary-gl)' : 'none',
          color: value ? 'var(--text)' : 'var(--text-m)',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {value || 'Select bank…'}
        </span>
        <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-s)', flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: 'var(--card)', border: '1.5px solid var(--primary)',
          borderRadius: 'var(--r-sm)', zIndex: 50, overflow: 'hidden',
          boxShadow: 'var(--sh-lg)',
          animation: 'fadeUp .18s ease both',
        }} className="bank-dropdown-menu">
          {/* Search inside dropdown */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-s)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <RiSearchLine size={14} style={{ color: 'var(--text-s)', flexShrink: 0 }} />
            <input
              autoFocus
              placeholder="Search bank…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: 13, color: 'var(--text)', outline: 'none', flex: 1, fontFamily: "'Outfit',sans-serif" }}
            />
          </div>
          <ul style={{ maxHeight: 200, overflowY: 'auto', margin: 0, padding: '4px 0', listStyle: 'none', scrollbarWidth: 'thin' }}>
            {filtered.length === 0 ? (
              <li style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text-s)' }}>No banks found</li>
            ) : filtered.map((b) => (
              <li
                key={b}
                onClick={() => select(b)}
                style={{
                  padding: '10px 14px', fontSize: 13, cursor: 'pointer',
                  color: b === value ? 'var(--primary)' : 'var(--text)',
                  background: b === value ? 'var(--primary-gl)' : 'transparent',
                  fontWeight: b === value ? 600 : 400,
                  transition: 'background .12s',
                }}
                onMouseEnter={(e) => { if (b !== value) e.currentTarget.style.background = 'var(--card-h)'; }}
                onMouseLeave={(e) => { if (b !== value) e.currentTarget.style.background = 'transparent'; }}
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Main component ──────────────────────────────────────
export default function SendMoney() {
  const { recipients, balance } = useWallet();
  const { sendMoney, isProcessing } = useTransaction();
  const toast = useToast();

  // ── Beneficiary state ──
  const [acctNo,       setAcctNo]       = useState('');
  const [bank,         setBank]         = useState('');
  const [resolving,    setResolving]    = useState(false);
  const [resolvedName, setResolvedName] = useState('');
  const [resolveErr,   setResolveErr]   = useState('');
  const [recipient,    setRecipient]    = useState(null);  // confirmed { name, acct, bank }

  // ── Amount state ──
  const [amount, setAmount] = useState('');
  const [isNGN,  setIsNGN]  = useState(true);
  const [note,   setNote]   = useState('');

  // ── Modal state ──
  const [modal,  setModal]  = useState(null); // null | 'confirm' | 'success'
  const [txRef,  setTxRef]  = useState('');
  const [isNewR, setIsNewR] = useState(false);

  // ── Derived amounts ──
  const rawAmt  = parseFloat(amount) || 0;
  const ngnAmt  = isNGN ? rawAmt : rawAmt * APP_CONFIG.NGN_PER_USD;
  const { fee, total } = calcFee(ngnAmt);
  const afterBal = balance - total;
  const overBal  = ngnAmt > 0 && total > balance;

  const convHint = rawAmt > 0
    ? isNGN
      ? `≈ $${fmtUSD(ngnAmt / APP_CONFIG.NGN_PER_USD)} USD`
      : `≈ ₦${fmtNGN(ngnAmt)} NGN`
    : `Exchange rate: $1 USD = ₦${APP_CONFIG.NGN_PER_USD.toLocaleString()}`;

  // ── Trigger account name resolution when acctNo=10 & bank set ──
  useEffect(() => {
    if (acctNo.length === 10 && bank) {
      let cancelled = false;
      setResolving(true);
      setResolvedName('');
      setResolveErr('');
      setRecipient(null);

      resolveAccountName(acctNo, bank, recipients)
        .then(({ name }) => {
          if (cancelled) return;
          setResolvedName(name);
          setRecipient({ name, acct: acctNo, bank });
          // Check if it's an existing recipient
          const existing = recipients.find(
            (r) => r.acct === acctNo && r.bank === bank
          );
          setIsNewR(!existing);
        })
        .catch(() => {
          if (cancelled) return;
          setResolveErr('Could not resolve account name. Please check the details.');
        })
        .finally(() => { if (!cancelled) setResolving(false); });

      return () => { cancelled = true; };
    } else {
      setResolvedName('');
      setResolveErr('');
      setRecipient(null);
    }
  }, [acctNo, bank]);

  // Fill form from a recent recipient
  const fillFromRecipient = (r) => {
    setAcctNo(r.acct);
    setBank(r.bank);
  };

  const clearBeneficiary = () => {
    setAcctNo(''); setBank('');
    setResolvedName(''); setResolveErr(''); setRecipient(null);
  };

  const canProceed = recipient && ngnAmt > 0 && !overBal;

  const handleSubmit = () => {
    if (!recipient) { toast('⚠ Resolve a recipient first', 'error'); return; }
    if (ngnAmt <= 0) { toast('⚠ Enter a valid amount', 'error'); return; }
    if (overBal)     { toast('⚠ Insufficient balance', 'error'); return; }
    setTxRef(genRef());
    setModal('confirm');
  };

  const handleConfirm = async () => {
    setModal(null);
    const ok = await sendMoney({ recipient, amount: ngnAmt, method: 'paystack', note, isNewRecipient: isNewR });
    if (ok) {
      setModal('success');
      setAmount(''); setNote('');
      clearBeneficiary();
    }
  };

  return (
    <div className="page-enter send-page">
      <div className="send-grid">

        {/* ══ LEFT — FORM ════════════════════════════════════ */}
        <div className="card-static send-form-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header strip */}
          <div className="send-form-header" style={{ padding: '22px 24px 18px', borderBottom: '1px solid var(--border-s)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>Send Money</h2>
            <p style={{ fontSize: 13, color: 'var(--text-s)' }}>Transfer funds instantly via Paystack</p>
          </div>

          <div className="send-form-inner" style={{ padding: '22px 24px' }}>

            {/* ── SECTION 1: BENEFICIARY ── */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  1 · Beneficiary Details
                </span>
                {(acctNo || bank) && (
                  <button onClick={clearBeneficiary} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
                    <RiCloseLine size={13} /> Clear
                  </button>
                )}
              </div>

              {/* Account Number */}
              <div style={{ marginBottom: 12 }}>
                <label style={label}>Account Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter 10-digit account number"
                    value={acctNo}
                    onChange={(e) => setAcctNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={{
                      ...field,
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: 2, fontSize: 15,
                      paddingRight: 44,
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-gl)'; }}
                    onBlur={(e)  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                  />
                  {/* digit counter */}
                  <span style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 11, fontFamily: "'JetBrains Mono',monospace",
                    color: acctNo.length === 10 ? 'var(--green)' : 'var(--text-m)',
                    fontWeight: 600,
                  }}>
                    {acctNo.length}/10
                  </span>
                </div>
              </div>

              {/* Bank */}
              <div style={{ marginBottom: 14 }}>
                <label style={label}>Bank</label>
                <BankDropdown value={bank} onChange={setBank} />
              </div>

              {/* Resolution result */}
              {resolving && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '13px 15px', borderRadius: 'var(--r-sm)',
                  background: 'var(--surface)', border: '1.5px solid var(--border)',
                  fontSize: 13, color: 'var(--text-s)',
                }}>
                  <RiLoaderLine size={16} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)', flexShrink: 0 }} />
                  Verifying account details…
                </div>
              )}

              {!resolving && resolvedName && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '13px 15px', borderRadius: 'var(--r-sm)',
                  background: 'rgba(52,211,153,.08)', border: '1.5px solid rgba(52,211,153,.35)',
                  animation: 'fadeUp .22s ease both',
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(52,211,153,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <RiCheckLine size={16} style={{ color: 'var(--green)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', marginBottom: 1 }}>
                      ✓ {resolvedName}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-s)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {bank} · {acctNo}
                    </div>
                  </div>
                  <button
                    onClick={clearBeneficiary}
                    style={{ fontSize: 11, color: 'var(--text-s)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", whiteSpace: 'nowrap' }}
                  >
                    Wrong account?
                  </button>
                </div>
              )}

              {!resolving && resolveErr && (
                <div style={{
                  padding: '12px 14px', borderRadius: 'var(--r-sm)',
                  background: 'rgba(248,113,113,.08)', border: '1.5px solid rgba(248,113,113,.3)',
                  fontSize: 13, color: 'var(--red)',
                }}>
                  ⚠ {resolveErr}
                </div>
              )}

              {acctNo.length > 0 && acctNo.length < 10 && (
                <div style={{ fontSize: 12, color: 'var(--text-m)', marginTop: 6 }}>
                  {10 - acctNo.length} more digit{10 - acctNo.length !== 1 ? 's' : ''} needed
                </div>
              )}
            </div>

            <div style={{ height: 1, background: 'var(--border-s)', margin: '0 0 22px' }} />

            {/* ── SECTION 2: AMOUNT ── */}
            <div style={{ marginBottom: 22 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 14 }}>
                2 · Amount
              </span>

              {/* Currency toggle + input */}
              <div style={{ marginBottom: 8 }}>
                <label style={label}>Transfer Amount</label>
                <div
                  style={{
                    display: 'flex', overflow: 'hidden',
                    background: 'var(--surface)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 'var(--r-sm)', transition: 'all .2s',
                  }}
                  onFocusCapture={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-gl)'; }}
                  onBlurCapture={(e)  => { e.currentTarget.style.borderColor = overBal ? 'var(--red)' : 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <button
                    type="button"
                    onClick={() => setIsNGN((v) => !v)}
                    className="currency-toggle"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '0 14px', background: 'var(--card-h)',
                      borderRight: '1px solid var(--border)',
                      fontSize: 13, fontWeight: 700, color: 'var(--text)',
                      cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none',
                      border: 'none', flexShrink: 0,
                    }}
                  >
                    <img src={isNGN ? '/images/ng-flag.svg' : '/images/us-flag.png'} alt="" style={{ height: 15, borderRadius: 2, flexShrink: 0 }} />
                    {isNGN ? 'NGN' : 'USD'}
                    <span style={{ fontSize: 10, color: 'var(--text-m)' }}>▾</span>
                  </button>
                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                      flex: 1, border: 'none', background: 'transparent', outline: 'none',
                      padding: '14px 14px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 18, fontWeight: 700,
                      color: overBal ? 'var(--red)' : 'var(--text)',
                      minWidth: 0,
                    }}
                  />
                </div>
              </div>

              {/* Exchange hint */}
              {rawAmt > 0 && (
                <div style={{ fontSize: 12, color: 'var(--text-s)', marginBottom: 8 }}>{convHint}</div>
              )}

              {/* Live balance info */}
              <div style={{
                padding: '11px 14px', borderRadius: 'var(--r-sm)',
                background: overBal ? 'rgba(248,113,113,.07)' : 'var(--surface)',
                border: `1.5px solid ${overBal ? 'rgba(248,113,113,.35)' : 'var(--border-s)'}`,
                fontSize: 13, transition: 'all .25s',
              }}>
                {ngnAmt === 0 ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-s)' }}>Available Balance</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: 'var(--green)' }}>
                      ₦{fmtNGN(balance)}
                    </span>
                  </div>
                ) : overBal ? (
                  <div style={{ color: 'var(--red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>⚠</span>
                    <span>Insufficient balance — you need ₦{fmtNGN(total - balance)} more</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }} className="balance-row">
                    <span style={{ color: 'var(--text-s)' }}>Balance after transfer</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: afterBal < 10000 ? 'var(--gold)' : 'var(--text)' }}>
                      ₦{fmtNGN(afterBal)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--border-s)', margin: '0 0 22px' }} />

            {/* ── SECTION 3: NOTE ── */}
            <div style={{ marginBottom: 22 }}>
              <label style={label}>Note (optional)</label>
              <input
                type="text"
                placeholder="What's this transfer for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={field}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-gl)'; }}
                onBlur={(e)  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* ── FEE BREAKDOWN ── */}
            {ngnAmt > 0 && (
              <div style={{
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                padding: '14px 16px', marginBottom: 22,
                animation: 'fadeUp .2s ease both',
              }}>
                {[
                  { label: 'Transfer Amount', val: `₦ ${fmtNGN(ngnAmt)}` },
                  { label: 'Paystack Fee (1.5%)', val: `₦ ${fmtNGN(fee)}` },
                ].map((r) => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'var(--text-s)', marginBottom: 9 }}>
                    <span>{r.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 500, color: 'var(--text)' }}>{r.val}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Total Debit</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                    ₦ {fmtNGN(total)}
                  </span>
                </div>
              </div>
            )}

            {/* Paystack badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 12, color: 'var(--text-s)' }}>
              <img src="/images/paystack.png" alt="Paystack" style={{ height: 18, width: 'auto', objectFit: 'contain', borderRadius: 3 }} />
              <span>Secured &amp; processed by <strong style={{ color: 'var(--text)' }}>Paystack</strong></span>
            </div>

            {/* ── SUBMIT ── */}
            <button
              onClick={handleSubmit}
              disabled={!canProceed || isProcessing}
              style={{
                width: '100%', padding: '15px',
                background: canProceed && !isProcessing ? 'var(--primary)' : 'var(--border)',
                color: canProceed && !isProcessing ? '#fff' : 'var(--text-m)',
                border: 'none', borderRadius: 'var(--r-sm)',
                fontSize: 14, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: canProceed && !isProcessing ? 'pointer' : 'not-allowed',
                boxShadow: canProceed ? 'var(--sh-primary)' : 'none',
                transition: 'all .2s', fontFamily: "'Outfit', sans-serif",
              }}
            >
              {isProcessing ? (
                <><RiLoaderLine size={17} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</>
              ) : (
                <>Continue to Confirm <RiArrowRightLine size={17} /></>
              )}
            </button>
          </div>
        </div>

        {/* ══ RIGHT — RECENT RECIPIENTS ════════════════════════ */}
        <div className="card-static send-recipients-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="send-rec-header" style={{ padding: '22px 20px 14px', borderBottom: '1px solid var(--border-s)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>Recent Recipients</h3>
            <p style={{ fontSize: 12, color: 'var(--text-s)' }}>Tap to auto-fill account details</p>
          </div>
          <div className="send-rec-list" style={{ padding: '10px 12px', maxHeight: 480, overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {recipients.map((r) => {
              const isActive = acctNo === r.acct && bank === r.bank;
              return (
                <div
                  key={r.id}
                  onClick={() => fillFromRecipient(r)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 12px', borderRadius: 'var(--r-sm)',
                    background: isActive ? 'var(--primary-gl)' : 'transparent',
                    border: `1.5px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                    cursor: 'pointer', transition: 'all .18s', marginBottom: 4,
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--card-h)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Avatar img="" name={r.name} size={40} radius={10} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-s)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.bank}</div>
                    <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: 'var(--text-m)', marginTop: 1 }}>{r.acct}</div>
                  </div>
                  {isActive && <RiCheckLine size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ CONFIRM MODAL ══════════════════════════════════════ */}
      {modal === 'confirm' && (
        <Modal onClose={() => setModal(null)}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(78,124,246,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 24 }}>📤</div>
            <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Confirm Transfer</div>
            <div style={{ fontSize: 13, color: 'var(--text-s)', lineHeight: 1.6 }}>
              Send <strong style={{ color: 'var(--text)' }}>₦{fmtNGN(ngnAmt)}</strong> to <strong style={{ color: 'var(--text)' }}>{recipient?.name}</strong>?
            </div>
          </div>

          {[
            ['Account Name', recipient?.name],
            ['Bank',         recipient?.bank],
            ['Account No',   recipient?.acct],
            ['Amount',       '₦ ' + fmtNGN(ngnAmt)],
            ['Fee (1.5%)',   '₦ ' + fmtNGN(fee)],
            ['Total Debit',  '₦ ' + fmtNGN(total)],
            ['Via',          'Paystack'],
            ['Reference',    txRef],
            ...(note ? [['Note', note]] : []),
          ].map(([k, v]) => (
            <div key={k} className="confirm-row">
              <span style={{ color: 'var(--text-s)', flexShrink: 0 }}>{k}</span>
              <span className="confirm-val" style={{
                fontFamily: ['Amount','Fee (1.5%)','Total Debit','Reference','Account No'].includes(k) ? "'JetBrains Mono',monospace" : undefined,
                color: k === 'Total Debit' ? 'var(--primary)' : 'var(--text)',
              }}>{v}</span>
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            <button
              onClick={handleConfirm}
              style={{
                width: '100%', padding: '14px',
                background: 'var(--primary)', color: '#fff',
                border: 'none', borderRadius: 'var(--r-sm)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: 'var(--sh-primary)', fontFamily: "'Outfit', sans-serif",
              }}
            >
              <RiCheckLine size={17} /> Confirm &amp; Send
            </button>
            <button
              onClick={() => setModal(null)}
              style={{
                width: '100%', padding: '13px',
                background: 'transparent', border: '1.5px solid var(--border)',
                borderRadius: 'var(--r-sm)', color: 'var(--text-s)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* ══ SUCCESS MODAL ══════════════════════════════════════ */}
      {modal === 'success' && (
        <Modal onClose={() => setModal(null)}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 70, height: 70, borderRadius: '50%',
              background: 'rgba(52,211,153,.12)', color: 'var(--green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px', fontSize: 30,
              animation: 'pulseRing 1.6s ease infinite',
            }}>
              ✓
            </div>
            <div style={{ fontSize: 21, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Transfer Successful!</div>
            <div style={{ fontSize: 13, color: 'var(--text-s)', lineHeight: 1.65, marginBottom: 6 }}>
              Your transfer has been sent and is being processed by Paystack.
            </div>
            <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", color: 'var(--text-m)', marginBottom: 24 }}>
              Ref: {txRef}
            </div>
            <button
              onClick={() => setModal(null)}
              style={{
                width: '100%', padding: '14px',
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
        .send-page { padding: 22px; overflow-x: hidden; }
        .send-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 18px;
          align-items: start;
          width: 100%;
        }

        /* Tablet — single column */
        @media (max-width: 900px) {
          .send-grid { grid-template-columns: 1fr !important; }
          .send-recipients-card { order: -1; }
          .send-page { padding: 18px; }
        }

        /* Mobile — tighter padding, no overflow */
        @media (max-width: 640px) {
          .send-page { padding: 14px; }
          .send-form-inner { padding: 16px !important; }
          .send-form-header { padding: 16px 16px 14px !important; }
          .send-rec-header  { padding: 16px 16px 12px !important; }
          .send-rec-list    { padding: 8px 8px !important; }
        }

        /* Very small screens */
        @media (max-width: 380px) {
          .send-page { padding: 10px; }
          .send-form-inner { padding: 12px !important; }
        }

        /* Bank dropdown full-width on mobile, prevent off-screen */
        @media (max-width: 640px) {
          .bank-dropdown-menu {
            position: fixed !important;
            left: 10px !important;
            right: 10px !important;
            width: auto !important;
            top: auto !important;
            bottom: 80px !important;
            max-height: 55vh !important;
            z-index: 500 !important;
            border-radius: 14px !important;
          }
        }

        /* Currency toggle: don't let it shrink too small */
        .currency-toggle {
          min-width: 72px !important;
          flex-shrink: 0 !important;
        }

        /* Balance info row: wrap on very narrow */
        .balance-row {
          flex-wrap: wrap;
          gap: 4px;
        }

        /* Fee breakdown — labels truncate gracefully */
        .fee-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          font-size: 13px;
        }
        .fee-val {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          color: var(--text);
          text-align: right;
          flex-shrink: 0;
          word-break: break-all;
        }

        /* Confirm modal rows: wrap on small screens */
        .confirm-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 10px 13px;
          background: var(--surface);
          border-radius: 9px;
          margin-bottom: 6px;
          font-size: 13px;
          gap: 10px;
          flex-wrap: wrap;
        }
        .confirm-val {
          font-weight: 600;
          color: var(--text);
          text-align: right;
          word-break: break-all;
          max-width: 100%;
        }

        @media (max-width: 400px) {
          .confirm-row { flex-direction: column; gap: 2px; }
          .confirm-val { text-align: left; }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseRing {
          0%,100% { box-shadow: 0 0 0 0 rgba(52,211,153,.3); }
          50%      { box-shadow: 0 0 0 16px rgba(52,211,153,0); }
        }
      `}</style>
    </div>
  );
}
