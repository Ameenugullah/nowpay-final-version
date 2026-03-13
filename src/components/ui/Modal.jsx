import { useEffect } from 'react';

export default function Modal({ onClose, children, maxWidth = 460 }) {
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
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 600,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 0,
      }}
      className="modal-backdrop"
    >
      <div
        style={{
          background: 'var(--card)',
          border: '1.5px solid var(--border)',
          width: '100%',
          maxWidth,
          position: 'relative',
          maxHeight: '92dvh',
          overflowY: 'auto',
          // Mobile: slide up from bottom, no side rounding
          borderRadius: '20px 20px 0 0',
          padding: '28px 20px 32px',
          animation: 'sheetUp .28s ease both',
        }}
        className="modal-inner"
      >
        {/* Drag handle (mobile feel) */}
        <div style={{
          width: 40, height: 4, borderRadius: 99,
          background: 'var(--border)',
          margin: '0 auto 20px',
        }} />

        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--card-h)', border: 'none',
            color: 'var(--text-s)', fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all .15s',
          }}
          aria-label="Close"
        >
          ✕
        </button>
        {children}
      </div>

      <style>{`
        @keyframes sheetUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 600px) {
          .modal-backdrop {
            align-items: center !important;
            padding: 16px !important;
          }
          .modal-inner {
            border-radius: var(--r-lg) !important;
            padding: 32px 28px !important;
          }
        }
      `}</style>
    </div>
  );
}
