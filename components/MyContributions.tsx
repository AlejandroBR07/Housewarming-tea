
import React, { useState } from 'react';
import { Gift } from '../types';
import { Gift as GiftIcon, Utensils, Trash2, Loader2, AlertTriangle, PartyPopper, Ban } from 'lucide-react';

interface MyContributionsProps {
  gifts: Gift[];
  guestName: string;
  onRemoveGift: (giftId: string) => void;
  onUpdateFoodStatus: (status: boolean) => void;
}

export const MyContributions: React.FC<MyContributionsProps> = ({ 
  gifts, 
  guestName, 
  onRemoveGift,
  onUpdateFoodStatus 
}) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isUpdatingFood, setIsUpdatingFood] = useState(false);

  // Filtra presentes do usuário
  const myGifts = gifts.filter(
    g => g.claimedBy && g.claimedBy.toLowerCase() === guestName.toLowerCase()
  );

  // Verifica status global de comida baseado nos itens
  const bringsFood = myGifts.some(g => g.bringsFood);

  if (myGifts.length === 0) return null;

  const handleRemoveClick = async (giftId: string) => {
    // Lógica: Se for o último item e ele estiver confirmado no churrasco, avisa que vai sair do churrasco também
    const isLastItem = myGifts.length === 1;
    
    let message = "Tem certeza que deseja liberar este item? Ele voltará para a lista de presentes disponíveis.";
    if (isLastItem && bringsFood) {
        message = "ATENÇÃO: Este é seu único item. Ao liberá-lo, sua confirmação no churrasco também será cancelada (pois é obrigatório levar 1 presente). Deseja continuar?";
    }

    if (window.confirm(message)) {
        setProcessingId(giftId);
        await onRemoveGift(giftId);
        setProcessingId(null);
    }
  };

  const toggleFoodStatus = async () => {
    const newStatus = !bringsFood;
    let message = newStatus 
        ? "Deseja confirmar sua presença no churrasco (Levando 1kg de carne)?"
        : "Deseja cancelar sua presença no churrasco? Seus presentes continuarão confirmados.";
    
    if (window.confirm(message)) {
        setIsUpdatingFood(true);
        await onUpdateFoodStatus(newStatus);
        setIsUpdatingFood(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mb-10 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA 1: LISTA DE ITENS (Ocupa 2/3 no desktop) */}
        <div className="lg:col-span-2 space-y-4">
           <div className="bg-white rounded-3xl p-6 shadow-lg border border-stone-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-stone-100 p-2 rounded-full">
                    <GiftIcon className="w-5 h-5 text-stone-600" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-800">
                  {myGifts.length > 1 ? 'Seus Presentes Escolhidos' : 'Seu Presente Escolhido'}
                </h3>
              </div>

              <div className="space-y-3">
                {myGifts.map((gift) => (
                  <div key={gift.id} className="bg-stone-50 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 border border-stone-100 transition-all hover:shadow-md">
                    {/* Imagem e Texto */}
                    <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
                        <img 
                            src={gift.image} 
                            alt={gift.name} 
                            className="w-16 h-16 rounded-lg object-cover bg-white shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-stone-800 text-lg leading-tight">{gift.name}</p>
                            <p className="text-xs text-stone-500 uppercase tracking-wider mt-1">{gift.category}</p>
                        </div>
                    </div>

                    {/* Botão Remover */}
                    <button 
                      onClick={() => handleRemoveClick(gift.id)}
                      disabled={processingId === gift.id}
                      className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-red-50 text-stone-500 hover:text-red-600 border border-stone-200 hover:border-red-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 group"
                    >
                      {processingId === gift.id ? (
                        <>
                           <Loader2 className="w-4 h-4 animate-spin" />
                           <span className="text-xs">Processando...</span>
                        </>
                      ) : (
                        <>
                           <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                           <span>Liberar Item</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* COLUNA 2: STATUS DO CHURRASCO (Ocupa 1/3 no desktop) */}
        <div className="lg:col-span-1">
           <div className={`
              h-full rounded-3xl p-6 shadow-lg border-2 flex flex-col justify-between relative overflow-hidden transition-all
              ${bringsFood 
                 ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200' 
                 : 'bg-white border-stone-200'}
           `}>
              <div>
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className={`p-2 rounded-full ${bringsFood ? 'bg-green-200 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                        <Utensils className="w-6 h-6" />
                    </div>
                    <h3 className={`text-lg font-bold font-serif ${bringsFood ? 'text-green-800' : 'text-stone-700'}`}>
                      Almoço de Comemoração
                    </h3>
                  </div>

                  {bringsFood ? (
                      <div className="relative z-10 animate-fade-in">
                        <p className="text-green-800 font-bold text-lg mb-1">
                          Você confirmou presença! 🎉
                        </p>
                        <p className="text-green-700 text-sm mb-6 leading-relaxed">
                          Sua entrada é <strong>1kg de carne</strong>. <br/>Obrigado por participar desse momento com a gente!
                        </p>
                      </div>
                  ) : (
                      <div className="relative z-10">
                        <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                          Você optou por entregar o presente, mas <strong>não participar do churrasco</strong>.
                        </p>
                      </div>
                  )}
              </div>
              
              <div className="relative z-10 mt-4">
                  <button 
                    onClick={toggleFoodStatus}
                    disabled={isUpdatingFood}
                    className={`
                      w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm
                      ${bringsFood 
                        ? 'bg-white text-red-500 border border-red-100 hover:bg-red-50' 
                        : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'}
                    `}
                  >
                    {isUpdatingFood ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : bringsFood ? (
                        <>
                           <Ban className="w-4 h-4" />
                           Não vou mais ao churrasco
                        </>
                    ) : (
                        <>
                           <PartyPopper className="w-4 h-4" />
                           Quero ir ao churrasco!
                        </>
                    )}
                  </button>
                  {bringsFood && (
                     <p className="text-[10px] text-center mt-2 text-green-700/60">
                        Ao clicar, você cancela apenas o churrasco, não o presente.
                     </p>
                  )}
              </div>

              {/* Decorative Icon */}
              {bringsFood && (
                  <Utensils className="absolute -bottom-4 -right-4 w-32 h-32 text-green-200/50 pointer-events-none" />
              )}
           </div>
        </div>

      </div>
    </div>
  );
};
