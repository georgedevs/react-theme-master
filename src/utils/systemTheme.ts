/**
 * Detect system color scheme preference
 */
export const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    
    // Check for prefers-color-scheme media query
    const isDarkMode = window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return isDarkMode ? 'dark' : 'light';
  };
  
  /**
   * Check if a theme matches the system preference
   */
  export const isSystemTheme = (theme: string): boolean => {
    const systemTheme = getSystemTheme();
    return theme === systemTheme;
  };
  
  /**
   * Get a theme that matches the system preference
   */
  export const getThemeForSystem = (
    lightTheme: string = 'light',
    darkTheme: string = 'dark'
  ): string => {
    const systemTheme = getSystemTheme();
    return systemTheme === 'dark' ? darkTheme : lightTheme;
  };
  
  /**
   * Create a media query listener for system preference changes
   */
  export const createSystemThemeListener = (
    callback: (isDarkMode: boolean) => void
  ): (() => void) => {
    if (typeof window === 'undefined') return () => {};
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      callback(e.matches);
    };
    
    // Different browsers have different event listener methods
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if ('addListener' in mediaQuery) {
      // @ts-ignore - For older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Return cleanup function
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if ('removeListener' in mediaQuery) {
        // @ts-ignore - For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  };