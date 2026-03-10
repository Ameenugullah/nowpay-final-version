import { useState, useMemo } from 'react';
import { RiCalendarLine, RiDownloadLine } from 'react-icons/ri';
import { useWallet } from '@/context/WalletContext';
import TransactionRow from '@/components/wallet/TransactionRow';
import StatusBadge from '@/components/ui/StatusBadge';
import { fmtCompact } from '@/utils/formatters';

const FILTERS = [
  { key: 'all',       label: 'All'       },
  { key: 'credit',    label: 'Credits'   },
  { key: 'debit',     label: 'Debits'    },
  { key: 'pending',   label: 'Pending'   },
  { key: 'failed',    label: 'Failed'    },
];

export default function Transactions() {
  const { transactions } = useWallet();
  const [filter, setFilter] = useState('all');
  const [isMobile] = useState(() => window.innerWidth < 768);

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
    <div className="page-enter" style={{ padding: 26 }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '7px 15px', borderRadius: 9,
                fontSize: 13, fontWeight: 500,
                background: filter === f.key ? 'var(--primary)' : 'var(--card)',
                border: `1px solid ${filter === f.key ? 'var(--primary)' : 'var(--border)'}`,
                color: filter === f.key ? '#fff' : 'var(--text-s)',
                cursor: 'pointer', transition: 'all .18s',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 13px', borderRadius: 9,
            background: 'var(--card)', border: '1px solid var(--border)',
            fontSize: 13, color: 'var(--text-s)', cursor: 'pointer',
          }}>
            <RiCalendarLine size={14} /> Mar 2025
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 13px', borderRadius: 9,
            background: 'var(--card)', border: '1px solid var(--border)',
            fontSize: 13, fontWeight: 500, color: 'var(--text-s)',
            cursor: 'pointer', transition: 'all .18s', fontFamily: "'Outfit', sans-serif",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-s)'; }}
          >
            <RiDownloadLine size={14} /> Export
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }} className="tx-summary-grid">
        {[
          { label: 'Total Received', val: totalIn,      icon: '↑', type: 'credit' },
          { label: 'Total Spent',    val: totalOut,     icon: '↓', type: 'debit'  },
          { label: 'Pending',        val: totalPending, icon: '⏳', type: 'pending' },
        ].map((s) => (
          <div key={s.label} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--card)', border: '1.5px solid var(--border)',
            borderRadius: 'var(--r-lg)', padding: '16px 18px',
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
              background: s.type === 'credit' ? 'rgba(52,211,153,.12)' : s.type === 'debit' ? 'rgba(248,113,113,.12)' : 'rgba(246,201,78,.12)',
              color: s.type === 'credit' ? 'var(--green)' : s.type === 'debit' ? 'var(--red)' : 'var(--gold)',
            }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-s)', marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
                ₦ {fmtCompact(s.val)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table (desktop) */}
      <div className="tx-table-wrap" style={{ display: 'block' }}>
        <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                {['Recipient / Description', 'Type', 'Date & Time', 'Amount', 'Status', 'Action'].map((h) => (
                  <th key={h} style={{
                    padding: '13px 16px', textAlign: 'left',
                    fontSize: 11, fontWeight: 600, color: 'var(--text-s)',
                    textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 50, textAlign: 'center', color: 'var(--text-s)', fontSize: 14 }}>
                    No transactions found.
                  </td>
                </tr>
              ) : filtered.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} isMobile={false} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards (mobile) */}
      <div className="tx-mobile-list" style={{ display: 'none', flexDirection: 'column', gap: 9 }}>
        {filtered.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} isMobile />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tx-summary-grid { grid-template-columns: 1fr 1fr !important; }
          .tx-table-wrap   { display: none !important; }
          .tx-mobile-list  { display: flex !important; }
        }
        @media (max-width: 480px) {
          .tx-summary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
