'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small timeout to avoid "setState synchronously in effect" warning, 
    // and ensures client-side rendering match.
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-card w-full max-w-lg rounded-2xl border-[3px] border-dashed border-main p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b-2 border-main/10 pb-4">
          <h3 className="text-2xl font-header font-bold text-main">{title}</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-main/5 hover:bg-main/10 text-main font-bold transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Body */}
        <div className="font-body text-main">
            {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
