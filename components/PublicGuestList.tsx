import React from 'react';
import { Gift } from '../types';
import { Users } from 'lucide-react';

interface PublicGuestListProps {
  gifts: Gift[];
}

export const PublicGuestList: React.FC<PublicGuestListProps> = ({ gifts }) => {
  // 1. Filtra quem já confirmou presente
  const confirmedGifts = gifts.filter(g => g.claimed);

  if (confirmedGifts.length === 0) return null;

  // 2. Agrupa por nome para evitar duplicatas visuais
  // Cria um Set de nomes únicos
  const uniqueNames: string[] = Array.from(new Set(confirmedGifts.map(g => g.claimedBy || 'Anônimo')));

  return (
    <div className="max-w-4xl mx-auto px-4 mb-16 mt-8 animate-fade-in">
      <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white shadow-lg ring-1 ring-stone-100">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-stone-800">
            Olha quem já confirmou presença!
          </h3>
          <p className="text-stone-500 text-sm mt-1">
            Nossa lista de amigos queridos só cresce 😍
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {uniqueNames.map((name, idx) => (
            <div 
              key={`${name}-${idx}`}
              className="group relative bg-white border border-stone-200 rounded-full pl-1 pr-4 py-1 flex items-center gap-2 shadow-sm hover:scale-105 hover:shadow-md transition-all cursor-default"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs uppercase shrink-0">
                {name.charAt(0)}
              </div>
              <span className="font-bold text-stone-700 text-sm truncate max-w-[150px]">
                {name}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">
            Total confirmados: {uniqueNames.length}
          </p>
        </div>
      </div>
    </div>
  );
};