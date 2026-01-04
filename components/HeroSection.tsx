
import React, { useState, useEffect } from 'react';
import { Heart, Home, Star, Calendar, Clock } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number}>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Definindo a data: 08 de Fevereiro de 2026 às 11:30
    const targetDate = new Date('2026-02-08T11:30:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-blue-50/90 via-white/80 to-pink-50/90 backdrop-blur-sm overflow-hidden shadow-sm border-b border-white/50">
      
      {/* Decorative background elements */}
      <div className="absolute top-10 left-4 sm:left-10 text-blue-400/40 animate-float opacity-60">
        <Home className="w-6 h-6 sm:w-8 sm:h-8" />
      </div>
      <div className="absolute bottom-10 right-4 sm:right-10 text-pink-400/40 animate-float opacity-60" style={{ animationDelay: '2s' }}>
        <Heart className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" />
      </div>
      <div className="absolute top-20 right-8 sm:right-20 text-yellow-500/40 animate-pulse-slow">
        <Star className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12 text-center">
        {/* Badges de Menino/Menina */}
        <div className="flex justify-center items-center space-x-2 sm:space-x-3 mb-4 animate-fade-in-up scale-95 sm:scale-100">
          <span className="bg-blue-100/80 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase tracking-widest font-bold shadow-sm backdrop-blur-md">
            Menino?
          </span>
          <div className="bg-white p-1.5 sm:p-2 rounded-full shadow-md ring-4 ring-white/50">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-stone-300 fill-stone-100" />
          </div>
          <span className="bg-pink-100/80 text-pink-800 border border-pink-200 px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase tracking-widest font-bold shadow-sm backdrop-blur-md">
            Menina?
          </span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-stone-800 mb-2 tracking-tight drop-shadow-sm leading-tight">
          Emily <span className="text-stone-400 italic font-light">&</span> Gustavo
        </h1>
        
        {/* Subtítulo */}
        <p className="text-base sm:text-xl text-stone-600 font-light mb-6 max-w-2xl mx-auto leading-relaxed px-4">
          Chá de Casa Nova & Revelação
        </p>

        {/* Data e Hora em Destaque */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-8 text-stone-700 font-medium">
            <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-stone-100 shadow-sm">
                <Calendar className="w-5 h-5 text-stone-400" />
                <span>08 de Fevereiro</span>
            </div>
            <div className="hidden sm:block text-stone-300">|</div>
            <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-stone-100 shadow-sm">
                <Clock className="w-5 h-5 text-stone-400" />
                <div className="flex flex-col text-left leading-tight text-xs sm:text-sm">
                    <span><strong>11h30</strong> Almoço</span>
                    <span><strong>13h30</strong> Revelação</span>
                </div>
            </div>
        </div>

        {/* Contagem Regressiva */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-8">
            <TimeUnit value={timeLeft.days} label="DIAS" />
            <TimeUnit value={timeLeft.hours} label="HORAS" />
            <TimeUnit value={timeLeft.minutes} label="MIN" />
            <TimeUnit value={timeLeft.seconds} label="SEG" />
        </div>
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ value: number, label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-stone-800 text-white rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg border-b-4 border-stone-600">
            {String(value).padStart(2, '0')}
        </div>
        <span className="text-[10px] sm:text-xs font-bold text-stone-500 mt-2 tracking-widest">{label}</span>
    </div>
);
