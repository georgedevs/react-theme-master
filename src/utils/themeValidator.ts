import { Theme, ThemeColors } from '../types';

/**
 * Required properties for a theme
 */
const REQUIRED_THEME_PROPERTIES = [
  'primary',
  'secondary',
  'text',
  'textMuted',
  'accent',
  'border',
  'shadow',
  'button',
  'buttonOutline',
];

/**
 * Check if an object has all required theme properties
 */
export const hasRequiredThemeProperties = (obj: any): boolean => {
  if (!obj || typeof obj !== 'object') return false;
  
  return REQUIRED_THEME_PROPERTIES.every((prop) => 
    Object.prototype.hasOwnProperty.call(obj, prop) && 
    typeof obj[prop] === 'string'
  );
};

/**
 * Check if an object is a valid ThemeColors object
 */
export const isValidThemeColors = (obj: any): obj is ThemeColors => {
  return hasRequiredThemeProperties(obj);
};

/**
 * Check if an object is a valid Theme object
 */
export const isValidTheme = (obj: any): obj is Theme => {
  if (!obj || typeof obj !== 'object') return false;
  
  return (
    typeof obj.name === 'string' && 
    obj.name.trim() !== '' && 
    isValidThemeColors(obj.colors)
  );
};

/**
 * Convert ThemeColors to a Theme object
 */
export const colorsToTheme = (name: string, colors: ThemeColors): Theme => {
  return {
    name,
    colors,
    meta: {
      description: `${name.charAt(0).toUpperCase() + name.slice(1)} theme`,
    },
  };
};

/**
 * Normalize themes to ensure they are all valid Theme objects
 */
export const normalizeThemes = (themes: Record<string, Theme | ThemeColors>): Record<string, Theme> => {
  return Object.entries(themes).reduce((result, [name, themeOrColors]) => {
    let theme: Theme;
    
    // If it's already a Theme object
    if (isValidTheme(themeOrColors)) {
      theme = themeOrColors;
    } 
    // If it's a ThemeColors object
    else if (isValidThemeColors(themeOrColors)) {
      theme = colorsToTheme(name, themeOrColors);
    } 
    // Invalid theme, skip it
    else {
      console.warn(`Invalid theme: ${name}. Skipping.`);
      return result;
    }
    
    return { ...result, [name]: theme };
  }, {});
};