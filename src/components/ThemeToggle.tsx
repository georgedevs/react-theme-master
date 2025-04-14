import React from 'react';
import { ThemeToggleProps } from '../types';
import { useTheme } from '../hooks/useTheme';

/**
 * ThemeToggle component
 * Simple toggle between two themes, optimized for light/dark switching
 * 
 * @param {ThemeToggleProps} props - Toggle component props
 * @returns {JSX.Element} Toggle button component
 * 
 * @example
 * ```tsx
 * // Basic light/dark toggle
 * <ThemeToggle />
 * 
 * // Custom themes toggle
 * <ThemeToggle lightTheme="customLight" darkTheme="customDark" />
 * 
 * // Fixed position bottom right
 * <ThemeToggle position="fixed-bottom-right" />
 * 
 * // With label
 * <ThemeToggle showLabel={true} />
 * ```
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  lightTheme = 'light',
  darkTheme = 'dark',
  size = 'md',
  position = 'inline',
  className = '',
  style,
  showLabel = false,
  label,
  icon
}) => {
  const { theme, toggleTheme, themeObject } = useTheme();
  
  // Check if current theme is dark
  const isDarkTheme = theme === darkTheme;
  
  // Determine current and next theme
  const currentTheme = isDarkTheme ? darkTheme : lightTheme;
  const nextTheme = isDarkTheme ? lightTheme : darkTheme;
  
  // Handle toggle
  const handleToggle = () => {
    toggleTheme(lightTheme, darkTheme);
  };
  
  // Get label text
  const getLabelText = () => {
    if (!showLabel) return null;
    
    if (typeof label === 'string') {
      return label;
    }
    
    if (label && typeof label === 'object') {
      return label[currentTheme] || `${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} Mode`;
    }
    
    return `${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} Mode`;
  };
  
  // Get icon
  const getIcon = (): React.ReactNode => {
    // If icon is a React element
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    
  // If icon is a record/object with themed icons
  if (icon && typeof icon === 'object' && !React.isValidElement(icon)) {
    const iconMap = icon as { [key: string]: React.ReactNode };
    if (currentTheme in iconMap) {
      return iconMap[currentTheme];
    }
  }
      // Default icons
      if (isDarkTheme) {
        // Moon icon
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        );
      }
    
  // Sun icon
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
};
  
  // Size classes
  const sizeClasses = {
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg'
  };
  
  // Position styles
  const positionStyles: Record<typeof position, React.CSSProperties> = {
    'inline': {},
    'fixed-top-right': {
      position: 'fixed' as const,
      top: '1rem',
      right: '1rem',
      zIndex: 50
    },
    'fixed-bottom-right': {
      position: 'fixed' as const,
      bottom: '1rem',
      right: '1rem',
      zIndex: 50
    },
    'fixed-top-left': {
      position: 'fixed' as const,
      top: '1rem',
      left: '1rem',
      zIndex: 50
    },
    'fixed-bottom-left': {
      position: 'fixed' as const,
      bottom: '1rem',
      left: '1rem',
      zIndex: 50
    }
  };
  
  // Button style
  const getButtonStyles = () => ({
    ...positionStyles[position],
    ...style
  });
  
  return (
    <button
      onClick={handleToggle}
      className={`
        flex items-center justify-center gap-2 rounded-full transition-colors 
        ${sizeClasses[size]}
        ${themeObject.colors.button}
        ${className}
      `}
      style={getButtonStyles()}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
    >
      {getIcon()}
      {getLabelText() && <span>{getLabelText()}</span>}
    </button>
  );
};

export default ThemeToggle;