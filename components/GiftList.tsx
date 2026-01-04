
import React, { useState } from 'react';
import { Gift, GiftCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { Gift as GiftIcon, CheckCircle2, Lock } from 'lucide-react';

interface GiftListProps {
  gifts: Gift[];
  onSelectGift: (gift: Gift) => void;
}

export const GiftList: React.FC<GiftListProps> = ({ gifts, onSelectGift }) => {
  const [filter, setFilter] = useState<GiftCategory | 'Todos'>('Todos');

  const filteredGifts = filter === 'Todos' 
    ? gifts 
    : gifts.filter(g => g.category === filter);

  const categories = ['Todos', ...Object.values(GiftCategory).filter(c => c !== GiftCategory.ESPECIAL)];

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as GiftCategory | 'Todos')}
            className={`
              px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300
              ${filter === cat 
                ? 'bg-stone-800 text-white shadow-lg scale-105' 
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 hover:shadow-md'}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredGifts.map((gift) => (
          <div 
            key={gift.id} 
            className={`
              group relative bg-white rounded-3xl overflow-hidden transition-all duration-500
              ${gift.claimed 
                ? 'opacity-70 grayscale-[0.5] shadow-none border border-stone-100' 
                : 'hover:shadow-2xl hover:-translate-y-2 border border-stone-100 shadow-lg shadow-stone-200/50'}
            `}
          >
            {/* Imagem com Overlay */}
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 z-10 transition-opacity group-hover:opacity-40" />
              <img 
                src={gift.image} 
                alt={gift.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Category Badge - Flutuante e Elegante */}
              <div className={`
                absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest z-20 backdrop-blur-md shadow-sm border
                ${CATEGORY_COLORS[gift.category]}
              `}>
                {gift.category}
              </div>

              {/* Status Badge */}
              <div className={`
                absolute bottom-4 right-4 px-3 py-1.5 rounded-full z-20 font-bold text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-md
                ${gift.claimed 
                  ? 'bg-stone-800/90 text-white border border-stone-600' 
                  : 'bg-white/90 text-green-700 border border-green-200'}
              `}>
                {gift.claimed ? (
                   <>
                     <Lock className="w-3 h-3" />
                     Indisponível
                   </>
                ) : (
                   <>
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                     Disponível
                   </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col h-[180px]">
              <div className="flex-1">
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-2 leading-tight line-clamp-2 group-hover:text-stone-600 transition-colors">
                  {gift.name}
                </h3>
                <div className="w-10 h-1 bg-gradient-to-r from-stone-200 to-transparent rounded-full mb-3" />
              </div>
              
              {gift.claimed ? (
                <div className="w-full py-3 bg-stone-100 text-stone-400 rounded-xl text-center text-sm font-bold border border-stone-200 flex items-center justify-center gap-2 cursor-not-allowed">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Já escolhido ❤️</span>
                </div>
              ) : (
                <button
                  onClick={() => onSelectGift(gift)}
                  className="w-full py-3.5 bg-stone-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-stone-800/20 active:scale-95 group-hover:bg-stone-800"
                >
                  <GiftIcon className="w-4 h-4" />
                  Quero Presentear
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredGifts.length === 0 && (
        <div className="text-center py-20">
          <p className="font-serif text-xl text-stone-400 italic">
            "Não encontramos itens nesta categoria...<br/>Que tal ver as outras opções?" 🎁
          </p>
        </div>
      )}
    </div>
  );
};
