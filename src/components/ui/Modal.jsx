import { useEffect } from 'react';

export default function Modal({ onClose, children, maxWidth = 440 }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.68)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: 'var(--card)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          padding: '32px 28px',
          width: '100%',
          maxWidth,
          position: 'relative',
          animation: 'slideIn .25s ease both',
          maxHeight: '90dvh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--card-h)', border: 'none',
            color: 'var(--text-s)', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all .15s',
          }}
          aria-label="Close modal"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
