"use client";

import { useState, useEffect } from 'react';
import { UseSystemThemeReturn } from '../types';
import { 
  getSystemTheme, 
  createSystemThemeListener 
} from '../utils/systemTheme';

/**
 * Hook for detecting and responding to system theme preference changes
 * 
 * @returns {UseSystemThemeReturn} System theme information
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { systemTheme, isSystemDarkMode } = useSystemTheme();
 *   
 *   return (
 *     <div>
 *       <p>Your system prefers: {systemTheme} mode</p>
 *       {isSystemDarkMode ? (
 *         <span>🌙 Dark mode active</span>
 *       ) : (
 *         <span>☀️ Light mode active</span>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useSystemTheme = (): UseSystemThemeReturn => {
  // Get initial system theme
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' ? getSystemTheme() : 'light'
  );
  
  // Listen for system theme changes
  useEffect(() => {
    // Set initial theme to ensure SSR consistency
    setSystemTheme(getSystemTheme());
    
    // Create listener for theme changes
    const cleanup = createSystemThemeListener((isDark) => {
      setSystemTheme(isDark ? 'dark' : 'light');
    });
    
    return cleanup;
  }, []);
  
  return {
    systemTheme,
    isSystemDarkMode: systemTheme === 'dark',
    isSystemLightMode: systemTheme === 'light'
  };
};

export default useSystemTheme;