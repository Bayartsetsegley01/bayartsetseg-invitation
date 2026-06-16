import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
const RADIUS = 32;

// Front → back, index 0 is the top card
const STACK = [
  { rotate: -1.5, scale: 1,    x: 0,  y: 0,  z: 12, shadow: '0 24px 64px rgba(0,0,0,0.22), 0 6px 20px rgba(0,0,0,0.10)' },
  { rotate:  5.5, scale: 0.97, x: 8,  y: 8,  z: 11, shadow: '0 12px 32px rgba(0,0,0,0.13)' },
  { rotate: -4,   scale: 0.93, x: 14, y: 16, z: 10, shadow: '0 6px 18px rgba(0,0,0,0.08)' },
];

// New card enters from behind the back card
const NEW_CARD_INITIAL = { rotate: -7, scale: 0.87, x: 20, y: 24, opacity: 0 };

// Front card "goes around to the back" — moves right+down+shrinks, looks like going behind the pile
const SEND_TO_BACK = {
  x: 26,
  y: 22,
  scale: 0.82,
  rotate: -6,
  opacity: 0,
  zIndex: 0,
  transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
};

export const StackedGallery = () => {
  const { t } = useLanguage();

  // stack[0] = front photo, stack[1] = middle, stack[2] = back
  const [stack, setStack] = useState<number[]>([0, 1, 2]);

  const goNext = () => {
    setStack(prev => {
      const newBack = (prev[prev.length - 1] + 1) % photos.length;
      return [...prev.slice(1), newBack];
    });
  };

  const goToPhoto = (idx: number) => {
    setStack([idx, (idx + 1) % photos.length, (idx + 2) % photos.length]);
  };

  const frontPhoto = stack[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="w-full flex flex-col items-center gap-8 py-4"
    >
      {/* Header */}
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] opacity-50 mb-2">{t.stackedGalleryLabel}</p>
        <h2 className="text-2xl sm:text-3xl font-light tracking-wide">{t.stackedGalleryTitle}</h2>
      </div>

      {/* Card stack */}
      <div style={{ position: 'relative', width: CARD_W + 24, height: CARD_H + 24 }}>

        {/* Soft radial glow */}
        <div style={{
          position: 'absolute',
          top: '55%', left: '45%',
          transform: 'translate(-50%, -50%)',
          width: CARD_W + 180,
          height: CARD_H + 140,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 45%, transparent 72%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/*
          AnimatePresence initial={false}:
          — First render: cards just appear at their stack positions (no fan-out)
          — Later adds: new card plays its `initial` → `animate` (coming from behind) ✓
          — Removes: front card plays `exit` (flies away) ✓
        */}
        <AnimatePresence initial={false}>
          {stack.map((photoIdx, stackPos) => {
            const pos = STACK[stackPos] ?? STACK[STACK.length - 1];
            const isFront = stackPos === 0;

            return (
              <motion.div
                key={photoIdx}
                initial={NEW_CARD_INITIAL}
                animate={{
                  rotate: pos.rotate,
                  scale: pos.scale,
                  x: pos.x,
                  y: pos.y,
                  opacity: 1,
                  zIndex: pos.z,
                }}
                exit={SEND_TO_BACK}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 28,
                  mass: 0.85,
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
                  top: 0,
                  left: 0,
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: RADIUS,
                  overflow: 'hidden',
                  cursor: isFront ? 'grab' : 'default',
                  boxShadow: pos.shadow,
                  touchAction: 'none',
                  willChange: 'transform',
                }}
              >
                <ImageWithFallback
                  src={photos[photoIdx]}
                  alt={`Photo ${photoIdx + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center gap-[7px]">
        {photos.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goToPhoto(i)}
            animate={{
              width: i === frontPhoto ? 28 : 8,
              backgroundColor: i === frontPhoto ? '#1c1c1c' : '#d0d0d0',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            style={{
              height: 8,
              borderRadius: 4,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              flexShrink: 0,
            }}
            aria-label={`Photo ${i + 1}`}
          />
        ))}
      </div>

      <p className="text-[9px] uppercase tracking-[0.3em] opacity-30 -mt-4">{t.stackedGalleryHint}</p>
    </motion.section>
  );
};
