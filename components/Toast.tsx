
import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X, Zap, Unlock } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Pequeno delay para animação de entrada
    requestAnimationFrame(() => setVisible(true));

    // AUMENTADO DE 5000 para 10000 (10 segundos)
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Espera animação de saída
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  let content = null;

  // Lógica para extrair nome da mensagem de Info (ex: "Fulano acabou de escolher...")
  const getAvatarLetter = (msg: string) => {
    // Se for mensagem de liberação (não tem nome de pessoa no início geralmente), usa um ícone
    if (msg.includes('voltou') || msg.includes('liberado')) return '♻️';
    return msg.charAt(0).toUpperCase(); 
  };

  const isReleaseMessage = message.includes('voltou') || message.includes('liberado');

  switch (type) {
    case 'success':
      content = (
        <div className="flex items-center gap-3 w-full">
            <div className="shrink-0 p-2 rounded-full bg-green-100 text-green-600 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <p className="font-bold text-green-800 text-sm">Sucesso!</p>
                <p className="text-green-700 text-xs leading-tight">{message}</p>
            </div>
        </div>
      );
      break;
    case 'error':
      content = (
        <div className="flex items-center gap-3 w-full">
            <div className="shrink-0 p-2 rounded-full bg-red-100 text-red-600 shadow-sm">
                <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <p className="font-bold text-red-800 text-sm">Atenção</p>
                <p className="text-red-700 text-xs leading-tight">{message}</p>
            </div>
        </div>
      );
      break;
    case 'info':
      // Estilo "LIVE" / Social
      const cleanMessage = message.replace('🔔', '').trim();
      
      content = (
        <div className="flex items-center gap-3 w-full">
            {/* Avatar Simulado ou Ícone de Unlock */}
            <div className="relative shrink-0">
                <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white
                    ${isReleaseMessage ? 'bg-gradient-to-br from-emerald-400 to-green-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}
                `}>
                    {isReleaseMessage ? <Unlock className="w-5 h-5" /> : getAvatarLetter(cleanMessage)}
                </div>
                <div className={`
                    absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white animate-pulse
                    ${isReleaseMessage ? 'bg-yellow-400' : 'bg-green-500'}
                `}></div>
            </div>
            
            <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`
                        text-[10px] px-1.5 rounded font-bold uppercase tracking-wider flex items-center gap-1
                        ${isReleaseMessage ? 'bg-green-100 text-green-700' : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'}
                    `}>
                        <Zap className={`w-3 h-3 ${isReleaseMessage ? 'fill-green-600 text-green-600' : 'fill-yellow-300 text-yellow-300'}`} />
                        {isReleaseMessage ? 'Oportunidade' : 'Agora'}
                    </span>
                </div>
                <p className="text-stone-800 text-sm font-medium leading-tight">
                    {cleanMessage}
                </p>
            </div>
        </div>
      );
      break;
  }

  // Estilos baseados no tipo
  const containerClasses = type === 'info' 
    ? (isReleaseMessage 
        ? "bg-white/95 border-l-4 border-l-green-500 shadow-xl shadow-green-500/20"
        : "bg-white/95 border-l-4 border-l-indigo-500 shadow-xl shadow-indigo-500/20")
    : type === 'success' 
        ? "bg-white/95 border-l-4 border-l-green-500 shadow-xl shadow-green-500/10"
        : "bg-white/95 border-l-4 border-l-red-500 shadow-xl shadow-red-500/10";

  return (
    <div 
        className={`
            fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-sm px-4 pointer-events-none
            transition-all duration-500 ease-out transform
            ${visible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}
        `}
    >
      <div 
        className={`
            pointer-events-auto w-full p-4 rounded-xl border border-stone-100 backdrop-blur-md flex items-start gap-2
            ${containerClasses}
        `}
      >
        {content}

        <button 
          onClick={() => setVisible(false)}
          className="shrink-0 text-stone-400 hover:text-stone-600 p-1 -mt-1 -mr-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
