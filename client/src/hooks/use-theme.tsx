import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeId, themes, defaultTheme, ThemeConfig } from '@/lib/themes';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  themeId: ThemeId;
  setTheme: (themeId: ThemeId) => void;
  customColors: {
    primary?: string;
    accent?: string;
    font?: string;
  };
  updateCustomColors: (colors: Partial<ThemeContextType['customColors']>) => void;
  resetTheme: () => void;
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
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('orbitdeck-theme');
    return (saved && saved in themes) ? saved as ThemeId : 'military';
  });

  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem('orbitdeck-custom-colors');
    return saved ? JSON.parse(saved) : {};
  });

  const currentTheme = {
    ...themes[themeId],
    ...(customColors.primary && { primary: customColors.primary }),
    ...(customColors.accent && { accent: customColors.accent }),
    ...(customColors.font && { font: customColors.font })
  };

  const setTheme = (newThemeId: ThemeId) => {
    setThemeId(newThemeId);
    localStorage.setItem('orbitdeck-theme', newThemeId);
  };

  const updateCustomColors = (colors: Partial<ThemeContextType['customColors']>) => {
    const newColors = { ...customColors, ...colors };
    setCustomColors(newColors);
    localStorage.setItem('orbitdeck-custom-colors', JSON.stringify(newColors));
  };

  const resetTheme = () => {
    setCustomColors({});
    localStorage.removeItem('orbitdeck-custom-colors');
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Set data attribute for theme-specific CSS targeting
    document.body.setAttribute('data-theme', themeId);
    
    // Apply CSS custom properties
    root.style.setProperty('--theme-background', currentTheme.background);
    root.style.setProperty('--theme-surface', currentTheme.surface);
    root.style.setProperty('--theme-primary', currentTheme.primary);
    root.style.setProperty('--theme-secondary', currentTheme.secondary);
    root.style.setProperty('--theme-accent', currentTheme.accent);
    root.style.setProperty('--theme-text', currentTheme.text);
    root.style.setProperty('--theme-text-muted', currentTheme.textMuted);
    root.style.setProperty('--theme-glow', currentTheme.effects.glow);
    root.style.setProperty('--theme-shadow', currentTheme.effects.shadow);
    root.style.setProperty('--theme-border', currentTheme.effects.border);
    root.style.setProperty('--theme-hover', currentTheme.effects.hover);

    // Apply font families
    root.style.setProperty('--theme-font', currentTheme.font);
    root.style.setProperty('--theme-font-display', currentTheme.fontDisplay);

    // Update Tailwind classes
    root.className = `theme-${themeId}`;
    
  }, [themeId, currentTheme]);

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      themeId,
      setTheme,
      customColors,
      updateCustomColors,
      resetTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}