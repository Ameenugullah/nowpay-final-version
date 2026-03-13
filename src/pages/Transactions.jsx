import { useState, useMemo } from 'react';
import { RiCalendarLine, RiDownloadLine } from 'react-icons/ri';
import { useWallet } from '@/context/WalletContext';
import TransactionRow from '@/components/wallet/TransactionRow';
import StatusBadge from '@/components/ui/StatusBadge';
import { fmtCompact } from '@/utils/formatters';

const FILTERS = [
  { key: 'all',     label: 'All'     },
  { key: 'credit',  label: 'Credits' },
  { key: 'debit',   label: 'Debits'  },
  { key: 'pending', label: 'Pending' },
  { key: 'failed',  label: 'Failed'  },
];

export default function Transactions() {
  const { transactions } = useWallet();
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    switch (filter) {
      case 'credit':  return transactions.filter(t => t.type === 'credit');
      case 'debit':   return transactions.filter(t => t.type === 'debit');
      case 'pending': return transactions.filter(t => t.status === 'pending');
      case 'failed':  return transactions.filter(t => t.status === 'failed');
      default:        return transactions;
    }
  }, [transactions, filter]);

  const totalIn      = transactions.filter(t => t.type === 'credit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalOut     = transactions.filter(t => t.type === 'debit'  && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalPending = transactions.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="page-enter tx-page">

      {/* Toolbar */}
      <div className="tx-toolbar">
        {/* Filter tabs */}
        <div className="tx-filter-row">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '7px 14px', borderRadius: 9, fontSize: 13, fontWeight: 500,
                background: filter === f.key ? 'var(--primary)' : 'var(--card)',
                border: `1px solid ${filter === f.key ? 'var(--primary)' : 'var(--border)'}`,
                color: filter === f.key ? '#fff' : 'var(--text-s)',
                cursor: 'pointer', transition: 'all .18s', fontFamily: "'Outfit',sans-serif",
                whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 9, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, background: 'var(--card)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-s)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <RiCalendarLine size={14} /> Mar 2025
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, background: 'var(--card)', border: '1px solid var(--border)', fontSize: 13, fontWeight: 500, color: 'var(--text-s)', cursor: 'pointer', transition: 'all .18s', fontFamily: "'Outfit',sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-s)'; }}
          >
            <RiDownloadLine size={14} /> Export
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="tx-summary-grid">
        {[
          { label: 'Total Received', val: totalIn,      icon: '↑', type: 'credit'  },
          { label: 'Total Spent',    val: totalOut,     icon: '↓', type: 'debit'   },
          { label: 'Pending',        val: totalPending, icon: '⏳', type: 'pending' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '15px 16px' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0,
              background: s.type === 'credit' ? 'rgba(52,211,153,.12)' : s.type === 'debit' ? 'rgba(248,113,113,.12)' : 'rgba(246,201,78,.12)',
              color: s.type === 'credit' ? 'var(--green)' : s.type === 'debit' ? 'var(--red)' : 'var(--gold)',
            }}>
              {s.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, color: 'var(--text-s)', marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                ₦ {fmtCompact(s.val)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="tx-table-wrap">
        <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                  {['Recipient / Description', 'Type', 'Date & Time', 'Amount', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-s)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: 50, textAlign: 'center', color: 'var(--text-s)', fontSize: 14 }}>No transactions found.</td></tr>
                ) : filtered.map(tx => (
                  <TransactionRow key={tx.id} tx={tx} isMobile={false} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="tx-mobile-list">
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-s)', fontSize: 14 }}>No transactions found.</div>
        ) : filtered.map(tx => (
          <TransactionRow key={tx.id} tx={tx} isMobile />
        ))}
      </div>

      <style>{`
        .tx-page { padding: 24px; display: flex; flex-direction: column; gap: 18px; overflow-x: hidden; }
        .tx-toolbar { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
        .tx-filter-row { display: flex; gap: 6px; flex-wrap: wrap; }
        .tx-summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .tx-table-wrap { display: block; overflow: hidden; }
        .tx-mobile-list { display: none; flex-direction: column; gap: 9px; }

        @media (max-width: 768px) {
          .tx-table-wrap  { display: none !important; }
          .tx-mobile-list { display: flex !important; }
          .tx-summary-grid { grid-template-columns: 1fr 1fr !important; }
          .tx-page { padding: 16px; gap: 14px; }
        }
        @media (max-width: 480px) {
          .tx-page { padding: 14px; gap: 12px; }
          .tx-summary-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 360px) {
          .tx-page { padding: 10px; }
          .tx-summary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
