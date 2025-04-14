"use client";

import React, { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Theme, 
  UseThemeReturn,
  ThemeProviderProps 
} from '../types';
import { 
  loadThemeFromStorage, 
  saveThemeToStorage, 
  DEFAULT_STORAGE_KEY 
} from '../utils/storage';
import { 
  normalizeThemes, 
  isValidTheme 
} from '../utils/themeValidator';
import { 
  applyThemeToCssVars, 
  setupThemeTransition 
} from '../utils/cssVariables';
import { 
  getSystemTheme, 
  createSystemThemeListener 
} from '../utils/systemTheme';
import { defaultThemes } from '../themes';

/**
 * ThemeContext provides the theme state and functions to components
 */
export const ThemeContext = createContext<UseThemeReturn | null>(null);

/**
 * Check if running in browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * ThemeProvider component manages theme state and provides context
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  options = {} 
}) => {
  const {
    initialTheme,
    themes: customThemes = {},
    fallbackTheme = 'light',
    storageKey = DEFAULT_STORAGE_KEY,
    storageType = 'local',
    followSystemPreference = false,
    transitionDuration = 300,
    onThemeChange,
    scheduleThemes = []
  } = options;
  
  // Combine and normalize themes
  const allThemes = useMemo(() => {
    return normalizeThemes({
      ...defaultThemes,
      ...customThemes
    });
  }, [customThemes]);
  
  // Make sure we have at least one theme
  if (Object.keys(allThemes).length === 0) {
    console.warn('No valid themes provided. Using default themes.');
  }
  
  // Get initial theme - priority: storage > system > initial > fallback
  const getInitialTheme = (): string => {
    // Start with fallback
    let theme = fallbackTheme;
    
    // Check if we have the theme saved in storage
    if (isBrowser && storageType !== 'none') {
      const storedTheme = loadThemeFromStorage(storageKey, storageType);
      if (storedTheme && allThemes[storedTheme]) {
        theme = storedTheme;
      }
    }
    
    // If no stored theme and should follow system preference
    else if (followSystemPreference && isBrowser) {
      const systemTheme = getSystemTheme();
      if (allThemes[systemTheme]) {
        theme = systemTheme;
      }
    }
    
    // If initialTheme is provided and valid
    else if (initialTheme && allThemes[initialTheme]) {
      theme = initialTheme;
    }
    
    // Make sure the theme exists in our themes
    return allThemes[theme] ? theme : Object.keys(allThemes)[0] || fallbackTheme;
  };
  
  // State for current theme name
  const [currentTheme, setCurrentTheme] = useState<string>(
    isBrowser ? getInitialTheme() : (initialTheme || fallbackTheme)
  );
  
  // Ensure the theme exists in our themes
  const safeThemeName = useMemo(() => {
    return allThemes[currentTheme] ? currentTheme : fallbackTheme;
  }, [currentTheme, allThemes, fallbackTheme]);
  
  // Get the current theme object
  const themeObject = useMemo<Theme>(() => {
    return allThemes[safeThemeName] || 
           allThemes[fallbackTheme] || 
           Object.values(allThemes)[0];
  }, [allThemes, safeThemeName, fallbackTheme]);
  
  // Function to set theme
  const setTheme = useCallback((themeName: string) => {
    if (!allThemes[themeName]) {
      console.warn(`Theme "${themeName}" not found, using "${fallbackTheme}" instead`);
      themeName = fallbackTheme;
    }
    
    setCurrentTheme(themeName);
    
    if (isBrowser && storageType !== 'none') {
      saveThemeToStorage(themeName, storageKey, storageType);
    }
    
    if (onThemeChange && allThemes[themeName]) {
      onThemeChange(themeName, allThemes[themeName]);
    }
  }, [allThemes, fallbackTheme, storageKey, storageType, onThemeChange]);
  
  // Function to toggle between two themes
  const toggleTheme = useCallback((themeA: string, themeB?: string) => {
    const targetTheme = currentTheme === themeA ? 
                       (themeB || (currentTheme === 'light' ? 'dark' : 'light')) : 
                       themeA;
    
    setTheme(targetTheme);
  }, [currentTheme, setTheme]);
  
  // Get a list of available theme names
  const availableThemes = useMemo(() => {
    return Object.keys(allThemes);
  }, [allThemes]);
  
  // Check if a theme is available
  const isThemeAvailable = useCallback((themeName: string) => {
    return !!allThemes[themeName];
  }, [allThemes]);
  
  // Get a specific theme property
  const getThemeProperty = useCallback((property: string) => {
    const theme = themeObject;
    
    // Handle nested properties (e.g., 'colors.primary')
    const properties = property.split('.');
    let value: any = theme;
    
    for (const prop of properties) {
      value = value?.[prop];
      if (value === undefined) return '';
    }
    
    return String(value || '');
  }, [themeObject]);
  
  // Get a specific theme class
  const getThemeClass = useCallback((property: string) => {
    const theme = themeObject;
    
    // Handle nested properties (e.g., 'colors.primary')
    const properties = property.split('.');
    let value: any = theme;
    
    // Start with colors object if first property is a known color property
    if (properties.length === 1 && theme.colors[property]) {
      return theme.colors[property];
    }
    
    for (const prop of properties) {
      value = value?.[prop];
      if (value === undefined) return '';
    }
    
    return String(value || '');
  }, [themeObject]);
  
  // Apply theme transitions
  useEffect(() => {
    if (isBrowser && transitionDuration > 0) {
      setupThemeTransition(transitionDuration);
    }
  }, [transitionDuration]);
  
  // Apply theme to document when it changes
  useEffect(() => {
    if (isBrowser && themeObject) {
      applyThemeToCssVars(themeObject);
    }
  }, [themeObject]);
  
  // Listen for system preference changes
  useEffect(() => {
    if (!isBrowser || followSystemPreference === false) return;
    
    // Only listen for changes if we should follow system preference
    // and either:
    // 1. followSystemPreference is true (always follow)
    // 2. followSystemPreference is 'initial-only' but we don't have a stored theme
    const shouldListen = followSystemPreference === true || 
                         (followSystemPreference === 'initial-only' && 
                          !loadThemeFromStorage(storageKey, storageType));
    
    if (shouldListen) {
      const cleanup = createSystemThemeListener((isDark) => {
        const newTheme = isDark ? 'dark' : 'light';
        
        // Only change if the theme exists
        if (allThemes[newTheme]) {
          setCurrentTheme(newTheme);
        }
      });
      
      return cleanup;
    }
  }, [followSystemPreference, allThemes, storageKey, storageType]);
  
  // Handle scheduled themes
  useEffect(() => {
    if (!isBrowser || scheduleThemes.length === 0) return;
    
    const updateScheduledTheme = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      // Find the scheduled theme for the current time
      for (const schedule of scheduleThemes) {
        const [fromHours, fromMinutes] = schedule.from.split(':').map(Number);
        const [toHours, toMinutes] = schedule.to.split(':').map(Number);
        
        const fromTime = fromHours * 60 + fromMinutes;
        const toTime = toHours * 60 + toMinutes;
        
        // Handle cases where the schedule crosses midnight
        const isOvernight = toTime <= fromTime;
        const isInRange = isOvernight
          ? (currentTime >= fromTime || currentTime < toTime)
          : (currentTime >= fromTime && currentTime < toTime);
        
        if (isInRange && allThemes[schedule.theme]) {
          setTheme(schedule.theme);
          return;
        }
      }
    };
    
    // Update immediately
    updateScheduledTheme();
    
    // Update every minute
    const interval = setInterval(updateScheduledTheme, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [scheduleThemes, allThemes, setTheme]);
  
  // Initialize theme on component mount
  useEffect(() => {
    if (isBrowser) {
      const initialThemeName = getInitialTheme();
      setCurrentTheme(initialThemeName);
    }
  }, []);
  
  // Compile context value
  const contextValue = useMemo<UseThemeReturn>(() => ({
    theme: safeThemeName,
    themeObject,
    setTheme,
    toggleTheme,
    availableThemes,
    isThemeAvailable,
    getThemeProperty,
    getThemeClass
  }), [
    safeThemeName,
    themeObject,
    setTheme,
    toggleTheme,
    availableThemes,
    isThemeAvailable,
    getThemeProperty,
    getThemeClass
  ]);
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;