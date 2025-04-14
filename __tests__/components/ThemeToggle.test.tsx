import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, ThemeToggle, useTheme } from '../../src';

// Test component to read current theme
const ThemeDisplay = () => {
  const { theme } = useTheme();
  return <div data-testid="current-theme">{theme}</div>;
};

describe('ThemeToggle Component', () => {
  test('toggles between light and dark themes by default', () => {
    render(
      <ThemeProvider options={{ initialTheme: 'light' }}>
        <ThemeDisplay />
        <ThemeToggle />
      </ThemeProvider>
    );
    
    // Initial theme is light
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    
    // Click the toggle
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    // Should switch to dark
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    
    // Click again
    fireEvent.click(toggleButton);
    
    // Should switch back to light
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });
  
  test('toggles between custom themes', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
        <ThemeToggle lightTheme="blue" darkTheme="purple" />
      </ThemeProvider>
    );
    
    // Click the toggle (initially light)
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    // Should switch to purple (specified as darkTheme)
    expect(screen.getByTestId('current-theme')).toHaveTextContent('purple');
    
    // Click again
    fireEvent.click(toggleButton);
    
    // Should switch to blue (specified as lightTheme)
    expect(screen.getByTestId('current-theme')).toHaveTextContent('blue');
  });
  
  test('displays label when showLabel is true', () => {
    render(
      <ThemeProvider>
        <ThemeToggle showLabel={true} />
      </ThemeProvider>
    );
    
    // Should show "Dark Mode" as the label since initial theme is light
    expect(screen.getByRole('button')).toHaveTextContent('Dark Mode');
  });
  
  test('uses custom label when provided', () => {
    render(
      <ThemeProvider>
        <ThemeToggle 
          showLabel={true} 
          label={{
            light: 'Switch to Night',
            dark: 'Switch to Day'
          }}
        />
      </ThemeProvider>
    );
    
    // Should show custom label
    expect(screen.getByRole('button')).toHaveTextContent('Switch to Night');
    
    // Toggle
    fireEvent.click(screen.getByRole('button'));
    
    // Should show other custom label
    expect(screen.getByRole('button')).toHaveTextContent('Switch to Day');
  });
  
  test('applies size classes correctly', () => {
    const { rerender } = render(
      <ThemeProvider>
        <ThemeToggle size="sm" />
      </ThemeProvider>
    );
    
    // Small size should have p-1.5 class
    expect(screen.getByRole('button').className).toContain('p-1.5');
    
    // Medium size (default)
    rerender(
      <ThemeProvider>
        <ThemeToggle size="md" />
      </ThemeProvider>
    );
    expect(screen.getByRole('button').className).toContain('p-2');
    
    // Large size
    rerender(
      <ThemeProvider>
        <ThemeToggle size="lg" />
      </ThemeProvider>
    );
    expect(screen.getByRole('button').className).toContain('p-3');
  });
});