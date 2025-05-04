
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  fontFamily: string;
  setFontFamily: (font: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultFont?: string;
}

export function ThemeProvider({ children, defaultFont = 'minecraft' }: ThemeProviderProps) {
  const [fontFamily, setFontFamily] = useState<string>(defaultFont);

  const value = {
    fontFamily,
    setFontFamily,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`font-${fontFamily}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
