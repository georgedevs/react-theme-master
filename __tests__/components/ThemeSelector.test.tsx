import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, ThemeSelector, useTheme } from '../../src';

// Test component to read current theme
const ThemeDisplay = () => {
  const { theme } = useTheme();
  return <div data-testid="current-theme">{theme}</div>;
};

describe('ThemeSelector Component', () => {
  test('dropdown variant shows and allows selecting themes', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
        <ThemeSelector variant="dropdown" />
      </ThemeProvider>
    );
    
    // Initial theme is light
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    
    // Open dropdown
    const dropdownButton = screen.getByRole('button', { expanded: false });
    fireEvent.click(dropdownButton);
    
    // Dark theme option should be visible
    const darkOption = screen.getByText('Dark');
    fireEvent.click(darkOption);
    
    // Theme should change to dark
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });
  
  test('buttons variant shows all themes as buttons', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
        <ThemeSelector variant="buttons" />
      </ThemeProvider>
    );
    
    // Should have buttons for all default themes
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4); // At least light, dark, blue, green
    
    // Click the dark theme button
    const darkButton = screen.getByText('Dark');
    fireEvent.click(darkButton);
    
    // Theme should change to dark
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });
  
  test('icons variant shows theme icons only', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
        <ThemeSelector variant="icons" />
      </ThemeProvider>
    );
    
    // Should have buttons with title attributes
    const darkButton = screen.getByTitle('Dark');
    expect(darkButton).toBeInTheDocument();
    
    // Click the dark theme button
    fireEvent.click(darkButton);
    
    // Theme should change to dark
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });
  
  test('calls onChange callback when theme changes', () => {
    const handleChange = jest.fn();
    
    render(
      <ThemeProvider>
        <ThemeSelector variant="buttons" onChange={handleChange} />
      </ThemeProvider>
    );
    
    // Click the dark theme button
    const darkButton = screen.getByText('Dark');
    fireEvent.click(darkButton);
    
    // onChange should be called with 'dark'
    expect(handleChange).toHaveBeenCalledWith('dark');
  });
  
  test('showLabels controls visibility of theme names', () => {
    const { rerender } = render(
      <ThemeProvider>
        <ThemeSelector variant="buttons" showLabels={true} />
      </ThemeProvider>
    );
    
    // With showLabels true, should see theme names
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    
    // With showLabels false
    rerender(
      <ThemeProvider>
        <ThemeSelector variant="buttons" showLabels={false} />
      </ThemeProvider>
    );
    
    // Should not see theme names
    expect(screen.queryByText('Light')).not.toBeInTheDocument();
    expect(screen.queryByText('Dark')).not.toBeInTheDocument();
  });
});