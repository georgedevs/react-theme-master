import React, { useState, useEffect } from 'react';
import { ThemeIndicatorProps } from '../types';
import { useTheme } from '../hooks/useTheme';

/**
 * ThemeIndicator component
 * Shows a notification when theme changes
 * 
 * @param {ThemeIndicatorProps} props - Indicator props
 * @returns {JSX.Element|null} Indicator component or null when hidden
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ThemeIndicator />
 * 
 * // Custom duration and position
 * <ThemeIndicator duration={5000} position="top-right" />
 * 
 * // Show theme name
 * <ThemeIndicator showThemeName={true} />
 * ```
 */
export const ThemeIndicator: React.FC<ThemeIndicatorProps> = ({
  position = 'bottom-left',
  duration = 3000,
  showThemeName = true,
  className = '',
  style,
  icon
}) => {
  const { theme, themeObject } = useTheme();
  const [visible, setVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme);
  
  // Show indicator when theme changes
  useEffect(() => {
    if (theme !== currentTheme) {
      setCurrentTheme(theme);
      setVisible(true);
      
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [theme, currentTheme, duration]);
  
  // Hide if not visible
  if (!visible) return null;
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };
  
  // Get icon based on theme
  const getIcon = () => {
    if (icon) return icon;
    
    switch (theme) {
      case 'light':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
      case 'dark':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        );
      case 'blue':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#3B82F6">
            <rect width="14" height="14" x="5" y="5" rx="4" />
          </svg>
        );
      case 'green':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#10B981">
            <rect width="14" height="14" x="5" y="5" rx="4" />
          </svg>
        );
      case 'purple':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#8B5CF6">
            <rect width="14" height="14" x="5" y="5" rx="4" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
          </svg>
        );
    }
  };
  
  return (
    <div
      className={`
        fixed z-50 flex items-center p-3 rounded-lg shadow-lg
        ${positionClasses[position]}
        ${themeObject.colors.accent}
        ${className}
      `}
      style={style}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center">
          {getIcon()}
        </div>
        
        {showThemeName && (
          <div className="flex flex-col">
            <div className="text-sm font-medium">
              {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeIndicator;