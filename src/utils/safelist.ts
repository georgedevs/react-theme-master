import { defaultThemes } from '../themes';

/**
 * Extract all CSS classes from theme objects for Tailwind safelist
 */
export const extractThemeClasses = (themes = defaultThemes): string[] => {
  const classes = new Set<string>();
  
  // Process each theme
  Object.values(themes).forEach(theme => {
    // Extract classes from colors object
    Object.values(theme.colors).forEach(value => {
      // Split compound classes (e.g. "bg-blue-500 text-white hover:bg-blue-600")
      const classArray = value.split(' ');
      classArray.forEach(cls => classes.add(cls));
    });
  });
  
  return Array.from(classes);
};

/**
 * Additional utility classes used by components
 */
const utilityClasses = [
  // Position classes
  'top-4', 'right-4', 'bottom-4', 'left-4', 'fixed',
  
  // Padding classes
  'p-1.5', 'p-2', 'p-3', 'p-4', 'p-6',
  'px-3', 'py-2',
  
  // Text size classes
  'text-sm', 'text-base', 'text-lg',
  
  // Flexbox classes
  'flex', 'items-center', 'gap-2',
  
  // Spacing classes
  'mt-1', 'mb-1',
  
  // Border/Rounded classes
  'rounded', 'rounded-lg', 'rounded-full',
  
  // Misc utilities
  'z-10', 'z-50', 
  'transition-colors', 'transition-transform', 'duration-200'
];

/**
 * Generate a safelist for Tailwind CSS
 * 
 * This function extracts all CSS classes used in themes and combines them
 * with utility classes needed by the components. The result can be used
 * in your Tailwind config to prevent classes from being purged.
 * 
 * @returns {string[]} Array of CSS classes to be included in Tailwind safelist
 * 
 * @example
 * ```javascript
 * // tailwind.config.js
 * import { generateSafelist } from 'react-theme-master';
 * 
 * module.exports = {
 *   // other config...
 *   safelist: generateSafelist(),
 * }
 * ```
 */
export const generateSafelist = (): string[] => {
  return [...extractThemeClasses(), ...utilityClasses];
};

export default generateSafelist;