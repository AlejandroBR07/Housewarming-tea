
import React, { useState } from 'react';
import { Gift } from '../types';
import { Gift as GiftIcon, Utensils, Trash2, PartyPopper, Ban, HeartHandshake } from 'lucide-react';
import { ActionModal } from './ActionModal';

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
  const [loadingAction, setLoadingAction] = useState(false);
  
  // States para controlar os Modais
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  
  // Mudamos de boolean para guardar a INTENÇÃO ('join' = quer entrar, 'leave' = quer sair)
  // Isso impede que o texto mude sozinho enquanto carrega
  const [foodModalMode, setFoodModalMode] = useState<'join' | 'leave' | null>(null);

  // Filtra presentes do usuário
  const myGifts = gifts.filter(
    g => g.claimedBy && g.claimedBy.toLowerCase() === guestName.toLowerCase()
  );

  // Verifica status global de comida baseado nos itens
  const bringsFood = myGifts.some(g => g.bringsFood);

  if (myGifts.length === 0) return null;

  // --- HANDLERS ---

  const confirmRemoveItem = async () => {
    if (!itemToRemove) return;
    setLoadingAction(true);
    await onRemoveGift(itemToRemove);
    setLoadingAction(false);
    setItemToRemove(null);
  };

  const confirmFoodToggle = async () => {
    if (!foodModalMode) return;
    
    setLoadingAction(true);
    
    // Define o status alvo baseado no modo do modal, não no status atual que pode mudar
    const targetStatus = foodModalMode === 'join'; 
    
    await onUpdateFoodStatus(targetStatus);
    
    setLoadingAction(false);
    setFoodModalMode(null);
  };

  // Prepara as mensagens do Modal de Remoção
  const isLastItem = myGifts.length === 1;
  const removeModalDescription = (
    <>
      <p>Você tem certeza que deseja liberar este item da sua lista?</p>
      {isLastItem && bringsFood && (
        <p className="mt-2 p-2 bg-red-50 text-red-600 text-xs rounded-lg font-bold">
          Atenção: Como este é seu único item, sua confirmação no churrasco também será cancelada automaticamente.
        </p>
      )}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 mb-10 animate-fade-in-up">
      
      {/* Card Principal Escuro */}
      <div className="bg-gradient-to-r from-stone-800 to-stone-700 rounded-3xl overflow-hidden shadow-2xl border border-stone-600 relative">
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <HeartHandshake className="w-48 h-48" />
        </div>

        {/* --- HEADER --- */}
        <div className="p-6 sm:p-8 pb-0 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/10 p-2 rounded-full border border-white/20">
                <GiftIcon className="w-5 h-5 text-yellow-300" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
              {myGifts.length > 1 ? 'Suas Escolhas' : 'Sua Escolha Especial'}
            </h3>
          </div>
          <p className="text-stone-300 text-sm ml-12">
             {guestName}, aqui está o que você separou com carinho. ❤️
          </p>
        </div>

        {/* --- LISTA DE ITENS --- */}
        <div className="p-6 sm:p-8 space-y-4 relative z-10">
          {myGifts.map((gift) => (
            <div key={gift.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 border border-white/10 group hover:bg-white/15 transition-all">
              {/* Imagem */}
              <img 
                src={gift.image} 
                alt={gift.name} 
                className="w-16 h-16 rounded-xl object-cover bg-white ring-2 ring-white/20 shadow-lg"
              />
              
              {/* Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="font-bold text-white text-lg leading-tight">{gift.name}</p>
                <p className="text-xs text-stone-300 uppercase tracking-wider mt-1">{gift.category}</p>
              </div>

              {/* Botão Remover */}
              <button 
                onClick={() => setItemToRemove(gift.id)}
                className="w-full sm:w-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/20 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span className="sm:hidden">Liberar Item</span>
              </button>
            </div>
          ))}
        </div>

        {/* --- RODAPÉ: STATUS CHURRASCO --- */}
        <div className={`
          border-t transition-colors duration-500 relative z-10
          ${bringsFood 
            ? 'bg-green-900/40 border-green-500/30' 
            : 'bg-stone-900/40 border-white/10'}
        `}>
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Texto do Status */}
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-full shrink-0 ${bringsFood ? 'bg-green-500 text-white shadow-lg shadow-green-900/50' : 'bg-stone-600 text-stone-400'}`}>
                <Utensils className="w-5 h-5" />
              </div>
              <div className="text-center sm:text-left">
                <p className={`font-bold text-sm uppercase tracking-wider mb-0.5 ${bringsFood ? 'text-green-300' : 'text-stone-400'}`}>
                  Status do Churrasco
                </p>
                <p className="text-white font-medium text-sm sm:text-base leading-tight">
                  {bringsFood 
                    ? "Presença confirmada! (Levando 1kg de carne)" 
                    : "Apenas entregarei o presente (Sem churrasco)"}
                </p>
              </div>
            </div>

            {/* Botão de Toggle */}
            <button
              onClick={() => setFoodModalMode(bringsFood ? 'leave' : 'join')}
              className={`
                shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg w-full sm:w-auto justify-center
                ${bringsFood 
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/20' 
                  : 'bg-green-500 hover:bg-green-400 text-white border border-green-400'}
              `}
            >
              {bringsFood ? (
                <>
                  <Ban className="w-4 h-4" />
                  Não poderei ir
                </>
              ) : (
                <>
                  <PartyPopper className="w-4 h-4" />
                  Quero ir!
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* === MODAL DE REMOÇÃO DE ITEM === */}
      <ActionModal 
        isOpen={!!itemToRemove}
        onClose={() => setItemToRemove(null)}
        onConfirm={confirmRemoveItem}
        title="Liberar este presente?"
        description={removeModalDescription}
        confirmLabel="Sim, liberar item"
        isDanger={true}
        isLoading={loadingAction}
      />

      {/* === MODAL DE STATUS CHURRASCO === */}
      <ActionModal
        isOpen={!!foodModalMode}
        onClose={() => setFoodModalMode(null)}
        onConfirm={confirmFoodToggle}
        title={foodModalMode === 'leave' ? "Cancelar presença no churrasco?" : "Confirmar presença no churrasco?"}
        description={
          foodModalMode === 'leave'
            ? "Ao cancelar, entendemos que você entregará o presente mas não participará do almoço. Seus presentes continuam garantidos!"
            : "Para participar do almoço, pedimos a contribuição de 1kg de carne por pessoa. Confirmar?"
        }
        confirmLabel={foodModalMode === 'leave' ? "Sim, cancelar churrasco" : "Sim, vou levar carne!"}
        isDanger={foodModalMode === 'leave'}
        isLoading={loadingAction}
      />

    </div>
  );
};
