import { Theme } from '../types';

/**
 * Apply CSS variables to document root
 */
export const applyThemeToCssVars = (theme: Theme): void => {
  const root = document.documentElement;
  
  // Clean up any existing theme CSS variables
  const existingVars = Array.from(root.style)
    .filter(name => name.startsWith('--theme-'));
  
  existingVars.forEach(name => {
    root.style.removeProperty(name);
  });
  
  // Apply new theme CSS variables
  if (theme.cssVars) {
    Object.entries(theme.cssVars).forEach(([name, value]) => {
      root.style.setProperty(name, value);
    });
  }
  
  // For each color in the theme, create a CSS variable
  Object.entries(theme.colors).forEach(([key, value]) => {
    // Extract color value from Tailwind class
    // e.g., "bg-blue-500" -> "blue-500"
    const colorValue = value.replace(/^(bg|text|border|shadow)-/, '');
    root.style.setProperty(`--theme-${key}`, colorValue);
  });
  
  // Set a data attribute for CSS selectors
  root.setAttribute('data-theme', theme.name);
};

/**
 * Setup theme transition CSS properties
 */
export const setupThemeTransition = (duration: number = 300): void => {
  const root = document.documentElement;
  
  root.style.setProperty('--theme-transition-duration', `${duration}ms`);
  
  // Add the theme transition class if it doesn't exist
  if (!root.classList.contains('theme-transition')) {
    root.classList.add('theme-transition');
    
    // Add the transition CSS if it doesn't exist
    let style = document.getElementById('theme-transition-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'theme-transition-style';
      style.innerHTML = `
        .theme-transition {
          transition: background-color var(--theme-transition-duration) ease,
                      color var(--theme-transition-duration) ease,
                      border-color var(--theme-transition-duration) ease,
                      box-shadow var(--theme-transition-duration) ease;
        }
        
        .theme-transition * {
          transition: background-color var(--theme-transition-duration) ease,
                      color var(--theme-transition-duration) ease,
                      border-color var(--theme-transition-duration) ease,
                      box-shadow var(--theme-transition-duration) ease;
        }
      `;
      document.head.appendChild(style);
    }
  }
};

/**
 * Remove theme transition CSS properties
 */
export const removeThemeTransition = (): void => {
  const root = document.documentElement;
  
  root.classList.remove('theme-transition');
  
  const style = document.getElementById('theme-transition-style');
  if (style) {
    document.head.removeChild(style);
  }
};