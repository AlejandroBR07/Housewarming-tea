
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { HeroSection } from './components/HeroSection';
import { FoodDonationBanner } from './components/FoodDonationBanner';
import { GiftList } from './components/GiftList';
import { ConfirmModal } from './components/ConfirmModal';
import { Onboarding } from './components/Onboarding';
import { MyContributions } from './components/MyContributions';
import { Toast } from './components/Toast';
import { AdminDashboard } from './components/AdminDashboard';
import { PublicGuestList } from './components/PublicGuestList';
import { ScrollToTop } from './components/ScrollToTop';
import { Gift, GiftCategory } from './types';
import { fetchGiftsFromSheet, unclaimGiftInSheet, claimGiftInSheet } from './services/sheetService';
import { Info, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [guestName, setGuestName] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Ref para guardar o estado anterior e comparar (para notificações)
  const prevGiftsRef = useRef<Gift[]>([]);
  
  // Este estado controla a INTENÇÃO do usuário para o PRÓXIMO presente
  // Mas também deve refletir se ele JÁ marcou churrasco antes
  const [bringsFood, setBringsFood] = useState<boolean>(false);
  
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  }, []);

  // Função unificada para carregar dados
  const loadData = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setIsRefreshing(true);

    try {
      const newData = await fetchGiftsFromSheet();
      
      // Lógica de Notificação em Tempo Real
      // Só executa se for em background (polling) e se já tivermos dados anteriores
      if (isBackground && prevGiftsRef.current.length > 0 && guestName) {
         
         const updates: string[] = [];

         newData.forEach(newItem => {
            const oldItem = prevGiftsRef.current.find(g => g.id === newItem.id);
            if (!oldItem) return;

            // CASO 1: ALGUÉM PEGOU UM ITEM (Claim)
            // Item agora está claimed=true, antes estava false
            // E quem pegou NÃO fui eu
            if (
                newItem.claimed && 
                !oldItem.claimed && 
                newItem.claimedBy && 
                newItem.claimedBy.toLowerCase() !== guestName.toLowerCase()
            ) {
                updates.push(`🔔 ${newItem.claimedBy} acabou de escolher: ${newItem.name}`);
            }

            // CASO 2: ALGUÉM LIBEROU UM ITEM (Unclaim)
            // Item agora está claimed=false, antes estava true
            // E não fui eu que liberei (minha ação local já atualiza o estado antes do polling)
            if (
                !newItem.claimed && 
                oldItem.claimed
            ) {
                updates.push(`🔔 O item "${newItem.name}" voltou para a lista! Aproveite!`);
            }
         });

         // Se houve mudanças, notifica
         if (updates.length > 0) {
             // Mostra apenas a última ou a mais relevante para não floodar
             // Se tiver muitos updates, generaliza
             if (updates.length > 2) {
                 showToast('🔔 A lista foi atualizada! Vários itens mudaram de status.', 'info');
             } else {
                 // Mostra um por um com um pequeno delay se for mais de um (limitado a 2)
                 updates.forEach((msg, idx) => {
                     setTimeout(() => showToast(msg, 'info'), idx * 2000);
                 });
             }
         }
      }

      // Atualiza a Ref e o State
      prevGiftsRef.current = newData;
      setGifts(newData);

    } catch (error) {
      console.error("Erro ao atualizar lista", error);
    } finally {
      if (!isBackground) setLoading(false);
      else setIsRefreshing(false);
    }
  }, [guestName, showToast]);

  // Carga Inicial
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Polling: Atualiza a lista a cada 15 segundos
  useEffect(() => {
    if (!guestName) return; 

    const interval = setInterval(() => {
      loadData(true);
    }, 15000); // 15 segundos

    return () => clearInterval(interval);
  }, [guestName, loadData]);

  // Efeito para sincronizar o estado 'bringsFood' com os presentes atuais do usuário
  useEffect(() => {
    if (guestName && gifts.length > 0) {
      const userGifts = gifts.filter(g => g.claimedBy?.toLowerCase() === guestName.toLowerCase());
      const hasFoodConfirmed = userGifts.some(g => g.bringsFood);
      
      if (hasFoodConfirmed) {
        setBringsFood(true);
      }
    }
  }, [gifts, guestName]);

  const handleOnboardingComplete = (name: string, adminStatus: boolean) => {
    setGuestName(name);
    setIsAdmin(adminStatus);
  };

  const handleGiftSelect = (gift: Gift) => {
    // Se for admin, não permite abrir o modal de confirmação de presente
    if (isAdmin) return;
    setSelectedGift(gift);
  };

  const handleRemoveGift = async (giftId: string) => {
    const success = await unclaimGiftInSheet(giftId, guestName);
    
    if (success) {
      setGifts(prevGifts => {
        const updated = prevGifts.map(g => 
          g.id === giftId 
            ? { ...g, claimed: false, claimedBy: undefined, bringsFood: false } 
            : g
        );
        // Atualiza ref imediatamente para evitar notificação falsa de "alguém liberou" no próximo polling
        prevGiftsRef.current = updated; 
        return updated;
      });
      showToast("Item liberado com sucesso!", 'success');
      loadData(true);
    } else {
      showToast("Erro ao liberar item. Tente novamente.", 'error');
    }
  };

  const handleUpdateFoodStatus = async (shouldBringFood: boolean) => {
    const userGifts = gifts.filter(g => g.claimedBy?.toLowerCase() === guestName.toLowerCase());
    if (userGifts.length === 0) return;

    let successCount = 0;
    const updatedGifts = gifts.map(g => {
       if (g.claimedBy?.toLowerCase() === guestName.toLowerCase()) {
         return { ...g, bringsFood: shouldBringFood };
       }
       return g;
    });
    setGifts(updatedGifts);
    prevGiftsRef.current = updatedGifts; 
    setBringsFood(shouldBringFood);

    for (const gift of userGifts) {
       const ok = await claimGiftInSheet(gift.id, guestName, shouldBringFood);
       if (ok) successCount++;
    }

    if (successCount > 0) {
      showToast(shouldBringFood ? "Presença no churrasco confirmada!" : "Presença no churrasco cancelada.", 'success');
      loadData(true);
    } else {
      showToast("Erro ao atualizar status. Tente novamente.", 'error');
      loadData(false);
    }
  };

  const handleConfirmGift = (giftId: string) => {
    const updatedGifts = gifts.map(g => 
        g.id === giftId 
          ? { ...g, claimed: true, claimedBy: guestName, bringsFood: bringsFood } 
          : g
      );
    setGifts(updatedGifts);
    prevGiftsRef.current = updatedGifts; // Importante atualizar a ref para não notificar a si mesmo
    setTimeout(() => loadData(true), 1000);
  };

  const userHasGifts = useMemo(() => {
    return gifts.some(g => g.claimedBy?.toLowerCase() === guestName.toLowerCase());
  }, [gifts, guestName]);

  const isConfirmedForBBQ = useMemo(() => {
     return gifts.some(g => g.claimedBy?.toLowerCase() === guestName.toLowerCase() && g.bringsFood);
  }, [gifts, guestName]);

  if (!guestName) {
    return <Onboarding onComplete={handleOnboardingComplete} existingGifts={gifts} />;
  }

  return (
    <div className="min-h-screen pb-12 font-sans selection:bg-pink-200 selection:text-pink-900">
      <HeroSection />

      {/* ADMIN DASHBOARD (SEMPRE NO TOPO SE FOR ADMIN) */}
      {isAdmin && (
          <AdminDashboard gifts={gifts} />
      )}

      {/* RESTO DO CONTEÚDO */}
      <div className={isAdmin ? "border-t-4 border-stone-200 mt-8 pt-8 bg-stone-50/50" : ""}>
          
          {/* COMPONENTES DE CONVIDADO - SÓ APARECEM SE NÃO FOR ADMIN */}
          {!isAdmin && (
            <>
              {/* SEÇÃO DE CONFIRMAÇÃO DO PRÓPRIO USUÁRIO */}
              <MyContributions 
                gifts={gifts} 
                guestName={guestName} 
                onRemoveGift={handleRemoveGift}
                onUpdateFoodStatus={handleUpdateFoodStatus}
              />

              {(!userHasGifts || !isConfirmedForBBQ) && (
                <FoodDonationBanner 
                  bringsFood={bringsFood} 
                  onToggle={setBringsFood} 
                  guestName={guestName}
                  alreadyConfirmed={isConfirmedForBBQ}
                />
              )}
            </>
          )}

          <PublicGuestList gifts={gifts} />

          <main>
            <div className="text-center mb-8 px-4 relative">
               {isRefreshing && !loading && (
                 <div className="absolute top-0 right-4 sm:right-10 animate-spin text-stone-300">
                    <RefreshCw className="w-4 h-4" />
                 </div>
               )}
              
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 mb-3 drop-shadow-sm">
                {isAdmin ? "Visão Geral dos Itens" : "Lista de Desejos"}
              </h2>
              
              {!isAdmin && (
                <p className="text-stone-600 max-w-xl mx-auto font-medium text-sm sm:text-base leading-relaxed mb-6">
                  Ei, <strong>{guestName}</strong>! Separamos algumas coisinhas que vão nos ajudar muito. 
                  Sinta-se à vontade para escolher o que tocar seu coração. ❤️
                </p>
              )}

              <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 px-4 py-2 rounded-xl max-w-lg mx-auto">
                 <Info className="w-4 h-4 text-stone-400 shrink-0" />
                 <p className="text-xs text-stone-500 italic text-left sm:text-center leading-tight">
                   As fotos são apenas ilustrativas. <br className="hidden sm:block"/>
                   Fique à vontade para escolher a <strong>marca e modelo</strong> que preferir!
                 </p>
              </div>
            </div>
            
            {loading ? (
               <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-stone-400"></div>
                 <p className="text-stone-400 font-serif italic">Buscando a lista atualizada...</p>
               </div>
            ) : (
              <GiftList 
                gifts={gifts.filter(g => g.category !== GiftCategory.ESPECIAL)} 
                onSelectGift={handleGiftSelect}
                isAdmin={isAdmin}
              />
            )}
          </main>
      </div>

      {selectedGift && !isAdmin && (
        <ConfirmModal 
          gift={selectedGift}
          guestName={guestName}
          bringsFood={bringsFood}
          onUpdateBringsFood={setBringsFood}
          onClose={() => setSelectedGift(null)}
          onConfirm={handleConfirmGift}
          showToast={showToast}
          isAlreadyConfirmedForBBQ={isConfirmedForBBQ}
        />
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <ScrollToTop />

      <footer className="text-center py-10 text-stone-500 text-sm border-t border-stone-200/50 mt-12 bg-white/40 backdrop-blur-sm px-4">
        <p className="font-bold text-stone-700">© 2026 Emily & Gustavo</p>
        <p className="text-xs mt-2 opacity-80 max-w-xs mx-auto">
          Feito com muito amor para receber vocês em nossa nova fase.
        </p>
      </footer>
    </div>
  );
};

export default App;
