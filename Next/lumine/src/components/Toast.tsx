'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '380px',
        }}
      >
        {toasts.map((toast) => {
          let bgColor = '#1B6E3F';
          let icon = 'check_circle';

          if (toast.type === 'error') {
            bgColor = '#BA1A1A';
            icon = 'error';
          } else if (toast.type === 'warning') {
            bgColor = '#935B00';
            icon = 'warning';
          } else if (toast.type === 'info') {
            bgColor = '#432818';
            icon = 'info';
          }

          return (
            <div
              key={toast.id}
              style={{
                backgroundColor: bgColor,
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(67, 40, 24, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 500,
                animation: 'fadeIn 0.2s ease-out',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {icon}
              </span>
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  close
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser utilizado dentro de um ToastProvider');
  }
  return context;
}
