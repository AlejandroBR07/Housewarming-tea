
import React, { useState } from 'react';
import { Home, Heart, ArrowRight, Sparkles, AlertCircle, Check } from 'lucide-react';
import { Gift } from '../types';

interface OnboardingProps {
  onComplete: (name: string, isAdmin: boolean) => void;
  existingGifts: Gift[];
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, existingGifts }) => {
  const [name, setName] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const checkNameAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cleanName = name.trim();

    // Verifica admin com nome corrigido
    if (cleanName.toLowerCase() === 'emily thalya') {
      onComplete(cleanName, true);
      return;
    }

    const nameExists = existingGifts.some(g => 
      g.claimedBy && g.claimedBy.toLowerCase() === cleanName.toLowerCase()
    );

    if (nameExists) {
      setShowConfirmation(true);
    } else {
      onComplete(cleanName, false);
    }
  };

  const confirmIdentity = () => {
    onComplete(name.trim(), false);
  };

  const cancelIdentity = () => {
    setShowConfirmation(false);
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border-4 border-stone-100">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-800 mb-2">Já te conhecemos!</h2>
          <p className="text-stone-600 mb-6 text-sm leading-relaxed">
            O nome <strong>"{name}"</strong> já está na lista de presença. É você mesmo?
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={confirmIdentity}
              className="w-full bg-stone-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-900 transition-colors"
            >
              <Check className="w-4 h-4" />
              Sim, sou eu
            </button>
            <button 
              onClick={cancelIdentity}
              className="w-full bg-white border border-stone-200 text-stone-500 py-3 rounded-xl font-bold hover:bg-stone-50 transition-colors text-sm"
            >
              Não, vou arrumar meu nome
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-50/95 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden border-4 border-stone-100">
        
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-baby-blue/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-baby-pink/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-full animate-float" style={{ animationDelay: '0s' }}>
              <Home className="w-8 h-8 text-blue-500" />
            </div>
            <div className="bg-pink-100 p-3 rounded-full animate-float" style={{ animationDelay: '1s' }}>
              <Heart className="w-8 h-8 text-pink-500 fill-current" />
            </div>
          </div>

          <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">
            Olá! Que bom ter você aqui!
          </h1>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Estamos preparando tudo com muito carinho para o Chá da <br/>
            <strong>Emily e do Gustavo</strong>
          </p>

          <form onSubmit={checkNameAndSubmit} className="space-y-4">
            <div className="text-left">
              <label htmlFor="guestName" className="block text-sm font-bold text-stone-600 mb-1 ml-1">
                Como você gosta de ser chamado?
              </label>
              <input
                id="guestName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Tia Maria, Primo João..."
                className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-stone-400 focus:outline-none focus:ring-4 focus:ring-stone-100 transition-all text-lg"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform
                ${name.trim() 
                  ? 'bg-stone-800 text-white hover:scale-[1.02] hover:shadow-lg' 
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'}
              `}
            >
              Ver Lista de Presentes
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-stone-400 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>Feito com amor</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
