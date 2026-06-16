import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'burgundy' | 'light' | 'dark' | 'pink';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const CYCLE: Theme[] = ['burgundy', 'light', 'dark', 'pink'];

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('burgundy');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'pink', 'burgundy');
    if (theme !== 'light') root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const idx = CYCLE.indexOf(prev);
      return CYCLE[(idx + 1) % CYCLE.length];
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
