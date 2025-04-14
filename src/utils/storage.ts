import { ThemeStorage } from '../types';

/**
 * Default key for storing theme preference
 */
export const DEFAULT_STORAGE_KEY = 'react-theme-master-theme';

/**
 * Local storage implementation
 */
export const localStorageAdapter: ThemeStorage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  },
  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
    }
  },
};

/**
 * Session storage implementation
 */
export const sessionStorageAdapter: ThemeStorage = {
  get: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.warn('Error accessing sessionStorage:', error);
      return null;
    }
  },
  set: (key: string, value: string): void => {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error writing to sessionStorage:', error);
    }
  },
  remove: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Error removing from sessionStorage:', error);
    }
  },
};

/**
 * No-op storage implementation
 */
export const noopStorageAdapter: ThemeStorage = {
  get: () => null,
  set: () => {},
  remove: () => {},
};

/**
 * Get the appropriate storage adapter based on the type
 */
export const getStorageAdapter = (type: 'local' | 'session' | 'custom' | 'none' = 'local'): ThemeStorage => {
    switch (type) {
      case 'local':
        return localStorageAdapter;
      case 'session':
        return sessionStorageAdapter;
      case 'custom':
        // For custom storage, use a noop adapter as the actual storage is handled through callbacks
        return noopStorageAdapter;
      case 'none':
        return noopStorageAdapter;
      default:
        return localStorageAdapter;
    }
  };

/**
 * Save theme to storage
 */
export const saveThemeToStorage = (
    theme: string,
    key: string = DEFAULT_STORAGE_KEY,
    type: 'local' | 'session' | 'custom' | 'none' = 'local'
  ): void => {
    // Skip trying to save if using custom storage
    if (type === 'custom') return;
    
    const adapter = getStorageAdapter(type);
    adapter.set(key, theme);
  };

/**
 * Load theme from storage
 */
export const loadThemeFromStorage = (
    key: string = DEFAULT_STORAGE_KEY,
    type: 'local' | 'session' | 'custom' | 'none' = 'local'
  ): string | null => {
    // Skip trying to load if using custom storage
    if (type === 'custom') return null;
    
    const adapter = getStorageAdapter(type);
    return adapter.get(key);
  };
/**
 * Remove theme from storage
 */
export const removeThemeFromStorage = (
  key: string = DEFAULT_STORAGE_KEY,
  type: 'local' | 'session' | 'none' = 'local'
): void => {
  const adapter = getStorageAdapter(type);
  adapter.remove(key);
};