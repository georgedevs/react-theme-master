import { ThemeColors, Theme } from '../types';

// Default theme colors with Tailwind CSS classes
export const themeColors: Record<string, ThemeColors> = {
    light: {
        primary: 'bg-white',
        secondary: 'bg-gray-50',
        text: 'text-gray-900',
        textMuted: 'text-gray-600',
        accent: 'bg-gray-100',
        border: 'border-gray-200',
        shadow: 'shadow-gray-200/20',
        button: 'bg-gray-900 text-white hover:bg-gray-800',
        buttonOutline: 'border-gray-200 text-gray-900 hover:bg-gray-50',
      },
      dark: {
        primary: 'bg-black',
        secondary: 'bg-neutral-950',
        text: 'text-white',
        textMuted: 'text-neutral-400',
        accent: 'bg-neutral-900',
        border: 'border-neutral-800',
        shadow: 'shadow-black/60',
        button: 'bg-white text-black hover:bg-neutral-200',
        buttonOutline: 'border-neutral-800 text-white hover:bg-neutral-900',
      },
      blue: {
        primary: 'bg-[#0A192F]', // Deeper, richer blue
        secondary: 'bg-[#112240]', // Slightly lighter navy
        text: 'text-[#E6F1FF]', // Soft blue-white
        textMuted: 'text-[#8892B0]', // Muted blue-gray
        accent: 'bg-[#1E2D4D]', // Medium navy
        border: 'border-[#233554]', // Border navy
        shadow: 'shadow-[#0A192F]/60',
        button: 'bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90', // Cyan accent
        buttonOutline: 'border-[#64FFDA] text-[#64FFDA] hover:bg-[#64FFDA]/10',
      },
      green: {
        // Forest theme
        primary: 'bg-[#1A2F1C]', // Deep forest green
        secondary: 'bg-[#2A3E2B]', // Medium forest
        text: 'text-[#E8FFF0]', // Soft green-white
        textMuted: 'text-[#9DB5A3]', // Muted sage
        accent: 'bg-[#2F442F]', // Rich forest
        border: 'border-[#3D5C3E]', // Forest border
        shadow: 'shadow-[#1A2F1C]/60',
        button: 'bg-[#7CFF8E] text-[#1A2F1C] hover:bg-[#7CFF8E]/90', // Vibrant green
        buttonOutline: 'border-[#7CFF8E] text-[#7CFF8E] hover:bg-[#7CFF8E]/10',
      },
     purple: {
    // Royal Purple theme
    primary: 'bg-[#13111C]', // Deep purple-black
    secondary: 'bg-[#1F1B2E]', // Rich purple
    text: 'text-[#F2E9FF]', // Soft purple-white
    textMuted: 'text-[#9D91BB]', // Muted lavender
    accent: 'bg-[#2A2440]', // Medium purple
    border: 'border-[#382F5A]', // Purple border
    shadow: 'shadow-[#13111C]/60',
    button: 'bg-[#B69DFF] text-[#13111C] hover:bg-[#B69DFF]/90', // Bright purple
    buttonOutline: 'border-[#B69DFF] text-[#B69DFF] hover:bg-[#B69DFF]/10',
  }
};

// Convert theme colors to complete Theme objects
export const defaultThemes: Record<string, Theme> = Object.entries(themeColors).reduce(
  (themes, [name, colors]) => ({
    ...themes,
    [name]: {
      name,
      colors,
      meta: {
        description: `${name.charAt(0).toUpperCase() + name.slice(1)} theme`,
      },
    },
  }),
  {}
);

// CSS variables for each theme
export const themeToCssVars = (theme: Theme): Record<string, string> => {
  return Object.entries(theme.colors).reduce(
    (vars, [key, value]) => ({
      ...vars,
      [`--theme-${key}`]: value.replace(/^(bg|text|border|shadow)-/, ''),
    }),
    {}
  );
};

export default defaultThemes;