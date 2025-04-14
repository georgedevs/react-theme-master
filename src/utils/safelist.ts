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
  'px-3', 'py-2', 'py-8',
  
  // Text size classes
  'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl',
  
  // Flexbox classes
  'flex', 'flex-col', 'items-center', 'justify-center', 'gap-1', 'gap-2', 'gap-4',
  
  // Spacing classes
  'mt-1', 'mb-1', 'mb-2', 'mb-4', 'mb-8',
  
  // Border/Rounded classes
  'rounded', 'rounded-lg', 'rounded-full',
  
  // Misc utilities
  'z-10', 'z-50', 'w-full', 'h-full', 'overflow-hidden',
  'transition-colors', 'transition-transform', 'duration-200'
];

/**
 * Complete safelist for Tailwind CSS
 * Combines theme classes and utility classes
 */
export const generateSafelist = (additionalThemes = {}): string[] => {
  const allThemes = { ...defaultThemes, ...additionalThemes };
  return [...extractThemeClasses(allThemes), ...utilityClasses];
};

export default generateSafelist;