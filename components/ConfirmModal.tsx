
import React, { useState } from 'react';
import { Gift } from '../types';
import { generateThankYouMessage } from '../services/geminiService';
import { claimGiftInSheet } from '../services/sheetService';
import { X, Sparkles, Loader2, Check, UtensilsCrossed } from 'lucide-react';

interface ConfirmModalProps {
  gift: Gift;
  guestName: string;
  bringsFood: boolean;
  onUpdateBringsFood: (value: boolean) => void;
  onClose: () => void;
  onConfirm: (giftId: string) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  gift, 
  guestName, 
  bringsFood, 
  onUpdateBringsFood,
  onClose, 
  onConfirm, 
  showToast 
}) => {
  const [step, setStep] = useState<'confirm' | 'lunch_check' | 'processing' | 'success'>('confirm');
  const [finalMessage, setFinalMessage] = useState<string>('');

  const initiateConfirmation = () => {
    // Se a pessoa NÃO marcou almoço, perguntamos se ela tem certeza
    if (!bringsFood) {
      setStep('lunch_check');
    } else {
      processConfirmation(true);
    }
  };

  const processConfirmation = async (isBringsFood: boolean) => {
    setStep('processing');
    
    // 1. Tenta salvar na planilha
    const success = await claimGiftInSheet(gift.id, guestName, isBringsFood);
    
    if (success) {
        // 2. Gera mensagem de agradecimento
        const message = await generateThankYouMessage(guestName, gift.name, isBringsFood);
        setFinalMessage(message);
        setStep('success');
        onConfirm(gift.id);
        showToast("Presente confirmado com sucesso!", 'success');
    } else {
        // Erro amigável - Como o Toast agora é no topo, o usuário verá isso!
        showToast("Não foi possível confirmar. Tente novamente ou verifique se o item já foi pego.", 'error');
        setStep('confirm');
    }
  };

  return (
    // items-end no mobile cria o efeito de "Bottom Sheet"
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={(step !== 'processing' && step !== 'success') ? onClose : undefined}
      />

      {/* Modal Content - Animação slide-up no mobile, fade-in-up no desktop */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up sm:animate-fade-in-up border-t-4 sm:border-4 border-white ring-1 ring-stone-200 max-h-[85vh] overflow-y-auto">
        
        {/* === STEP 1: CONFIRMAÇÃO DO PRESENTE === */}
        {step === 'confirm' && (
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-800">Presentear o Casal</h2>
                <p className="text-stone-500 text-sm mt-1">Que alegria, <strong>{guestName}</strong>! Você escolheu:</p>
              </div>
              <button onClick={onClose} className="p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-4 p-3 sm:p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <img src={gift.image} alt={gift.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-sm" />
                <div>
                  <p className="font-bold text-base sm:text-lg text-stone-800 leading-tight">{gift.name}</p>
                  <span className="inline-block mt-1 text-xs font-bold uppercase tracking-wider text-stone-500 bg-stone-200 px-2 py-0.5 rounded">
                    {gift.category}
                  </span>
                </div>
              </div>

              {bringsFood && (
                <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-2xl border border-green-100">
                  <div className="bg-green-200 p-1.5 rounded-full shrink-0">
                    <Check className="w-4 h-4 text-green-700" />
                  </div>
                  <span className="text-sm font-medium">Ah, e já anotamos que você vai participar do churrasco! (Levar 1kg de carne) 🍖</span>
                </div>
              )}
            </div>

            <button
              onClick={initiateConfirmation}
              className="w-full bg-stone-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-stone-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-stone-200"
            >
              Confirmar Presente
            </button>
          </div>
        )}

        {/* === STEP 1.5: VERIFICAÇÃO DO ALMOÇO (DOUBLE CHECK) === */}
        {step === 'lunch_check' && (
          <div className="p-6 sm:p-8 text-center bg-orange-50/50">
             <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
               <UtensilsCrossed className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">Vai perder o churrasco?</h3>
             <p className="text-stone-600 mb-6 leading-relaxed text-sm">
               Vimos que você não confirmou o almoço. <br/>
               Gostaríamos muito da sua presença! Para participar é só levar 1kg de carne.
             </p>
             
             <div className="flex flex-col gap-3">
               <button 
                 onClick={() => {
                   onUpdateBringsFood(true); // Atualiza estado no App
                   processConfirmation(true); // Prossegue salvando como SIM
                 }}
                 className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md shadow-green-100"
               >
                 Mudei de ideia! Vou almoçar sim! 🍖
               </button>

               <button 
                 onClick={() => processConfirmation(false)} // Prossegue salvando como NÃO
                 className="w-full bg-white border border-stone-200 text-stone-500 py-3 rounded-xl font-bold hover:bg-stone-50 transition-colors text-sm"
               >
                 Infelizmente não poderei ficar
               </button>
             </div>
          </div>
        )}

        {/* === STEP 2: PROCESSANDO === */}
        {step === 'processing' && (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="w-12 h-12 text-stone-400 animate-spin mb-4" />
            <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">Só um instante...</h3>
            <p className="text-stone-500">Estamos anotando seu nome no presente.</p>
          </div>
        )}

        {/* === STEP 3: SUCESSO === */}
        {step === 'success' && (
          <div className="p-8 bg-gradient-to-br from-white to-stone-50">
             <div className="flex justify-center mb-6">
               <div className="bg-green-100 p-4 rounded-full animate-bounce">
                 <Sparkles className="w-8 h-8 text-green-600" />
               </div>
             </div>
             
             <h2 className="text-3xl font-serif font-bold text-center text-stone-800 mb-2">Uhuuul!</h2>
             <p className="text-center text-stone-500 mb-8">Deu tudo certo. Muito obrigado!</p>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 relative mb-6">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest">
                 Mensagem pra você
               </div>
               <p className="italic text-stone-600 leading-relaxed font-serif text-lg text-center mt-2">
                 "{finalMessage}"
               </p>
             </div>

             <button
               onClick={onClose}
               className="w-full bg-stone-800 text-white py-3 rounded-xl font-bold hover:bg-stone-900 transition-all"
             >
               Voltar para a lista
             </button>
          </div>
        )}

      </div>
    </div>
  );
};
