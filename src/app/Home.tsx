import React from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import { Countdown } from './components/Countdown';
import { Calendar } from './components/Calendar';
import { StackedGallery } from './components/StackedGallery';
import { PostcardMessage } from './components/PostcardMessage';
import { RSVP } from './components/RSVP';
import { LocationSection } from './components/LocationSection';
import heroPhoto from '../imports/Screenshot_2026-06-16_at_14.13.00.png';

const SERIF = 'Cormorant Garamond, Georgia, serif';
const DISPLAY = 'Playfair Display, Georgia, serif';
const SCRIPT = 'Great Vibes, cursive';
const GOLD = '#C9A84C';
const BURGUNDY = '#8B1A1A';
const CREAM = '#F5ECD7';

/** ✦ ——— ✦ elegant section divider */
const Divider = () => (
  <div className="flex items-center justify-center gap-4 py-2 opacity-30">
    <div style={{ height: 1, width: 56, background: 'currentColor' }} />
    <span style={{ fontSize: 13, color: 'currentColor' }}>✦</span>
    <div style={{ height: 1, width: 56, background: 'currentColor' }} />
  </div>
);

export const Home = () => {
  const { lang, t, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="min-h-screen theme-bg theme-text transition-colors duration-500"
      style={{ fontFamily: SERIF, lineHeight: 1.8 }}
    >
      {/* ── Navigation ── */}
      <nav className="fixed top-0 w-full p-5 flex justify-end gap-3 z-50 pointer-events-none">
        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={toggleLang}
            className="w-10 h-10 rounded-full theme-card border shadow-sm flex items-center justify-center hover:scale-105 transition-transform"
          >
            <span style={{ fontSize: 9, letterSpacing: '0.15em', fontFamily: 'Montserrat, sans-serif' }} className="uppercase font-medium">
              {lang === 'mn' ? 'EN' : 'MN'}
            </span>
          </button>
          <button
            onClick={toggleTheme}
            className="h-10 px-4 rounded-full theme-card border shadow-sm flex items-center justify-center hover:scale-105 transition-transform"
            style={{ fontSize: 9, letterSpacing: '0.12em', fontFamily: 'Montserrat, sans-serif' }}
          >
            <span className="uppercase font-medium">{theme}</span>
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          HERO — full viewport
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background photo + overlay */}
        <div className="absolute inset-0">
          <img
            src={heroPhoto}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.35) saturate(0.6)' }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(28, 8, 8, 0.60)' }} />
        </div>

        {/* Ornate invitation card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center mx-4 w-full"
          style={{
            maxWidth: 460,
            background: CREAM,
            borderRadius: '2.5rem',
            padding: 'clamp(2.5rem, 6vw, 3.5rem) clamp(2rem, 5vw, 3rem)',
            boxShadow: `0 0 0 1px ${GOLD}, 0 0 0 4px ${CREAM}, 0 0 0 5px ${GOLD}55, 0 50px 100px rgba(0,0,0,0.6)`,
          }}
        >
          {/* Top label — Playfair italic */}
          <p style={{
            fontFamily: DISPLAY,
            fontStyle: 'italic',
            fontSize: 11,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: BURGUNDY,
            opacity: 0.8,
            marginBottom: 20,
          }}>
            {t.heroTitle}
          </p>

          {/* Gold flourish */}
          <div style={{ color: GOLD, fontSize: 18, letterSpacing: 12, marginBottom: 12, opacity: 0.75 }}>✦</div>

          {/* Graduate name — Great Vibes script */}
          <h1 style={{
            fontFamily: SCRIPT,
            fontSize: 'clamp(3.2rem, 9vw, 4.8rem)',
            color: BURGUNDY,
            lineHeight: 1.15,
            marginBottom: 4,
          }}>
            Баярцэцэг
          </h1>

          {/* Gold rule */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '14px 0 18px' }}>
            <div style={{ height: 1, width: 44, background: GOLD, opacity: 0.7 }} />
            <span style={{ color: GOLD, fontSize: 10, opacity: 0.7 }}>✦</span>
            <div style={{ height: 1, width: 44, background: GOLD, opacity: 0.7 }} />
          </div>

          {/* University */}
          <div style={{ color: '#5C2020', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 8, lineHeight: 2 }}>
            {t.heroUni.split('\n').map((line, i) => <div key={i}>{line}</div>)}
          </div>

          {/* Major */}
          <p style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 12,
            color: '#5C2020',
            letterSpacing: '0.05em',
            marginBottom: 20,
            opacity: 0.85,
          }}>
            {t.heroMajor}
          </p>

          {/* Date — Playfair */}
          <p style={{
            fontFamily: DISPLAY,
            fontStyle: 'italic',
            fontSize: 16,
            color: '#3D1515',
            letterSpacing: '0.08em',
          }}>
            {t.date}
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className="absolute bottom-8 inset-x-0 flex justify-center"
          style={{ color: CREAM, opacity: 0.35, fontSize: 18 }}
        >
          ↓
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════ */}
      <main className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">

        <Divider />

        {/* Photo Gallery */}
        <StackedGallery />

        <Divider />

        {/* Event Info — date + countdown */}
        <section className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="theme-card border rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-black/20 flex flex-col md:flex-row items-center justify-between gap-10"
          >
            <div className="flex-1 flex flex-col items-center text-center w-full">
              <Calendar />
            </div>

            <div className="hidden md:block w-px h-32" style={{ background: 'var(--card-border)' }} />
            <div className="block md:hidden h-px w-32" style={{ background: 'var(--card-border)' }} />

            <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
              <div className="text-center">
                <div className="w-10 h-10 theme-accent-bg rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Clock size={18} style={{ color: 'var(--accent-text)' }} />
                </div>
                <h3 style={{ fontFamily: DISPLAY, fontStyle: 'italic', fontSize: 15, letterSpacing: '0.15em' }}
                  className="mb-1 uppercase">
                  {t.date}
                </h3>
                <p className="text-xs opacity-60 uppercase tracking-widest">{t.time}</p>
              </div>

              <div className="w-full max-w-[280px]">
                <Countdown />
              </div>
            </div>
          </motion.div>
        </section>

        <Divider />

        <LocationSection />

        <Divider />

        <RSVP />

        <Divider />

        <PostcardMessage />

      </main>

      {/* ── Footer ── */}
      <footer className="py-14 text-center opacity-35">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ height: 1, width: 36, background: 'currentColor' }} />
          <span style={{ fontSize: 12 }}>✦</span>
          <div style={{ height: 1, width: 36, background: 'currentColor' }} />
        </div>
        <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'Montserrat, sans-serif' }}>
          Class of 2026
        </p>
        <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif' }}>
          &copy; 2026 {t.heroName}
        </p>
      </footer>
    </div>
  );
};
