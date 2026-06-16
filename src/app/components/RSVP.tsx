import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

export const RSVP = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [noClicks, setNoClicks] = useState(0);
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const MAX_NO_CLICKS = 3;

  const handleNoHover = () => {
    if (noClicks < MAX_NO_CLICKS && noButtonRef.current) {
      const x = Math.random() * 150 - 75;
      const y = Math.random() * 150 - 75;
      noButtonRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  const handleNoClick = (e: React.MouseEvent) => {
    if (noClicks < MAX_NO_CLICKS) {
      e.preventDefault();
      setNoClicks((prev) => prev + 1);
      handleNoHover();
    } else {
      setAttending(false);
    }
  };

  const handleYesClick = () => {
    setAttending(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F8D7E3', '#ffffff', '#000000']
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-md mx-auto py-16 px-6 relative z-10">
      <div className="theme-card border rounded-3xl p-8 shadow-2xl shadow-black/5">
        
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-semibold theme-text mb-2 uppercase tracking-widest">
                  {t.rsvpTitle}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent theme-text focus:outline-none focus:ring-1 focus:ring-current transition-all text-sm"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-semibold theme-text uppercase tracking-widest">
                  {t.rsvpQuestion}
                </label>
                
                {attending === null && (
                  <div className="flex gap-4 items-center justify-center pt-2 h-20 relative">
                    <button
                      type="button"
                      onClick={handleYesClick}
                      className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm font-medium hover:scale-105 transition-transform"
                    >
                      {t.rsvpYes}
                    </button>
                    
                    <button
                      type="button"
                      ref={noButtonRef}
                      onMouseEnter={handleNoHover}
                      onClick={handleNoClick}
                      className="px-6 py-2 theme-accent-bg text-black rounded-full text-sm font-medium transition-all duration-300 absolute right-4 sm:right-12 min-w-[80px]"
                    >
                      {noClicks === 0 ? t.rsvpNo : t.noMessages[Math.min(noClicks - 1, t.noMessages.length - 1)]}
                    </button>
                  </div>
                )}

                {attending === false && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-xs font-semibold theme-text mb-2 uppercase tracking-widest">
                      {t.whyNot}
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent theme-text focus:outline-none focus:ring-1 focus:ring-current transition-all resize-none h-20 text-sm"
                    />
                  </motion.div>
                )}
              </div>

              {(attending !== null) && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="pt-2 flex justify-between items-center"
                >
                  <button
                    type="button"
                    onClick={() => { setAttending(null); setNoClicks(0); }}
                    className="text-xs opacity-50 hover:opacity-100 uppercase tracking-widest"
                  >
                    Буцах / Back
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      !name.trim() 
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed' 
                        : 'theme-accent-bg text-black hover:scale-105'
                    }`}
                  >
                    {t.submit}
                  </button>
                </motion.div>
              )}
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto theme-accent-bg rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-lg font-medium theme-text">
                {t.thankYou}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
