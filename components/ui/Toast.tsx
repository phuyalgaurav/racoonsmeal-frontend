'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-60 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              min-w-75 p-4 rounded-lg shadow-lg border-2 border-main
              transform transition-all animate-in slide-in-from-right-full
              flex items-center gap-3 relative
              ${toast.type === 'success' ? 'bg-green text-white' : ''}
              ${toast.type === 'error' ? 'bg-red text-white' : ''}
              ${toast.type === 'info' ? 'bg-sidebar text-white' : ''}
            `}
            // Add a "ripped paper" edge effect using mask if desired, for now keeping it simple but bold
            style={{ 
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0.5rem 50%)' // Simple jagged edge left
            }} 
          >
            <div className="pl-4 font-bold font-header text-lg">
                {toast.type === 'success' && '★'}
                {toast.type === 'error' && '!'}
                {toast.type === 'info' && 'i'}
            </div>
            <div className="font-bold font-body">{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
