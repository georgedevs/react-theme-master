import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../src';

// Test component that uses the hook
const TestComponent = () => {
  const { theme, setTheme, themeObject } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="primary-color">{themeObject.colors.primary}</div>
      <button 
        data-testid="theme-setter" 
        onClick={() => setTheme('dark')}>
        Set Dark
      </button>
    </div>
  );
};

// Define proper props interface for ErrorBoundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error boundary for testing error cases
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { 
    hasError: false, 
    error: null 
  };
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError && this.state.error) {
      return <div data-testid="error-message">{this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

describe('useTheme Hook', () => {
  test('provides the default theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });
  
  test('respects initialTheme option', () => {
    render(
      <ThemeProvider options={{ initialTheme: 'dark' }}>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });
  
  test('allows theme to be changed', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    
    act(() => {
      screen.getByTestId('theme-setter').click();
    });
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });
  
  test('provides theme object with colors', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Check that it provides a valid color
    expect(screen.getByTestId('primary-color')).toHaveTextContent('bg-white');
  });
  
  test('throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error');
    consoleError.mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId('error-message')).toHaveTextContent('useTheme must be used within a ThemeProvider');
    
    consoleError.mockRestore();
  });
});