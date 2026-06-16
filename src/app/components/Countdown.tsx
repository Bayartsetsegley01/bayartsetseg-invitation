import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const Countdown = () => {
  const { t } = useLanguage();
  const targetDate = new Date('2026-06-22T10:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const Item = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center justify-center p-2 sm:p-3 theme-card border rounded-2xl shadow-lg shadow-black/5 flex-1 min-w-0">
      <span className="text-xl sm:text-3xl font-light theme-text mb-1">{value}</span>
      <span className="text-[8px] sm:text-xs opacity-50 uppercase tracking-wider sm:tracking-widest truncate w-full text-center">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-between sm:justify-center gap-2 sm:gap-3 w-full flex-nowrap">
      <Item value={timeLeft.days} label={t.countdownDays} />
      <Item value={timeLeft.hours} label={t.countdownHours} />
      <Item value={timeLeft.minutes} label={t.countdownMinutes} />
      <Item value={timeLeft.seconds} label={t.countdownSeconds} />
    </div>
  );
};
