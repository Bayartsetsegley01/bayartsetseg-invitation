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

// 3 cards visible in a stack — front card on top, back cards peek behind
const slotStyle = (slot: number) => {
  if (slot === 0) return { rotate: -1.5, scale: 1,    x: 0,  y: 0,  opacity: 1 };
  if (slot === 1) return { rotate:  5.5, scale: 0.97, x: 10, y: 10, opacity: 1 };
  if (slot === 2) return { rotate: -4,   scale: 0.93, x: 18, y: 18, opacity: 1 };
  return              { rotate: -5,   scale: 0.90, x: 22, y: 22, opacity: 0 };
};

export const StackedGallery = () => {
  const { t } = useLanguage();

  // Full deck: order[0] = front, order[1] = middle, order[2] = back, rest = hidden queue
  // Cycling: front card goes to end of queue, everyone shifts up
  const [deck, setDeck] = useState<number[]>(() => photos.map((_, i) => i));

  const goNext = () => {
    setDeck(prev => [...prev.slice(1), prev[0]]); // send front → back of queue
  };

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
      className="w-full flex flex-col items-center gap-8 py-4"
    >
      {/* Card stack */}
      <div style={{ position: 'relative', width: CARD_W + 28, height: CARD_H + 28 }}>


        {deck.map((photoIdx, slot) => {
          const s = slotStyle(slot);
          const isFront = slot === 0;

          // z-index: front card on top while it "goes around" to the back.
          // Exiting card keeps its z above the remaining stack so it's visible sliding to back.
          const zIndex = slot === 0 ? 12 : slot === 1 ? 11 : slot === 2 ? 10 : 0;

          return (
            <motion.div
              key={photoIdx}
              // animate drives position for ALL deck cards (hidden queue cards just sit invisible)
              animate={{
                rotate: s.rotate,
                scale:  s.scale,
                x:      s.x,
                y:      s.y,
                opacity: s.opacity,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 28,
                mass: 0.85,
                // front card exiting to back: slightly faster so it feels snappy
                opacity: { duration: 0.25 },
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
                overflow: 'hidden',
                cursor: isFront ? 'grab' : 'default',
                zIndex,
                touchAction: 'none',
                willChange: 'transform, opacity',
                boxShadow: slot === 0
                  ? '0 24px 64px rgba(0,0,0,0.22), 0 6px 20px rgba(0,0,0,0.10)'
                  : slot === 1
                  ? '0 12px 32px rgba(0,0,0,0.13)'
                  : slot === 2
                  ? '0 6px 18px rgba(0,0,0,0.08)'
                  : 'none',
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
      </div>

      {/* Pagination dots */}
      <div className="flex items-center gap-[7px]">
        {photos.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            animate={{
              width: i === frontPhoto ? 28 : 8,
              backgroundColor: i === frontPhoto ? '#1c1c1c' : '#d0d0d0',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            style={{
              height: 8, borderRadius: 4, border: 'none',
              padding: 0, cursor: 'pointer', flexShrink: 0,
            }}
            aria-label={`Photo ${i + 1}`}
          />
        ))}
      </div>

    </motion.section>
  );
};
