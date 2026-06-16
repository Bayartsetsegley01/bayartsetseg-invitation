import React from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import { Countdown } from './components/Countdown';
import { Calendar } from './components/Calendar';
import { Gallery } from './components/Gallery';
import { RSVP } from './components/RSVP';
import { LocationSection } from './components/LocationSection';

export const Home = () => {
  const { lang, t, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen theme-bg theme-text transition-colors duration-500 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Navigation / Controls */}
      <nav className="fixed top-0 w-full p-6 flex justify-end gap-3 z-50 pointer-events-none">
        <div className="pointer-events-auto flex gap-3">
          <button 
            onClick={toggleLang}
            className="w-10 h-10 rounded-full theme-card border shadow-sm flex items-center justify-center hover:scale-105 transition-transform"
          >
            <span className="text-[10px] font-medium uppercase">{lang === 'mn' ? 'EN' : 'MN'}</span>
          </button>
          <button 
            onClick={toggleTheme}
            className="h-10 px-4 rounded-full theme-card border shadow-sm flex items-center justify-center hover:scale-105 transition-transform text-[10px] font-medium uppercase"
          >
            {theme}
          </button>
        </div>
      </nav>

      {/* Main Content wrapper */}
      <main className="max-w-4xl mx-auto px-6 py-20 flex flex-col gap-16">
        
        {/* Minimal Hero Section */}
        <section className="flex flex-col items-center justify-center text-center mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center w-full"
          >
            <h1 className="text-sm sm:text-base font-extralight mb-6 tracking-[0.3em] uppercase opacity-60">
              {t.heroTitle}
            </h1>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-8 tracking-wide">
              {t.heroName}
            </h2>

            <div className="space-y-2 opacity-70 mb-12">
              {t.heroUni.split('\n').map((line, i) => (
                <p key={i} className="text-[10px] sm:text-xs uppercase tracking-[0.15em] font-light">{line}</p>
              ))}
              <p className="text-xs sm:text-sm font-normal mt-2 tracking-widest uppercase">{t.heroMajor}</p>
            </div>

            {/* Gallery right below the major */}
            <div className="w-full -mt-8">
              <Gallery />
            </div>

          </motion.div>
        </section>

        {/* Combined Event Info Section (3 times merged) */}
        <section className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="theme-card border rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-black/5 flex flex-col md:flex-row items-center justify-between gap-10"
          >
            <div className="flex-1 flex flex-col items-center text-center w-full">
              <Calendar />
            </div>

            <div className="hidden md:block w-px h-32 bg-zinc-200 dark:bg-zinc-800" />
            <div className="block md:hidden w-32 h-px bg-zinc-200 dark:bg-zinc-800" />

            <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
              <div className="text-center">
                <div className="w-10 h-10 theme-accent-bg rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Clock size={18} className="text-black" />
                </div>
                <h3 className="text-base font-medium mb-1 uppercase tracking-[0.2em]">{t.date}</h3>
                <p className="text-xs opacity-60 uppercase tracking-widest">{t.time}</p>
              </div>
              
              <div className="w-full max-w-[280px]">
                <Countdown />
              </div>
            </div>
          </motion.div>
        </section>

        <LocationSection />

        <RSVP />

      </main>

      {/* Footer */}
      <footer className="py-12 text-center opacity-40">
        <p className="text-[10px] uppercase tracking-[0.3em] mb-2">Class of 2026</p>
        <p className="text-[10px] uppercase tracking-widest">&copy; 2026 {t.heroName}</p>
      </footer>
    </div>
  );
};
