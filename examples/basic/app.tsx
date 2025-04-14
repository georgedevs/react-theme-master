import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ThemeProvider,
  ThemeSelector,
  ThemeToggle,
  ThemeIndicator,
  useTheme,
  defaultThemes
} from '../../src';

// Custom theme example
const customThemes = {
  sunset: {
    name: 'sunset',
    colors: {
      primary: 'bg-amber-800',
      secondary: 'bg-amber-700',
      text: 'text-amber-50',
      textMuted: 'text-amber-200/70',
      accent: 'bg-amber-700/50',
      border: 'border-amber-600',
      shadow: 'shadow-amber-900/60',
      button: 'bg-amber-500 text-white hover:bg-amber-600',
      buttonOutline: 'border-amber-500 text-amber-500 hover:bg-amber-500/10',
    },
    meta: {
      description: 'Sunset theme',
      author: 'Your Name'
    }
  }
};

// Example application
const App = () => {
  const { theme, themeObject } = useTheme();
  
  return (
    <div className={`min-h-screen ${themeObject.colors.primary} ${themeObject.colors.text}`}>
      <header className={`p-4 ${themeObject.colors.secondary}`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Theme Master Demo</h1>
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 py-8">
        <section className={`p-6 rounded-lg ${themeObject.colors.accent} mb-8`}>
          <h2 className="text-xl font-bold mb-4">Current Theme: {theme}</h2>
          <p className="mb-2">
            This is a demo of the React Theme Master package. You can change the theme using the selector or toggle in the header.
          </p>
          <p className={`${themeObject.colors.textMuted}`}>
            The current theme colors are applied to this page using Tailwind CSS classes.
          </p>
        </section>
        
        <section className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg ${themeObject.colors.accent}`}>
            <h3 className="text-lg font-bold mb-4">Theme Variants</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Dropdown (Default)</h4>
                <ThemeSelector variant="dropdown" />
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Buttons</h4>
                <ThemeSelector variant="buttons" />
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Icons</h4>
                <ThemeSelector variant="icons" />
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Grid with Preview</h4>
                <ThemeSelector variant="grid" showPreview={true} />
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-lg ${themeObject.colors.accent}`}>
            <h3 className="text-lg font-bold mb-4">Toggle Variants</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Default</h4>
                <ThemeToggle />
              </div>
              
              <div>
                <h4 className="font-medium mb-2">With Label</h4>
                <ThemeToggle showLabel={true} />
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Large Size</h4>
                <ThemeToggle size="lg" />
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Custom Themes</h4>
                <ThemeToggle lightTheme="light" darkTheme="blue" />
              </div>
            </div>
          </div>
        </section>
        
        <section className={`mt-8 p-6 rounded-lg ${themeObject.colors.accent}`}>
          <h3 className="text-lg font-bold mb-4">Theme Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(themeObject.colors).map(([key, value]) => (
              <div key={key} className={`p-4 rounded ${value} border ${themeObject.colors.border}`}>
                <div className="font-mono text-sm">{key}</div>
                <div className="text-xs opacity-70 break-all">{value}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <ThemeIndicator showThemeName={true} duration={2000} />
    </div>
  );
};

// Render the app with ThemeProvider
const root = createRoot(document.getElementById('root')!);

root.render(
  <ThemeProvider
    options={{
      initialTheme: 'light',
      themes: { ...defaultThemes, ...customThemes },
      followSystemPreference: true,
      transitionDuration: 300,
      scheduleThemes: [
        { theme: 'dark', from: '18:00', to: '06:00' },
        { theme: 'light', from: '06:00', to: '18:00' }
      ]
    }}
  >
    <App />
  </ThemeProvider>
);