import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const Calendar = () => {
  const { t } = useLanguage();

  const days = t.weekDays;
  const monthDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const graduationDay = 22;

  return (
    <div className="w-full max-w-xs mx-auto text-center">
      <h2 className="text-base font-medium theme-text mb-6 uppercase tracking-[0.2em]">
        {t.calendarTitle}
      </h2>
      
      <div className="p-2">
        <h3 className="text-xs font-medium theme-text mb-4 uppercase tracking-widest opacity-60">
          {t.monthYear}
        </h3>
        
        <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-xs">
          {days.map(day => (
            <div key={day} className="opacity-40 font-medium">{day}</div>
          ))}
          
          {monthDays.map(day => {
            const isGraduation = day === graduationDay;
            return (
              <div 
                key={day} 
                className={`relative flex items-center justify-center h-8 w-8 mx-auto rounded-full transition-all duration-300
                  ${isGraduation 
                    ? 'theme-accent-bg text-black font-semibold shadow-md scale-110' 
                    : 'theme-text hover:opacity-70 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer'
                  }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
