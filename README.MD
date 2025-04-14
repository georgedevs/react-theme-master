# React Theme Master

[![npm version](https://img.shields.io/npm/v/react-theme-master.svg)](https://www.npmjs.com/package/react-theme-master)
[![Build Status](https://img.shields.io/github/workflow/status/georgedevs/react-theme-master/CI)](https://github.com/georgedevs/react-theme-master/actions)
[![License](https://img.shields.io/npm/l/react-theme-master.svg)](https://github.com/georgedevs/react-theme-master/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/georgedevs/react-theme-master/blob/main/CONTRIBUTING.md)

A powerful, flexible theme management system for React applications with Tailwind CSS integration.

## Features

- **Multiple Theme Support**: Not just light/dark, but unlimited custom themes
- **Ready-to-Use UI Components**: Dropdowns, toggles, and theme indicators
- **Tailwind CSS Integration**: First-class support for Tailwind classes
- **Developer-Friendly API**: Simple hooks and components with TypeScript support
- **System Preference Detection**: Automatically match device settings
- **Theme Scheduling**: Change themes based on time of day
- **Persistence Options**: Store preferences in local or session storage
- **Smooth Transitions**: Configurable animations between themes
- **Framework Compatible**: Works with Next.js, Create React App, Vite, and more

## Installation

```bash
npm install react-theme-master
# or
yarn add react-theme-master
```

## Quick Start

Wrap your application with the ThemeProvider and start using themes:

```jsx
import { ThemeProvider, ThemeToggle, useTheme } from 'react-theme-master';

function App() {
  const { themeObject } = useTheme();
  
  return (
    <div className={`min-h-screen ${themeObject.colors.primary}`}>
      <header className={themeObject.colors.secondary}>
        <ThemeToggle />
      </header>
      <main>
        <h1 className={themeObject.colors.text}>Hello, Themed World!</h1>
      </main>
    </div>
  );
}

// Wrap your app with the ThemeProvider
export default function ThemedApp() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
```

## Framework Setup

### Tailwind CSS Configuration

To prevent Tailwind from purging theme-related classes in production builds, add the safelist to your `tailwind.config.js`:

```js
// tailwind.config.js
import { generateSafelist } from 'react-theme-master';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Your content paths
  ],
  safelist: generateSafelist(), // This preserves all theme classes
  theme: {
    extend: {},
  },
  plugins: [],
};
```

That's it! The `generateSafelist()` function will include all necessary CSS classes for both built-in and custom themes.

### Next.js Setup

React Theme Master works with Next.js App Router. All components are already properly marked with "use client" directives.

1. Create a theme provider component in your app:

```jsx
// app/providers.jsx
"use client";

import { ThemeProvider } from 'react-theme-master';

export function Providers({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
```

2. Use it in your layout:

```jsx
// app/layout.jsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

## Components

### ThemeProvider

Wraps your application to provide theme context:

```jsx
<ThemeProvider
  options={{
    initialTheme: 'light',
    themes: { ...customThemes },
    followSystemPreference: true,
    transitionDuration: 300,
  }}
>
  <App />
</ThemeProvider>
```

### ThemeSelector

UI component for selecting themes:

```jsx
// Dropdown (default)
<ThemeSelector />

// Buttons
<ThemeSelector variant="buttons" />

// Grid with previews
<ThemeSelector variant="grid" showPreview={true} />

// Icons only
<ThemeSelector variant="icons" />
```

### ThemeToggle

Simple toggle between two themes (usually light/dark):

```jsx
// Basic toggle
<ThemeToggle />

// With label
<ThemeToggle showLabel={true} />

// Fixed position
<ThemeToggle position="fixed-bottom-right" />

// Custom themes
<ThemeToggle lightTheme="light" darkTheme="blue" />
```

### ThemeIndicator

Shows a notification when theme changes:

```jsx
<ThemeIndicator position="top-right" duration={3000} />
```

## Hooks

### useTheme

The main hook for accessing and controlling the current theme:

```jsx
const { 
  theme,           // Current theme name
  themeObject,     // Complete theme object with colors
  setTheme,        // Function to set theme
  toggleTheme,     // Toggle between themes
  availableThemes, // List of theme names
  getThemeClass    // Helper to get class for a theme property
} = useTheme();
```

### useSystemTheme

Hook for detecting system preference:

```jsx
const { 
  systemTheme,       // 'light' or 'dark'
  isSystemDarkMode,  // Boolean
  isSystemLightMode  // Boolean
} = useSystemTheme();
```

## Custom Themes

Create custom themes that work with Tailwind CSS:

```jsx
const myThemes = {
  forest: {
    colors: {
      primary: 'bg-green-900',
      secondary: 'bg-green-800',
      text: 'text-green-50',
      textMuted: 'text-green-200/70',
      accent: 'bg-green-700/50',
      border: 'border-green-700',
      shadow: 'shadow-green-900/60',
      button: 'bg-green-500 text-white hover:bg-green-600',
      buttonOutline: 'border-green-500 text-green-500 hover:bg-green-500/10',
    },
    meta: {
      description: 'Forest theme',
    }
  },
  // Add more themes...
};

// Use your custom themes
<ThemeProvider options={{ themes: myThemes }}>
  <App />
</ThemeProvider>
```

## Advanced Options

### Theme Scheduling

Automatically switch themes based on time of day:

```jsx
<ThemeProvider
  options={{
    scheduleThemes: [
      { theme: 'dark', from: '20:00', to: '07:00' },
      { theme: 'light', from: '07:00', to: '20:00' }
    ]
  }}
>
  <App />
</ThemeProvider>
```

### System Preference Integration

Follow the user's system preference:

```jsx
<ThemeProvider
  options={{
    followSystemPreference: true,
    // Only follow system preference initially, but keep user's choice after they select a theme
    // followSystemPreference: 'initial-only',
  }}
>
  <App />
</ThemeProvider>
```

### Custom Storage

Change where and how theme preferences are stored:

```jsx
<ThemeProvider
  options={{
    // Use session storage (default is localStorage)
    storageType: 'session',
    // Custom storage key (default is 'react-theme-master-theme')
    storageKey: 'my-app-theme',
    // Custom theme change callback
    onThemeChange: (themeName, theme) => {
      // Store theme in your own storage system
      console.log(`Theme changed to ${themeName}`);
    }
  }}
>
  <App />
</ThemeProvider>
```

### Theme Transitions

Configure smooth transitions between themes:

```jsx
<ThemeProvider
  options={{
    // Transition duration in milliseconds (set to 0 to disable)
    transitionDuration: 500,
  }}
>
  <App />
</ThemeProvider>
```

## Accessibility

React Theme Master is designed with accessibility in mind:

- Theme toggles include proper aria attributes
- Transitions can be disabled for users with motion sensitivity
- Color themes maintain proper contrast ratios
- Components are keyboard navigable

## TypeScript Support

This package is built with TypeScript and includes comprehensive type definitions:

```tsx
import type { 
  Theme,
  ThemeColors,
  ThemeProviderOptions,
  ThemeSelectorProps,
} from 'react-theme-master';

// Define your own themes with type safety
const myTheme: Theme = {
  name: 'custom',
  colors: {
    primary: 'bg-indigo-900',
    // ... other required colors
  }
};
```

## Utility Functions

The package includes several utility functions for advanced use cases:

```jsx
import { 
  // Storage utilities
  loadThemeFromStorage,
  saveThemeToStorage,
  
  // Theme validation 
  isValidTheme,
  normalizeThemes,
  
  // System theme detection
  getSystemTheme,
  createSystemThemeListener,
  
  // CSS variable management
  applyThemeToCssVars,
  setupThemeTransition,
  
  // Tailwind safelist
  generateSafelist,
} from 'react-theme-master';

// Example: Manually get stored theme
const savedTheme = loadThemeFromStorage('my-storage-key');
```

## Server-Side Rendering

React Theme Master works with server-side rendering frameworks like Next.js. For proper hydration, use the `initialTheme` option when setting up the provider:

```jsx
<ThemeProvider options={{ initialTheme: 'light' }}>
  <App />
</ThemeProvider>
```

## Browser Support

- Modern browsers: Chrome, Firefox, Safari, Edge
- IE11 support requires appropriate polyfills

## Contributing

Contributions are welcome! Please check out our [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the React community.