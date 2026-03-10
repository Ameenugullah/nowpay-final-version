import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { APP_CONFIG } from '@/utils/constants';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(APP_CONFIG.THEME_KEY) || 'dark'; }
    catch { return 'dark'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(APP_CONFIG.THEME_KEY, theme); } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const setThemeMode = useCallback((mode) => {
    setTheme(mode);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeMode, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
