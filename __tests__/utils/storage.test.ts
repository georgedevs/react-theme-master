import {
    loadThemeFromStorage,
    saveThemeToStorage,
    removeThemeFromStorage,
    DEFAULT_STORAGE_KEY
  } from '../../src/utils/storage';
  
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; }
    };
  })();
  
  // Mock sessionStorage
  const sessionStorageMock = (() => {
    let store: Record<string, string> = {};
    
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; }
    };
  })();
  
  // Assign mocks to global object
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
  
  describe('Storage Utils', () => {
    beforeEach(() => {
      // Clear storage before each test
      window.localStorage.clear();
      window.sessionStorage.clear();
      
      // Spy on console.warn to prevent noise in test output
      jest.spyOn(console, 'warn').mockImplementation(() => {});
    });
    
    afterEach(() => {
      jest.restoreAllMocks();
    });
    
    test('saveThemeToStorage saves to localStorage by default', () => {
      saveThemeToStorage('dark');
      
      expect(window.localStorage.getItem(DEFAULT_STORAGE_KEY)).toBe('dark');
      expect(window.sessionStorage.getItem(DEFAULT_STORAGE_KEY)).toBeNull();
    });
    
    test('saveThemeToStorage saves to sessionStorage when specified', () => {
      saveThemeToStorage('dark', DEFAULT_STORAGE_KEY, 'session');
      
      expect(window.sessionStorage.getItem(DEFAULT_STORAGE_KEY)).toBe('dark');
      expect(window.localStorage.getItem(DEFAULT_STORAGE_KEY)).toBeNull();
    });
    
    test('loadThemeFromStorage loads from localStorage by default', () => {
      window.localStorage.setItem(DEFAULT_STORAGE_KEY, 'dark');
      
      const theme = loadThemeFromStorage();
      
      expect(theme).toBe('dark');
    });
    
    test('loadThemeFromStorage loads from sessionStorage when specified', () => {
      window.sessionStorage.setItem(DEFAULT_STORAGE_KEY, 'blue');
      
      const theme = loadThemeFromStorage(DEFAULT_STORAGE_KEY, 'session');
      
      expect(theme).toBe('blue');
    });
    
    test('loadThemeFromStorage returns null when no theme is stored', () => {
      const theme = loadThemeFromStorage();
      
      expect(theme).toBeNull();
    });
    
    test('removeThemeFromStorage removes from localStorage by default', () => {
      window.localStorage.setItem(DEFAULT_STORAGE_KEY, 'dark');
      
      removeThemeFromStorage();
      
      expect(window.localStorage.getItem(DEFAULT_STORAGE_KEY)).toBeNull();
    });
    
    test('removeThemeFromStorage removes from sessionStorage when specified', () => {
      window.sessionStorage.setItem(DEFAULT_STORAGE_KEY, 'dark');
      
      removeThemeFromStorage(DEFAULT_STORAGE_KEY, 'session');
      
      expect(window.sessionStorage.getItem(DEFAULT_STORAGE_KEY)).toBeNull();
    });
    
    test('uses custom storage key when provided', () => {
      const customKey = 'custom-theme-key';
      
      saveThemeToStorage('dark', customKey);
      
      expect(window.localStorage.getItem(customKey)).toBe('dark');
      expect(window.localStorage.getItem(DEFAULT_STORAGE_KEY)).toBeNull();
      
      const theme = loadThemeFromStorage(customKey);
      expect(theme).toBe('dark');
      
      removeThemeFromStorage(customKey);
      expect(window.localStorage.getItem(customKey)).toBeNull();
    });
    
    test('handles storage errors gracefully', () => {
      // Mock localStorage.getItem to throw error
      const originalGetItem = window.localStorage.getItem;
      window.localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error');
      });
      
      const theme = loadThemeFromStorage();
      
      expect(theme).toBeNull();
      expect(console.warn).toHaveBeenCalled();
      
      // Restore original
      window.localStorage.getItem = originalGetItem;
    });
  });