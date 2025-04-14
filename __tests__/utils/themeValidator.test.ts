import {
    isValidTheme,
    isValidThemeColors,
    normalizeThemes,
    colorsToTheme
  } from '../../src/utils/themeValidator';
  import { Theme, ThemeColors } from '../../src/types';
  
  describe('Theme Validator Utils', () => {
    const validColors: ThemeColors = {
      primary: 'bg-blue-500',
      secondary: 'bg-blue-600',
      text: 'text-white',
      textMuted: 'text-blue-200',
      accent: 'bg-blue-400',
      border: 'border-blue-700',
      shadow: 'shadow-blue-500/50',
      button: 'bg-blue-500 hover:bg-blue-600',
      buttonOutline: 'border-blue-500 text-blue-500'
    };
  
    const validTheme: Theme = {
      name: 'test',
      colors: validColors,
      meta: {
        description: 'Test theme'
      }
    };
  
    test('isValidThemeColors validates color objects correctly', () => {
      // Valid colors
      expect(isValidThemeColors(validColors)).toBe(true);
  
      // Missing required property
      const missingPrimary = { ...validColors } as Partial<ThemeColors>;
      // Using type assertion to make TypeScript happy with the delete operation
      missingPrimary.primary = undefined as any;
      expect(isValidThemeColors(missingPrimary as ThemeColors)).toBe(false);
  
      // Non-string property
      const numberProperty = { 
        ...validColors, 
        // @ts-ignore - Testing invalid type
        primary: 123 
      };
      expect(isValidThemeColors(numberProperty)).toBe(false);
  
      // Null input
      expect(isValidThemeColors(null)).toBe(false);
  
      // Non-object input
      expect(isValidThemeColors('string' as any)).toBe(false);
    });
  
    test('isValidTheme validates theme objects correctly', () => {
      // Valid theme
      expect(isValidTheme(validTheme)).toBe(true);
  
      // Missing name
      const missingName = { ...validTheme } as Partial<Theme>;
      missingName.name = undefined as any;
      expect(isValidTheme(missingName as Theme)).toBe(false);
  
      // Empty name
      const emptyName = { ...validTheme, name: '' };
      expect(isValidTheme(emptyName)).toBe(false);
  
      // Missing colors
      const missingColors = { ...validTheme } as Partial<Theme>;
      missingColors.colors = undefined as any;
      expect(isValidTheme(missingColors as Theme)).toBe(false);
  
      // Invalid colors
      const invalidColors = { 
        ...validTheme, 
        colors: { primary: 'bg-blue-500' } as ThemeColors // Missing required properties
      };
      expect(isValidTheme(invalidColors)).toBe(false);
  
      // Null input
      expect(isValidTheme(null)).toBe(false);
  
      // Non-object input
      expect(isValidTheme('string' as any)).toBe(false);
    });
  
    test('colorsToTheme creates a proper theme object', () => {
      const theme = colorsToTheme('test', validColors);
  
      expect(theme).toEqual({
        name: 'test',
        colors: validColors,
        meta: {
          description: 'Test theme'
        }
      });
  
      // Should capitalize first letter in description
      const theme2 = colorsToTheme('custom', validColors);
      expect(theme2.meta?.description).toBe('Custom theme');
    });
  
    test('normalizeThemes processes mixed theme inputs correctly', () => {
      const inputThemes: Record<string, Theme | ThemeColors | any> = {
        theme1: validTheme, // Already a Theme
        theme2: validColors, // Just ThemeColors
        theme3: null, // Invalid
        theme4: { // Invalid - missing properties
          name: 'invalid',
          colors: { primary: 'bg-red-500' }
        }
      };
  
      // Spy on console.warn
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  
      const normalizedThemes = normalizeThemes(inputThemes);
  
      // Should have 2 valid themes
      expect(Object.keys(normalizedThemes).length).toBe(2);
      
      // theme1 should be unchanged
      expect(normalizedThemes.theme1).toEqual(validTheme);
      
      // theme2 should be converted to a Theme
      expect(normalizedThemes.theme2).toHaveProperty('name', 'theme2');
      expect(normalizedThemes.theme2).toHaveProperty('colors', validColors);
      
      // Invalid themes should be logged and skipped
      expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
      expect(normalizedThemes.theme3).toBeUndefined();
      expect(normalizedThemes.theme4).toBeUndefined();
  
      consoleWarnSpy.mockRestore();
    });
  });