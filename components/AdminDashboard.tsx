
import React, { useRef, useState, useEffect } from 'react';
import { Gift } from '../types';
import { Crown, Gift as GiftIcon, Utensils, Share2, X, Download, Loader2, Sparkles, Heart, Calendar, Clock } from 'lucide-react';
import html2canvas from 'html2canvas';

interface AdminDashboardProps {
  gifts: Gift[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ gifts }) => {
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [daysLeft, setDaysLeft] = useState(0);
  
  const storyRef = useRef<HTMLDivElement>(null);

  const claimedGifts = gifts.filter(g => g.claimed);
  
  // Agrupamento para a imagem (Nomes Únicos)
  const uniqueConfirmedNames: string[] = Array.from(new Set(claimedGifts.map(g => g.claimedBy || 'Anônimo')));

  const totalGifts = claimedGifts.length;
  const uniqueFoodBringers = new Set(
    claimedGifts.filter(g => g.bringsFood).map(g => g.claimedBy)
  ).size;

  useEffect(() => {
    const targetDate = new Date('2026-02-08T13:30:00').getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    setDaysLeft(days > 0 ? days : 0);
  }, []);

  const handleGenerateStory = async () => {
    if (!storyRef.current) return;
    setGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const canvas = await html2canvas(storyRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        width: 540,
        windowWidth: 540,
        onclone: (documentClone) => {
            const element = documentClone.getElementById('story-container');
            if (element) {
                // Remove transformações que podem afetar o render
                element.style.transform = 'none';
            }
        }
      });
      
      const image = canvas.toDataURL('image/png');
      setGeneratedImage(image);
    } catch (error) {
      console.error("Erro ao gerar imagem", error);
      alert("Não foi possível gerar a imagem no momento.");
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'lista-confirmados.png';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
        
        {/* Header do Casal */}
        <div className="bg-gradient-to-r from-stone-800 to-stone-700 p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-yellow-400">
              <Crown className="w-5 h-5 fill-current" />
              <span className="text-xs font-bold uppercase tracking-widest">Acesso do Casal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">Painel Administrativo</h2>
            <p className="text-stone-300 text-sm sm:text-base">Resumo do Chá de Casa Nova</p>
          </div>
          
          <button 
            onClick={handleGenerateStory} 
            disabled={generating}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold border border-white/10"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            Gerar Arte para Postar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 p-6 bg-stone-50 border-b border-stone-100">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
            <div className="p-3 bg-pink-100 text-pink-600 rounded-full shrink-0">
              <GiftIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-stone-500 font-bold uppercase">Presentes</p>
              <p className="text-xl sm:text-2xl font-bold text-stone-800">{totalGifts}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-stone-500 font-bold uppercase">Churrasco</p>
              <p className="text-xl sm:text-2xl font-bold text-stone-800">{uniqueFoodBringers} <span className="text-sm font-normal text-stone-400">pessoas</span></p>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-stone-100 text-stone-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-bold border-b border-stone-200">Convidado</th>
                <th className="p-4 font-bold border-b border-stone-200">Presente</th>
                <th className="p-4 font-bold border-b border-stone-200 text-center">Leva Carne?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {claimedGifts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-stone-400 italic">Nenhum presente confirmado ainda.</td>
                </tr>
              ) : (
                claimedGifts.map((gift) => (
                  <tr key={gift.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4 text-stone-800 font-bold">{gift.claimedBy}</td>
                    <td className="p-4 text-stone-600">
                      <div className="flex items-center gap-2">
                          <img src={gift.image} className="w-8 h-8 rounded-md object-cover border border-stone-200" alt="" />
                          <span className="text-sm">{gift.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {gift.bringsFood ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Sim 🍖
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-400 border border-stone-200">
                          Não
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL PREVIEW --- */}
      {generatedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center bg-stone-50">
              <h3 className="font-bold text-stone-800">Sua arte está pronta! ✨</h3>
              <button onClick={() => setGeneratedImage(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-stone-200 overflow-y-auto flex-1 flex justify-center">
               <img src={generatedImage} alt="Stories" className="w-full h-auto rounded-lg shadow-lg max-w-[300px]" />
            </div>
            <div className="p-4 flex flex-col gap-2 bg-white">
              <p className="text-xs text-center text-stone-500 mb-2">
                Segure na imagem para salvar ou clique no botão abaixo.
              </p>
              <button 
                onClick={downloadImage}
                className="w-full bg-stone-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-900"
              >
                <Download className="w-4 h-4" />
                Baixar Imagem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HIDDEN CANVAS ELEMENT --- */}
      <div className="fixed top-0 left-[-9999px]">
        <div 
          id="story-container"
          ref={storyRef}
          className="w-[540px] bg-gradient-to-br from-[#fdfbf7] via-white to-[#fff0f5] p-10 flex flex-col items-center relative overflow-hidden font-sans"
          style={{ minHeight: '960px', height: 'auto' }} 
        >
          {/* Background Decorations */}
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-200 via-yellow-200 to-pink-200"></div>
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-40 -left-10 w-60 h-60 bg-pink-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-50 rounded-full blur-3xl opacity-50"></div>

          {/* Badge de Contagem Regressiva */}
          <div className="absolute top-8 right-8 z-20">
             <div className="bg-stone-800 text-white px-4 py-2 rounded-xl shadow-lg flex flex-col items-center border border-stone-600">
                <span className="text-xs uppercase font-bold tracking-widest text-stone-400 leading-none mb-1 block">Faltam</span>
                <span className="text-3xl font-bold leading-none block my-1">{daysLeft}</span>
                <span className="text-xs uppercase font-bold tracking-widest text-stone-400 leading-none mt-1 block">Dias</span>
             </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8 relative z-10 w-full mt-6 flex flex-col items-center">
             <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full border border-stone-200 shadow-sm mb-6">
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                <span className="text-sm font-bold uppercase tracking-widest text-stone-600 leading-none pt-1">Chá de Casa Nova</span>
             </div>
             <h1 className="text-5xl font-serif font-bold text-stone-800 leading-none mb-2">
               Emily <span className="text-stone-400 italic font-light">&</span> Gustavo
             </h1>
             
             <div className="flex justify-center items-center gap-4 mt-6 text-stone-600 text-sm font-bold uppercase tracking-wide bg-white/60 backdrop-blur-sm py-3 px-6 rounded-xl border border-stone-100 mx-auto w-max shadow-sm">
                <div className="flex items-center gap-2 leading-none">
                   <Calendar className="w-4 h-4 text-stone-500" /> <span className="pt-0.5">08 Fev</span>
                </div>
                <span className="text-stone-300">|</span>
                <div className="flex items-center gap-2 leading-none">
                   <Clock className="w-4 h-4 text-stone-500" /> <span className="pt-0.5">13h30</span>
                </div>
             </div>
          </div>

          {/* Main Card */}
          <div className="w-full bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-2xl relative z-10 flex-1 flex flex-col">
            <div className="text-center mb-8 flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4 shadow-sm ring-4 ring-white">
                <GiftIcon className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-stone-800 font-serif leading-none mb-2">Presença Confirmada!</h2>
              <p className="text-stone-600 text-base mt-2 leading-tight">
                Olha quem já garantiu o presente e vem comemorar com a gente! 😍
              </p>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-3 w-full">
               {uniqueConfirmedNames.slice(0, 16).map((name, idx) => (
                 /* Correção de alinhamento: usando flex items-center e removendo line-heights fixos grandes */
                 <div key={idx} className="flex items-center gap-4 bg-white p-2 rounded-xl border border-stone-100 shadow-sm h-14">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 text-stone-600 font-bold text-sm uppercase shrink-0 flex items-center justify-center leading-none">
                      {name.charAt(0)}
                    </div>
                    <span className="text-lg font-bold text-stone-700 truncate w-full leading-none pt-1">
                        {name}
                    </span>
                 </div>
               ))}
            </div>

            {uniqueConfirmedNames.length > 16 && (
               <div className="mt-4 text-center p-4 bg-stone-800 text-white rounded-xl text-lg font-bold shadow-lg leading-none flex items-center justify-center">
                 <span className="pt-1">+ {uniqueConfirmedNames.length - 16} amigos confirmados!</span>
               </div>
            )}
            
            {uniqueConfirmedNames.length === 0 && (
              <div className="text-center py-16 text-stone-400 italic text-lg leading-normal">
                A lista ainda está começando... <br/> Seja o primeiro a confirmar!
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-10 mb-4 text-center relative z-10">
             <p className="text-stone-500 text-sm uppercase tracking-widest font-bold flex items-center gap-3 justify-center leading-none">
               <Sparkles className="w-4 h-4" />
               <span className="pt-0.5">Ansiosos por vocês</span>
               <Sparkles className="w-4 h-4" />
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
