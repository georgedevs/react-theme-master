"use client";

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { UseThemeReturn } from '../types';

/**
 * Hook for accessing and controlling the current theme
 * 
 * @returns {UseThemeReturn} Theme control functions and current theme
 * @throws {Error} If used outside of ThemeProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, setTheme, availableThemes } = useTheme();
 *   
 *   return (
 *     <div>
 *       <p>Current theme: {theme}</p>
 *       <button onClick={() => setTheme('dark')}>Dark Mode</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useTheme = (): UseThemeReturn => {
  const context = useContext(ThemeContext);
  
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default useTheme;