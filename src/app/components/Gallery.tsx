import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  "https://images.unsplash.com/photo-1511629091441-ee46146481b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbnxlbnwxfHx8fDE3ODE1ODc3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
];

export const Gallery = () => {
  const { t } = useLanguage();
  
  // Track which photo index from the pool is currently shown in each of the 4 slots
  const [slotIndices, setSlotIndices] = useState([0, 1, 2, 3]);

  const handleSwap = (slotIndex: number) => {
    setSlotIndices(prev => {
      const next = [...prev];
      // Move to the next available photo that is not currently shown in any slot
      let nextPhotoIndex = (next[slotIndex] + 1) % photoPool.length;
      while (next.includes(nextPhotoIndex)) {
        nextPhotoIndex = (nextPhotoIndex + 1) % photoPool.length;
      }
      next[slotIndex] = nextPhotoIndex;
      return next;
    });
  };

  return (
    <div className="w-full mt-4 mb-16">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {slotIndices.map((photoIndex, slotIndex) => (
          <motion.div
            key={slotIndex}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: slotIndex * 0.1 }}
            onClick={() => handleSwap(slotIndex)}
            className={`relative rounded-2xl overflow-hidden shadow-lg group w-full aspect-[3/4] cursor-pointer ${slotIndex % 2 === 0 ? 'mt-4 sm:mt-8' : ''}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={photoIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full"
              >
                <ImageWithFallback
                  src={photoPool[photoIndex]}
                  alt={`Gallery slot ${slotIndex}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
