import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, ThemeIndicator, useTheme } from '../../src';

// Mock timer functions
jest.useFakeTimers();

// Component that allows changing the theme
const ThemeChanger = () => {
  const { setTheme } = useTheme();
  
  return (
    <button 
      data-testid="theme-changer" 
      onClick={() => setTheme('dark')}>
      Change to Dark
    </button>
  );
};

describe('ThemeIndicator Component', () => {
  test('shows notification when theme changes and hides after duration', () => {
    render(
      <ThemeProvider>
        <ThemeChanger />
        <ThemeIndicator duration={1000} />
      </ThemeProvider>
    );
    
    // Initially, indicator should not be visible
    expect(screen.queryByText('Theme')).not.toBeInTheDocument();
    
    // Change the theme
    act(() => {
      screen.getByTestId('theme-changer').click();
    });
    
    // Indicator should now be visible
    expect(screen.getByText('Dark Theme')).toBeInTheDocument();
    
    // After duration passes, indicator should hide
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Indicator should be gone
    expect(screen.queryByText('Theme')).not.toBeInTheDocument();
  });
  
  test('uses different positions correctly', () => {
    render(
      <ThemeProvider>
        <ThemeChanger />
        <ThemeIndicator position="top-right" duration={1000} />
      </ThemeProvider>
    );
    
    // Change the theme
    act(() => {
      screen.getByTestId('theme-changer').click();
    });
    
    // Indicator should have top-right position classes
    const indicator = screen.getByText('Dark Theme').closest('div');
    expect(indicator).toHaveClass('top-4');
    expect(indicator).toHaveClass('right-4');
  });
  
  test('showThemeName controls theme name visibility', () => {
    // With showThemeName=false
    const { rerender } = render(
      <ThemeProvider>
        <ThemeChanger />
        <ThemeIndicator showThemeName={false} duration={1000} />
      </ThemeProvider>
    );
    
    // Change the theme
    act(() => {
      screen.getByTestId('theme-changer').click();
    });
    
    // Should not show the theme name
    expect(screen.queryByText('Dark Theme')).not.toBeInTheDocument();
    
    // Indicator should still show (icon)
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    
    // Clean up
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // With showThemeName=true
    rerender(
      <ThemeProvider>
        <ThemeChanger />
        <ThemeIndicator showThemeName={true} duration={1000} />
      </ThemeProvider>
    );
    
    // Change the theme again
    act(() => {
      screen.getByTestId('theme-changer').click();
    });
    
    // Should show the theme name
    expect(screen.getByText('Dark Theme')).toBeInTheDocument();
  });
  
  test('uses custom icon when provided', () => {
    const customIcon = <span data-testid="custom-icon">🌙</span>;
    
    render(
      <ThemeProvider>
        <ThemeChanger />
        <ThemeIndicator icon={customIcon} duration={1000} />
      </ThemeProvider>
    );
    
    // Change the theme
    act(() => {
      screen.getByTestId('theme-changer').click();
    });
    
    // Should use custom icon
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});