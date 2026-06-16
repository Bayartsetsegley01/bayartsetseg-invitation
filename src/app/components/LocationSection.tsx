import React from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const LocationSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden my-12 rounded-3xl max-w-4xl mx-auto">
      {/* Faded map background */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXB8ZW58MXx8fHwxNzgxNTg3Nzk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Map Background"
          className="w-full h-full object-cover opacity-30 grayscale mix-blend-overlay"
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 theme-card border p-8 rounded-3xl shadow-2xl text-center max-w-xs mx-4 transform hover:scale-105 transition-transform duration-500">
        <div className="w-12 h-12 theme-accent-bg rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <MapPin size={20} className="text-black" />
        </div>
        <h3 className="text-xl font-medium mb-2 theme-text">
          {t.locationTitle}
        </h3>
        <p className="text-xs opacity-70 mb-5">
          {t.locationAddress}
        </p>
        <a 
          href="https://maps.app.goo.gl/cZi2GgHP9hsee7Ed6"
          target="_blank"
          rel="noreferrer"
          className="inline-block px-5 py-2 rounded-full border text-xs font-medium theme-text hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
        >
          {t.mapButton}
        </a>
      </div>
    </section>
  );
};
