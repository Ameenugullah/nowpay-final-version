import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(() => {});

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    if (timers.current[id]) clearTimeout(timers.current[id]);
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 2800) => {
    const id = ++toastId;
    setToasts(prev => [...prev.slice(-3), { id, message, type }]);
    timers.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <div
          key={t.id}
          onClick={() => onDismiss(t.id)}
          style={{
            background: 'var(--card)',
            border: '1.5px solid var(--border)',
            borderLeft: `3px solid ${t.type === 'success' ? 'var(--green)' : t.type === 'error' ? 'var(--red)' : 'var(--primary)'}`,
            borderRadius: 'var(--r-sm)',
            padding: '11px 20px',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text)',
            boxShadow: 'var(--sh-lg)',
            whiteSpace: 'nowrap',
            pointerEvents: 'all',
            cursor: 'pointer',
            animation: 'fadeUp .28s ease both',
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export const useToast = () => useContext(ToastContext);
