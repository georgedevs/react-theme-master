"use client";

import React from 'react';
import { ThemeProviderProps } from '../types';
import { ThemeProvider as ContextProvider } from '../context/ThemeContext';

/**
 * ThemeProvider component
 * Wraps application to provide theme context
 * 
 * @param {ThemeProviderProps} props - Provider props
 * @returns {JSX.Element} Provider component
 * 
 * @example
 * ```tsx
 * // Basic usage with default themes
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * 
 * // With custom options
 * <ThemeProvider 
 *   options={{
 *     initialTheme: 'dark',
 *     storageType: 'session',
 *     followSystemPreference: true,
 *     themes: {
 *       // Custom themes
 *       customTheme: {
 *         primary: 'bg-yellow-500',
 *         // ... other properties
 *       }
 *     }
 *   }}
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, options }) => {
  return (
    <ContextProvider options={options}>
      {children}
    </ContextProvider>
  );
};

export default ThemeProvider;