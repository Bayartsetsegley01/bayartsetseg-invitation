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

const CARD_W = 252;
const CARD_H = 352;
const RADIUS = 34;

type Dir = 1 | -1;

const cardVariants = {
  enter: (dir: Dir) => ({
    x: dir * 320,
    rotate: dir * 10,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    rotate: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: Dir) => ({
    x: dir * -320,
    rotate: dir * -10,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.25, ease: 'easeIn' },
  }),
};

export const StackedGallery = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<Dir>(1);

  const navigate = (d: Dir) => {
    setDir(d);
    setCurrent(prev => (prev + d + photos.length) % photos.length);
  };

  const goTo = (i: number) => {
    setDir(i >= current ? 1 : -1);
    setCurrent(i);
  };

  const backIdx = (current + 1) % photos.length;

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
      <div
        style={{
          position: 'relative',
          width: CARD_W + 36,
          height: CARD_H + 24,
        }}
      >
        {/* Soft white radial glow behind the cards */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '40%',
            transform: 'translate(-50%, -50%)',
            width: CARD_W + 160,
            height: CARD_H + 120,
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 40%, transparent 72%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Back card — next photo, offset right */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 30,
            width: CARD_W,
            height: CARD_H,
            borderRadius: RADIUS,
            overflow: 'hidden',
            transform: 'rotate(4deg) scale(0.96)',
            zIndex: 1,
            boxShadow: '0 8px 28px rgba(0,0,0,0.10)',
          }}
        >
          <ImageWithFallback
            src={photos[backIdx]}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Front card — draggable, animated */}
        <AnimatePresence custom={dir} mode="popLayout">
          <motion.div
            key={current}
            custom={dir}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 28,
              mass: 0.8,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -500) navigate(1);
              else if (info.offset.x > 60 || info.velocity.x > 500) navigate(-1);
            }}
            onClick={() => navigate(1)}
            whileTap={{ cursor: 'grabbing', scale: 0.98 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: CARD_W,
              height: CARD_H,
              borderRadius: RADIUS,
              overflow: 'hidden',
              zIndex: 2,
              cursor: 'grab',
              boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 6px 24px rgba(0,0,0,0.10)',
              userSelect: 'none',
            }}
          >
            <ImageWithFallback
              src={photos[current]}
              alt={`Photo ${current + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
              style={{ pointerEvents: 'none' }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center gap-[7px]">
        {photos.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            animate={{
              width: i === current ? 28 : 8,
              backgroundColor: i === current ? '#1c1c1c' : '#d0d0d0',
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
