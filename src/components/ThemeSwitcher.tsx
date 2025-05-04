
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FontOption {
  value: string;
  label: string;
}

const fontOptions: FontOption[] = [
  { value: 'minecraft', label: 'Minecraft' },
  // Add more font options here as needed
];

export default function ThemeSwitcher() {
  const { fontFamily, setFontFamily } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Font:</span>
      <Select value={fontFamily} onValueChange={setFontFamily}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          {fontOptions.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
