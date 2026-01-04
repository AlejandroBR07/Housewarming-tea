
import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { FoodDonationBanner } from './components/FoodDonationBanner';
import { GiftList } from './components/GiftList';
import { ConfirmModal } from './components/ConfirmModal';
import { Onboarding } from './components/Onboarding';
import { Toast } from './components/Toast';
import { AdminDashboard } from './components/AdminDashboard';
import { PublicGuestList } from './components/PublicGuestList';
import { ScrollToTop } from './components/ScrollToTop';
import { Gift, GiftCategory } from './types';
import { fetchGiftsFromSheet } from './services/sheetService';
import { Info } from 'lucide-react';

const App: React.FC = () => {
  const [guestName, setGuestName] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [bringsFood, setBringsFood] = useState<boolean>(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchGiftsFromSheet();
    setGifts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleOnboardingComplete = (name: string, adminStatus: boolean) => {
    setGuestName(name);
    setIsAdmin(adminStatus);
  };

  const handleGiftSelect = (gift: Gift) => {
    setSelectedGift(gift);
  };

  const handleConfirmGift = (giftId: string) => {
    setGifts(prevGifts => 
      prevGifts.map(g => 
        g.id === giftId 
          ? { ...g, claimed: true, claimedBy: guestName, bringsFood: bringsFood } 
          : g
      )
    );
    setTimeout(loadData, 2000);
  };

  if (!guestName) {
    return <Onboarding onComplete={handleOnboardingComplete} existingGifts={gifts} />;
  }

  return (
    <div className="min-h-screen pb-12 font-sans selection:bg-pink-200 selection:text-pink-900">
      
      {/* 1. Header & Intro */}
      <HeroSection />

      {/* ADMIN VIEW */}
      {isAdmin ? (
        <AdminDashboard gifts={gifts} />
      ) : (
        <>
          {/* 2. Prominent Food Donation Option */}
          <FoodDonationBanner 
            bringsFood={bringsFood} 
            onToggle={setBringsFood} 
            guestName={guestName}
          />

          {/* 2.5 Lista Pública de Churrasco */}
          <PublicGuestList gifts={gifts} />

          {/* 3. Main Gift Grid */}
          <main>
            <div className="text-center mb-8 px-4">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 mb-3 drop-shadow-sm">
                Lista de Desejos
              </h2>
              <p className="text-stone-600 max-w-xl mx-auto font-medium text-sm sm:text-base leading-relaxed mb-6">
                Ei, <strong>{guestName}</strong>! Separamos algumas coisinhas que vão nos ajudar muito. 
                Sinta-se à vontade para escolher o que tocar seu coração. ❤️
              </p>

              {/* Aviso de Imagens Ilustrativas */}
              <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 px-4 py-2 rounded-xl max-w-lg mx-auto">
                 <Info className="w-4 h-4 text-stone-400 shrink-0" />
                 <p className="text-xs text-stone-500 italic text-left sm:text-center leading-tight">
                   As fotos são apenas ilustrativas para referência. <br className="hidden sm:block"/>
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
              />
            )}
          </main>
        </>
      )}

      {selectedGift && (
        <ConfirmModal 
          gift={selectedGift}
          guestName={guestName}
          bringsFood={bringsFood}
          onUpdateBringsFood={setBringsFood}
          onClose={() => setSelectedGift(null)}
          onConfirm={handleConfirmGift}
          showToast={showToast}
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
