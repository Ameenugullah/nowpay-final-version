import { useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { fmtNGN } from '@/utils/formatters';

export default function TransactionRow({ tx, isMobile }) {
  const [open, setOpen] = useState(false);
  const credit = tx.type === 'credit';
  const sign = credit ? '+' : '-';

  if (isMobile) {
    return (
      <>
        <div
          onClick={() => setOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 11,
            padding: '11px 14px',
            borderRadius: 'var(--r-sm)',
            background: 'var(--card)',
            border: '1.5px solid var(--border)',
            cursor: 'pointer',
            transition: 'border-color .15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <Avatar img={tx.img} name={tx.name} size={40} radius={10} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tx.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <StatusBadge status={tx.type} label={credit ? 'Credit' : 'Debit'} size="xs" />
              <StatusBadge status={tx.status} size="xs" />
              <span style={{ fontSize: 11, color: 'var(--text-m)' }}>{tx.date}</span>
            </div>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13.5, fontWeight: 600,
            color: credit ? 'var(--green)' : 'var(--text)',
            flexShrink: 0,
          }}>
            {sign}₦{(tx.amount).toLocaleString()}
          </div>
        </div>
        {open && <TxDetailModal tx={tx} onClose={() => setOpen(false)} />}
      </>
    );
  }

  return (
    <>
      <tr
        style={{ cursor: 'pointer', transition: 'background .12s' }}
        onMouseEnter={(e) => { Array.from(e.currentTarget.cells).forEach(c => c.style.background = 'var(--card-h)'); }}
        onMouseLeave={(e) => { Array.from(e.currentTarget.cells).forEach(c => c.style.background = 'transparent'); }}
      >
        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-s)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar img={tx.img} name={tx.name} size={34} radius={8} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{tx.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-s)', marginTop: 1 }}>{tx.cat} · {tx.bank}</div>
            </div>
          </div>
        </td>
        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-s)' }}>
          <StatusBadge status={tx.type} label={credit ? '↑ Credit' : '↓ Debit'} />
        </td>
        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-s)', fontSize: 12, color: 'var(--text-s)' }}>
          {tx.date}<br /><span style={{ color: 'var(--text-m)' }}>{tx.time}</span>
        </td>
        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-s)' }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: credit ? 'var(--green)' : 'var(--text)' }}>
            {sign}₦{fmtNGN(tx.amount)}
          </span>
        </td>
        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-s)' }}>
          <StatusBadge status={tx.status} />
        </td>
        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-s)' }}>
          <button
            onClick={() => setOpen(true)}
            style={{
              padding: '4px 11px', borderRadius: 7, fontSize: 12, fontWeight: 500,
              background: 'var(--card-h)', border: '1px solid var(--border)',
              color: 'var(--text-s)', cursor: 'pointer', transition: 'all .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-s)'; }}
          >
            View
          </button>
        </td>
      </tr>
      {open && <TxDetailModal tx={tx} onClose={() => setOpen(false)} />}
    </>
  );
}

function TxDetailModal({ tx, onClose }) {
  const credit = tx.type === 'credit';
  const rows = [
    ['Reference', tx.id],
    ['Description', tx.name],
    ['Category', tx.cat],
    ['Bank / Provider', tx.bank],
    ['Type', credit ? '↑ Credit' : '↓ Debit'],
    ['Amount', `${credit ? '+' : '-'}₦${fmtNGN(tx.amount)}`],
    ['Date & Time', `${tx.date} · ${tx.time}`],
    ['Status', tx.status],
    ...(tx.note ? [['Note', tx.note]] : []),
  ];

  return (
    <Modal onClose={onClose}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: credit ? 'rgba(52,211,153,.12)' : 'rgba(78,124,246,.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px', fontSize: 24,
        }}>
          {credit ? '↑' : '↓'}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          Transaction Detail
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-s)' }}>{tx.cat} · {tx.date} at {tx.time}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map(([k, v]) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            padding: '10px 13px', background: 'var(--surface)',
            borderRadius: 9, fontSize: 13, gap: 10, flexWrap: 'wrap',
          }}>
            <span style={{ color: 'var(--text-s)', flexShrink: 0 }}>{k}</span>
            <span style={{
              fontFamily: ['Amount','Reference'].includes(k) ? "'JetBrains Mono',monospace" : undefined,
              fontWeight: 600, color: k === 'Amount' ? (credit ? 'var(--green)' : 'var(--text)') : 'var(--text)',
              textAlign: 'right', wordBreak: 'break-all', maxWidth: '100%',
            }}>{v}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        style={{
          width: '100%', marginTop: 18, padding: '12px',
          borderRadius: 'var(--r-sm)',
          background: 'transparent',
          border: '1.5px solid var(--border)',
          color: 'var(--text-s)', fontSize: 14, fontWeight: 500,
          cursor: 'pointer', transition: 'all .2s',
        }}
      >
        Close
      </button>
    </Modal>
  );
}
