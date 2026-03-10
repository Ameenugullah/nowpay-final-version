const STATUS_STYLES = {
  completed: { bg: 'rgba(52,211,153,.12)',  color: 'var(--green)' },
  pending:   { bg: 'rgba(246,201,78,.12)',  color: 'var(--gold)'  },
  failed:    { bg: 'rgba(248,113,113,.12)', color: 'var(--red)'   },
  credit:    { bg: 'rgba(52,211,153,.12)',  color: 'var(--green)' },
  debit:     { bg: 'rgba(248,113,113,.12)', color: 'var(--red)'   },
  info:      { bg: 'var(--primary-gl)',     color: 'var(--primary)'},
};

export default function StatusBadge({ status, label, size = 'sm' }) {
  const styles = STATUS_STYLES[status] || STATUS_STYLES.info;
  const fontSize = size === 'xs' ? 10 : size === 'sm' ? 11 : 12;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        padding: size === 'xs' ? '2px 7px' : '3px 9px',
        borderRadius: 99,
        fontSize,
        fontWeight: 700,
        background: styles.bg,
        color: styles.color,
        whiteSpace: 'nowrap',
      }}
    >
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
