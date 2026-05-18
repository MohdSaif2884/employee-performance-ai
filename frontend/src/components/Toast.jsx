import React, { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function showToast({ type = 'success', title, message }) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              'rounded-lg border px-4 py-3 shadow ' +
              (t.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-800'
                : t.type === 'warning'
                  ? 'border-yellow-200 bg-yellow-50 text-yellow-800'
                  : 'border-green-200 bg-green-50 text-green-800')
            }
          >
            <div className="text-sm font-semibold">{t.title}</div>
            <div className="text-xs opacity-90">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

