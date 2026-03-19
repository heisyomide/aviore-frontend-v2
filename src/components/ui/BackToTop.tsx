'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // 🚀 Logic: Show button only after scrolling 400px
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

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-24 right-6 z-[160]
        w-12 h-12 rounded-full 
        bg-white text-[#222] shadow-[0_10px_25px_rgba(0,0,0,0.15)]
        border border-gray-100
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        md:bottom-10
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
        hover:bg-[#222] hover:text-white active:scale-90
      `}
      aria-label="Back to top"
    >
      <ChevronUp size={24} strokeWidth={3} />
    </button>
  );
}