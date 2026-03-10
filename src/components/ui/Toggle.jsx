export default function Toggle({ checked, onChange, id }) {
  return (
    <label
      htmlFor={id}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: 44,
        height: 24,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
      />
      <span
        style={{
          position: 'absolute', inset: 0,
          borderRadius: 12,
          background: checked ? 'var(--primary)' : 'var(--border)',
          transition: 'background .25s ease',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: 3, left: checked ? 23 : 3,
          width: 18, height: 18,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          transition: 'left .25s ease',
        }}
      />
    </label>
  );
}
