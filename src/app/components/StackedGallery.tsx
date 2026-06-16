import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

const photos = [
  "https://images.unsplash.com/photo-1618355776464-8666794d2520?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBncmFkdWF0aW9uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzgxNTg3NzkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1623461487986-9400110de28e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VyZW1vbnklMjBmZW1hbGV8ZW58MXx8fHwxNzgxNTg3NzkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1621274790572-7c32596bc67f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwZmVtYWxlJTIwc3R1ZGVudHxlbnwxfHx8fDE3ODE1ODc3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMGdyYWR1YXRpb258ZW58MXx8fHwxNzgxNTg3Nzk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZ3JhZHVhdGlvbnxlbnwxfHx8fDE3ODE1ODc3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1525926472898-144a9561b369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aXRvbiUyMGhhdHxlbnwxfHx8fDE3ODE1ODc3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1565022536102-f7645c84354a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZlbWFsZSUyMGdyYWR1YXRlfGVudzF8fHx8MTc4MTU4Nzc5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1511629091441-ee46146481b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbnxlbnwxfHx8fDE3ODE1ODc3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
];

const CARD_W = 248;
const CARD_H = 352;
const RADIUS = 28;
const GOLD   = '#C9A84C';
const CREAM  = '#F5ECD7';

// Visual position for each slot: 0 = front, 1 = mid, 2 = back, 3+ = hidden
const slotStyle = (slot: number) => {
  if (slot === 0) return { rotate: -1.5, scale: 1,    x: 0,  y: 0,  opacity: 1 };
  if (slot === 1) return { rotate:  5.5, scale: 0.97, x: 10, y: 10, opacity: 1 };
  if (slot === 2) return { rotate: -4,   scale: 0.93, x: 18, y: 18, opacity: 1 };
  return              { rotate: -5,   scale: 0.90, x: 22, y: 22, opacity: 0 };
};

export const StackedGallery = () => {
  const { t } = useLanguage();

  // Full deck — all photos always in memory; slot 0 = front, slots 3+ = hidden queue
  const [deck, setDeck] = useState<number[]>(() => photos.map((_, i) => i));

  const goNext = () => setDeck(prev => [...prev.slice(1), prev[0]]);

  const goTo = (photoIdx: number) => {
    setDeck(prev => {
      const i = prev.indexOf(photoIdx);
      if (i <= 0) return prev;
      return [...prev.slice(i), ...prev.slice(0, i)];
    });
  };

  const frontPhoto = deck[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="w-full flex flex-col items-center gap-10 py-4"
    >
      {/* Section heading */}
      <div className="text-center">
        <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.45, marginBottom: 6 }}>
          {t.stackedGalleryLabel}
        </p>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 400, letterSpacing: '0.05em' }}>
          {t.stackedGalleryTitle}
        </h2>
      </div>

      {/* Card stack container */}
      <div style={{ position: 'relative', width: CARD_W + 32, height: CARD_H + 32 }}>

        {/* Ambient glow — adapts to theme bg color */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '44%',
          transform: 'translate(-50%,-50%)',
          width: CARD_W + 200, height: CARD_H + 160,
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {deck.map((photoIdx, slot) => {
          const s = slotStyle(slot);
          const isFront = slot === 0;
          const zIndex = slot === 0 ? 12 : slot === 1 ? 11 : slot === 2 ? 10 : 0;

          return (
            <motion.div
              key={photoIdx}
              animate={{ rotate: s.rotate, scale: s.scale, x: s.x, y: s.y, opacity: s.opacity }}
              transition={{
                type: 'spring', stiffness: 300, damping: 28, mass: 0.85,
                opacity: { duration: 0.22 },
              }}
              drag={isFront ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x < -55 || info.velocity.x < -450) goNext();
              }}
              onClick={isFront ? goNext : undefined}
              whileTap={isFront ? { scale: 0.985 } : undefined}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: CARD_W, height: CARD_H,
                borderRadius: RADIUS,
                // Overflow NOT hidden here — so ornate corner flourishes aren't clipped
                overflow: 'visible',
                cursor: isFront ? 'grab' : 'default',
                zIndex,
                touchAction: 'none',
                willChange: 'transform, opacity',
                // Ornate frame for front card — gold ring + cream padding ring
                boxShadow: isFront
                  ? `0 0 0 9px ${CREAM}, 0 0 0 10px ${GOLD}88, 0 0 0 12px ${CREAM}55, 0 28px 70px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.15)`
                  : slot === 1
                  ? '0 14px 36px rgba(0,0,0,0.18)'
                  : slot === 2
                  ? '0 6px 18px rgba(0,0,0,0.12)'
                  : 'none',
              }}
            >
              {/* Photo — clipped inside rounded rect, grayscale+sepia filter */}
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: RADIUS, overflow: 'hidden',
              }}>
                <ImageWithFallback
                  src={photos[photoIdx]}
                  alt={`Photo ${photoIdx + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                  style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                    filter: 'grayscale(100%) sepia(18%) contrast(1.05) brightness(0.95)',
                  }}
                />
                {/* Subtle vignette overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)',
                  pointerEvents: 'none',
                }} />
              </div>

              {/* Ornate gold corner flourishes — only on front card */}
              {isFront && (
                <>
                  {[
                    { top: 10, left: 10 },
                    { top: 10, right: 10 },
                    { bottom: 10, left: 10 },
                    { bottom: 10, right: 10 },
                  ].map((pos, i) => (
                    <span key={i} style={{
                      position: 'absolute', ...pos,
                      color: GOLD,
                      fontSize: 15,
                      lineHeight: 1,
                      pointerEvents: 'none',
                      zIndex: 5,
                      textShadow: `0 0 10px ${GOLD}80`,
                      opacity: 0.85,
                    }}>✦</span>
                  ))}
                  {/* "Class of 2026" caption at bottom of front card */}
                  <div style={{
                    position: 'absolute', bottom: 16, left: 0, right: 0,
                    textAlign: 'center', pointerEvents: 'none', zIndex: 5,
                    fontFamily: 'Playfair Display, serif',
                    fontStyle: 'italic',
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    color: CREAM,
                    opacity: 0.65,
                    textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                  }}>
                    class of 2026
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Pagination dots */}
      <div className="flex items-center gap-[7px]">
        {photos.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            animate={{
              width: i === frontPhoto ? 28 : 8,
              backgroundColor: i === frontPhoto ? GOLD : '#6b6b6b',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            style={{ height: 8, borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}
            aria-label={`Photo ${i + 1}`}
          />
        ))}
      </div>

      <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.28, marginTop: -12 }}>
        {t.stackedGalleryHint}
      </p>
    </motion.section>
  );
};
