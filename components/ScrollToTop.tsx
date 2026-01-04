
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className="md:hidden fixed bottom-6 right-6 z-40 bg-stone-800/90 text-white p-3 rounded-full shadow-lg backdrop-blur-sm border border-stone-700 animate-fade-in hover:bg-stone-700 active:scale-95 transition-all"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};
