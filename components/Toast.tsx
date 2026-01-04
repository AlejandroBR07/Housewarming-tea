
import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    // Auto-fecha após 5 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    // Alterado de bottom-4 para top-4 e aumentado z-index
    <div className="fixed top-4 left-4 right-4 z-[9999] flex justify-center pointer-events-none animate-fade-in-up">
      <div 
        className={`
          pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border w-full max-w-md backdrop-blur-md transition-all
          ${isSuccess 
            ? 'bg-green-50/95 border-green-200 text-green-800' 
            : 'bg-red-50/95 border-red-200 text-red-800'}
        `}
      >
        <div className={`shrink-0 p-1 rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
          {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        </div>
        
        <p className="flex-1 text-sm font-medium leading-tight">
          {message}
        </p>

        <button 
          onClick={onClose}
          className={`p-1 rounded-full hover:bg-black/5 transition-colors ${isSuccess ? 'text-green-600' : 'text-red-600'}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
