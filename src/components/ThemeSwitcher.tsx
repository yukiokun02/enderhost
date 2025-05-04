
import React from 'react';
import { useTheme, FontOption } from '@/contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Paintbrush } from 'lucide-react';

interface ThemeSwitcherProps {
  variant?: 'default' | 'compact';
  showLabel?: boolean;
}

export default function ThemeSwitcher({ variant = 'default', showLabel = true }: ThemeSwitcherProps) {
  const { fontFamily, setFontFamily, availableFonts } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className={`${variant === 'compact' ? 'text-xs' : 'text-sm'} flex items-center gap-1`}>
          <Paintbrush className="h-3.5 w-3.5" />
          {variant !== 'compact' && 'Font:'}
        </span>
      )}
      <Select value={fontFamily} onValueChange={setFontFamily}>
        <SelectTrigger className={`${variant === 'compact' ? 'w-[120px] h-8 text-xs' : 'w-[150px]'}`}>
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          {availableFonts.map((font) => (
            <SelectItem 
              key={font.value} 
              value={font.value}
              className={`font-${font.value}`}
            >
              <div className="flex justify-between items-center w-full">
                <span>{font.label}</span>
                {fontFamily === font.value && <Check className="h-4 w-4 ml-2 text-green-500" />}
              </div>
              {font.description && (
                <span className="text-xs text-muted-foreground block">
                  {font.description}
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
