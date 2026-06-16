import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

const photoPool = [
  "https://images.unsplash.com/photo-1618355776464-8666794d2520?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBncmFkdWF0aW9uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzgxNTg3NzkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1623461487986-9400110de28e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VyZW1vbnklMjBmZW1hbGV8ZW58MXx8fHwxNzgxNTg3NzkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1621274790572-7c32596bc67f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwZmVtYWxlJTIwc3R1ZGVudHxlbnwxfHx8fDE3ODE1ODc3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMGdyYWR1YXRpb258ZW58MXx8fHwxNzgxNTg3Nzk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZ3JhZHVhdGlvbnxlbnwxfHx8fDE3ODE1ODc3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1525926472898-144a9561b369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aXRvbiUyMGhhdHxlbnwxfHx8fDE3ODE1ODc3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1565022536102-f7645c84354a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZlbWFsZSUyMGdyYWR1YXRlfGVudzF8fHx8MTc4MTU4Nzc5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1511629091441-ee46146481b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbnxlbnwxfHx8fDE3ODE1ODc3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
];

// Bottom card → top card (index 4 is the top/front card)
const stackConfig = [
  { rotate: -6, x: -14, y: 10, shadow: '0 4px 12px rgba(0,0,0,0.10)' },
  { rotate: 4,  x: 10,  y: -8,  shadow: '0 4px 14px rgba(0,0,0,0.12)' },
  { rotate: -3, x: -6,  y: 6,  shadow: '0 5px 16px rgba(0,0,0,0.13)' },
  { rotate: 3,  x: 8,   y: -4,  shadow: '0 6px 18px rgba(0,0,0,0.14)' },
  { rotate: -1, x: 0,   y: 0,   shadow: '0 8px 30px rgba(0,0,0,0.18)' },
];

export const StackedGallery = () => {
  const { t } = useLanguage();
  const [topPhotoIdx, setTopPhotoIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    setTopPhotoIdx(prev => (prev + 1) % photoPool.length);
  };

  // Build the stack: top card uses topPhotoIdx, cards below use preceding indices
  const stackPhotos = stackConfig.map((_, layerIdx) => {
    const offset = stackConfig.length - 1 - layerIdx; // 4,3,2,1,0 (top is 0 offset)
    return photoPool[(topPhotoIdx + offset) % photoPool.length];
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="w-full flex flex-col items-center gap-10 py-4"
    >
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] opacity-50 mb-2">{t.stackedGalleryLabel}</p>
        <h2 className="text-2xl sm:text-3xl font-light tracking-wide">{t.stackedGalleryTitle}</h2>
      </div>

      <div
        className="relative cursor-pointer select-none"
        style={{ width: 210, height: 270 }}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="button"
        aria-label="Click to see next photo"
      >
        {stackConfig.map((cfg, layerIdx) => {
          const isTop = layerIdx === stackConfig.length - 1;
          return (
            <motion.div
              key={layerIdx}
              className="absolute inset-0"
              style={{ zIndex: layerIdx + 1 }}
              animate={{
                rotate: cfg.rotate,
                x: cfg.x,
                y: isTop && hovered ? cfg.y - 26 : cfg.y,
                scale: isTop && hovered ? 1.04 : 1,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              {/* Polaroid frame */}
              <div
                className="w-full h-full flex flex-col rounded-sm overflow-hidden"
                style={{
                  background: '#ffffff',
                  boxShadow: cfg.shadow,
                  padding: '10px 10px 36px 10px',
                }}
              >
                <div className="flex-1 overflow-hidden bg-zinc-100 rounded-sm">
                  <ImageWithFallback
                    src={stackPhotos[layerIdx]}
                    alt={`Graduation memory ${layerIdx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Polaroid caption area */}
                {isTop && (
                  <div className="flex items-center justify-center mt-1" style={{ height: 26 }}>
                    <span className="text-[9px] tracking-[0.25em] uppercase opacity-40 font-light" style={{ fontFamily: 'Georgia, serif' }}>
                      class of 2026
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[9px] uppercase tracking-[0.3em] opacity-35">{t.stackedGalleryHint}</p>
    </motion.section>
  );
};
