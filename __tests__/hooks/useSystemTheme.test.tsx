import React from 'react';
import { render, screen } from '@testing-library/react';
import { createSystemThemeListener, useSystemTheme } from '../../src';
import * as systemThemeUtils from '../../src/utils/systemTheme';

// Mock system theme utils
jest.mock('../../src/utils/systemTheme', () => ({
  getSystemTheme: jest.fn(),
  createSystemThemeListener: jest.fn().mockImplementation(callback => {
    // Store callback for testing
    (createSystemThemeListener as jest.Mock).mockCallback = callback;
    return jest.fn(); // Return cleanup function
  }),
}));

const TestComponent = () => {
  const { systemTheme, isSystemDarkMode, isSystemLightMode } = useSystemTheme();
  
  return (
    <div>
      <div data-testid="system-theme">{systemTheme}</div>
      <div data-testid="is-dark">{isSystemDarkMode ? 'true' : 'false'}</div>
      <div data-testid="is-light">{isSystemLightMode ? 'true' : 'false'}</div>
    </div>
  );
};

describe('useSystemTheme Hook', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('detects light theme from system', () => {
    (systemThemeUtils.getSystemTheme as jest.Mock).mockReturnValue('light');
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('system-theme')).toHaveTextContent('light');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    expect(screen.getByTestId('is-light')).toHaveTextContent('true');
  });
  
  test('detects dark theme from system', () => {
    (systemThemeUtils.getSystemTheme as jest.Mock).mockReturnValue('dark');
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('system-theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    expect(screen.getByTestId('is-light')).toHaveTextContent('false');
  });
  
  test('updates when system preference changes', () => {
    // Start with light theme
    (systemThemeUtils.getSystemTheme as jest.Mock).mockReturnValue('light');
    
    const { rerender } = render(<TestComponent />);
    
    expect(screen.getByTestId('system-theme')).toHaveTextContent('light');
    
    // Simulate system theme change to dark
    const mockCallback = (createSystemThemeListener as unknown as { mockCallback: (isDark: boolean) => void }).mockCallback;
    mockCallback(true); // Trigger with isDark = true
    
    rerender(<TestComponent />);
    
    expect(screen.getByTestId('system-theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    expect(screen.getByTestId('is-light')).toHaveTextContent('false');
  });
});