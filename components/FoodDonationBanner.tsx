
import React from 'react';
import { Check, UtensilsCrossed, X, ArrowDown } from 'lucide-react';

interface FoodDonationBannerProps {
  bringsFood: boolean;
  onToggle: (value: boolean) => void;
  guestName: string;
  alreadyConfirmed?: boolean;
}

export const FoodDonationBanner: React.FC<FoodDonationBannerProps> = ({ 
    bringsFood, 
    onToggle, 
    guestName,
    alreadyConfirmed = false
}) => {
  
  // Se o usuário já está confirmado no churrasco globalmente (em outros itens), não mostramos este banner
  // pois ele já cumpriu o requisito. O gerenciamento fica no componente MyContributions.
  if (alreadyConfirmed) {
      return null;
  }

  return (
    <div className="max-w-3xl mx-auto -mt-6 sm:-mt-8 relative z-20 px-4 mb-8">
      <div 
        className={`
          rounded-2xl shadow-xl transition-all duration-500 overflow-hidden
          ${bringsFood 
            ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 ring-4 ring-green-100' 
            : 'bg-white border border-stone-200'}
        `}
      >
        <div className="p-5 md:p-6">
          {/* STATE: MARCOU QUE QUER IR */}
          {bringsFood ? (
            <div className="flex flex-col items-center text-center animate-fade-in">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg mb-3">
                <Check className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-serif font-bold text-green-800 mb-1">
                Que alegria que você vem! 🍖
              </h3>
              <p className="text-green-700 mb-4 max-w-lg text-sm sm:text-base leading-relaxed">
                Para validar sua presença no churrasco, agora <strong>escolha um presente na lista abaixo</strong> e finalize a confirmação.
                <br/>
                <span className="text-xs opacity-80">(Lembre-se: Entrada = 1kg de carne + Presente da lista)</span>
              </p>

              <div className="flex flex-col gap-3 w-full justify-center items-center">
                 <div className="animate-bounce mt-2 text-green-600">
                    <ArrowDown className="w-6 h-6" />
                 </div>

                 {/* Botão de Cancelar */}
                <button
                    onClick={() => onToggle(false)}
                    className="mt-2 text-xs text-stone-400 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition-colors flex items-center gap-1 border border-transparent hover:border-red-100"
                >
                    <X className="w-3 h-3" />
                    Mudei de ideia, não poderei ficar para o almoço
                </button>
              </div>
            </div>
          ) : (
            /* STATE: NÃO CONFIRMADO (CONVITE) */
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
              {/* Ícone Desktop */}
              <div className="shrink-0 p-3 bg-stone-100 rounded-full text-stone-500 hidden md:block">
                <UtensilsCrossed className="w-6 h-6" />
              </div>

              <div className="flex-1 text-center md:text-left w-full">
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 mb-2">
                   {/* Ícone Mobile (centralizado) */}
                   <div className="md:hidden p-2 bg-stone-100 rounded-full text-stone-500 mb-1">
                      <UtensilsCrossed className="w-5 h-5" />
                   </div>
                   <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold font-serif text-stone-800">
                      Churrasco de Comemoração
                    </h3>
                    <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200 uppercase tracking-wide">
                      Adesão
                    </span>
                   </div>
                </div>
                
                <p className="text-stone-600 text-sm mb-4 leading-relaxed">
                   Quer almoçar com a gente? Para participar, pedimos que levem <span className="font-bold text-stone-800">1kg de carne</span> e confirmem um presente da lista.
                   Quem não puder ficar para o almoço, não precisa levar a carne, tá bem? ❤️
                </p>

                <p className="text-xs text-stone-400 italic hidden sm:block">
                  (Marque ao lado se você for ficar para o churrasco)
                </p>
              </div>

              <button
                onClick={() => onToggle(true)}
                className="w-full md:w-auto group shrink-0 bg-white border border-stone-300 text-stone-600 px-6 py-3.5 rounded-xl font-bold shadow-sm hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Vou almoçar e levar carne</span>
                <div className="w-5 h-5 bg-stone-100 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <Check className="w-3 h-3 text-stone-400 group-hover:text-green-600" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
