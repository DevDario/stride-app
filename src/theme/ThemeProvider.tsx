import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { tokens } from './tokens';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  colors: typeof tokens.colors.light;
  spacing: typeof tokens.spacing;
  radii: typeof tokens.radii;
  typography: typeof tokens.typography;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const scheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(
    scheme === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    setTheme(scheme === 'dark' ? 'dark' : 'light');
  }, [scheme]);

  const isDark = theme === 'dark';
  const colors = isDark ? tokens.colors.dark : tokens.colors.light;

  const value: ThemeContextValue = {
    theme,
    isDark,
    colors,
    spacing: tokens.spacing,
    radii: tokens.radii,
    typography: tokens.typography,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
