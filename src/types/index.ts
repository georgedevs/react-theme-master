import { ReactNode } from 'react';

/**
 * Basic theme structure with Tailwind CSS classes
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  text: string;
  textMuted: string;
  accent: string;
  border: string;
  shadow: string;
  button: string;
  buttonOutline: string;
  [key: string]: string; 
}

/**
 * A complete theme definition
 */
export interface Theme {
  name: string;
  colors: ThemeColors;
  cssVars?: Record<string, string>;
  meta?: {
    description?: string;
    author?: string;
    [key: string]: any;
  };
}

/**
 * Theme provider options
 */
export interface ThemeProviderOptions {
  initialTheme?: string;
  themes?: Record<string, Theme | ThemeColors>;
  fallbackTheme?: string;
  storageKey?: string;
  storageType?: 'local' | 'session' | 'custom' | 'none';
  followSystemPreference?: boolean | 'initial-only';
  transitionDuration?: number;
  onThemeChange?: (themeName: string, theme: Theme) => void;
  scheduleThemes?: Array<{
    theme: string;
    from: string;
    to: string;
  }>;
}

/**
 * Theme provider props
 */
export interface ThemeProviderProps {
  children: ReactNode;
  options?: ThemeProviderOptions;
}

/**
 * Hook return type
 */
export interface UseThemeReturn {
  theme: string;
  themeObject: Theme;
  setTheme: (themeName: string) => void;
  toggleTheme: (themeA: string, themeB?: string) => void;
  availableThemes: string[];
  isThemeAvailable: (themeName: string) => boolean;
  getThemeProperty: (property: string) => string;
  getThemeClass: (property: string) => string;
}

/**
 * ThemeSelector component props
 */
export interface ThemeSelectorProps {
  variant?: 'dropdown' | 'buttons' | 'grid' | 'icons';
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
  onChange?: (themeName: string) => void;
  themeIcons?: Record<string, React.ReactNode>;
  showPreview?: boolean;
  previewType?: 'color-circles' | 'mini-mockup';
}

/**
 * ThemeToggle component props
 */
export interface ThemeToggleProps {
  lightTheme?: string;
  darkTheme?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'inline' | 'fixed-top-right' | 'fixed-bottom-right' | 'fixed-top-left' | 'fixed-bottom-left';
  className?: string;
  style?: React.CSSProperties;
  showLabel?: boolean;
  label?: string | Record<string, string>;
  icon?: React.ReactNode | Record<string, React.ReactNode>;
}

/**
 * ThemeIndicator component props
 */
export interface ThemeIndicatorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  duration?: number;
  showThemeName?: boolean;
  className?: string;
  style?: React.CSSProperties;
  icon?: ReactNode;
}

/**
 * System theme detection hook return type
 */
export interface UseSystemThemeReturn {
  systemTheme: 'light' | 'dark';
  isSystemDarkMode: boolean;
  isSystemLightMode: boolean;
}

/**
 * Storage methods
 */
export interface ThemeStorage {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
}