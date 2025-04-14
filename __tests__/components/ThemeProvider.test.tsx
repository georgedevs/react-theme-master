import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../src';

// Mock storage functions
jest.mock('../../src/utils/storage', () => ({
  loadThemeFromStorage: jest.fn().mockReturnValue(null),
  saveThemeToStorage: jest.fn(),
  DEFAULT_STORAGE_KEY: 'test-theme-key',
}));

// Test component to extract context values
const ThemeConsumer = () => {
  const { theme, themeObject, availableThemes } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="theme-primary">{themeObject.colors.primary}</div>
      <div data-testid="available-themes">{availableThemes.join(',')}</div>
    </div>
  );
};

describe('ThemeProvider Component', () => {
  test('provides default theme', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(screen.getByTestId('theme-primary')).toHaveTextContent('bg-white');
  });
  
  test('uses initialTheme from options', () => {
    render(
      <ThemeProvider options={{ initialTheme: 'dark' }}>
        <ThemeConsumer />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('theme-primary')).toHaveTextContent('bg-black');
  });
  
  test('provides custom themes', () => {
    const customThemes = {
      custom: {
        name: 'custom',
        colors: {
          primary: 'bg-red-500',
          secondary: 'bg-red-600',
          text: 'text-red-50',
          textMuted: 'text-red-200/70',
          accent: 'bg-red-700/50',
          border: 'border-red-400',
          shadow: 'shadow-red-900/60',
          button: 'bg-red-500 text-white hover:bg-red-600',
          buttonOutline: 'border-red-500 text-red-500 hover:bg-red-500/10',
        }
      }
    };
    
    render(
      <ThemeProvider options={{ 
        initialTheme: 'custom',
        themes: customThemes
      }}>
        <ThemeConsumer />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
    expect(screen.getByTestId('theme-primary')).toHaveTextContent('bg-red-500');
    expect(screen.getByTestId('available-themes')).toContain('custom');
  });
  
  test('merges custom themes with default themes', () => {
    const customThemes = {
      custom: {
        name: 'custom',
        colors: {
          primary: 'bg-red-500',
          secondary: 'bg-red-600',
          text: 'text-red-50',
          textMuted: 'text-red-200/70',
          accent: 'bg-red-700/50',
          border: 'border-red-400',
          shadow: 'shadow-red-900/60',
          button: 'bg-red-500 text-white hover:bg-red-600',
          buttonOutline: 'border-red-500 text-red-500 hover:bg-red-500/10',
        }
      }
    };
    
    render(
      <ThemeProvider options={{ themes: customThemes }}>
        <ThemeConsumer />
      </ThemeProvider>
    );
    
    // Should have both default and custom themes
    const availableThemes = screen.getByTestId('available-themes').textContent;
    expect(availableThemes).toContain('light');
    expect(availableThemes).toContain('dark');
    expect(availableThemes).toContain('custom');
  });
});