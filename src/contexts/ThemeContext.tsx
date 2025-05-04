
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { logUserActivity } from '@/lib/adminAuth';

export interface FontOption {
  value: string;
  label: string;
  description?: string;
}

export const fontOptions: FontOption[] = [
  { value: 'minecraft', label: 'Minecraft', description: 'Default game-style font' },
  { value: 'roboto', label: 'Roboto', description: 'Clean modern font' },
  { value: 'poppins', label: 'Poppins', description: 'Rounded friendly font' },
  { value: 'pixel', label: 'Pixel', description: '8-bit retro style font' }
];

interface ThemeContextType {
  fontFamily: string;
  setFontFamily: (font: string) => void;
  availableFonts: FontOption[];
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
  const [fontFamily, setFontFamily] = useState<string>(() => {
    // Check localStorage first, then use default
    const savedFont = localStorage.getItem('enderhost-font');
    return savedFont || defaultFont;
  });

  // Save font preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('enderhost-font', fontFamily);
  }, [fontFamily]);

  const handleSetFontFamily = (font: string) => {
    setFontFamily(font);
    // Log activity if available (won't run during initial load)
    try {
      logUserActivity(`Changed font to ${font}`);
    } catch (error) {
      // Ignore errors during initial load or when adminAuth is not available
    }
  };

  const value = {
    fontFamily,
    setFontFamily: handleSetFontFamily,
    availableFonts: fontOptions
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`font-${fontFamily}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
