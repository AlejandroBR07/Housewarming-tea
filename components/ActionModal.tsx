
import React from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  isDanger = false,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm animate-fade-in" 
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up border-4 border-stone-100">
        <div className="p-6 text-center">
          
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDanger ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'}`}>
            {isDanger ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
          </div>

          <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">
            {title}
          </h3>
          
          <div className="text-stone-500 text-sm mb-6 leading-relaxed">
            {description}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`
                w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                ${isDanger 
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-200' 
                  : 'bg-stone-800 text-white hover:bg-stone-900 shadow-stone-200'}
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? (
                <>Processando...</>
              ) : (
                confirmLabel
              )}
            </button>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full bg-white border border-stone-200 text-stone-500 py-3 rounded-xl font-bold hover:bg-stone-50 transition-colors"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
