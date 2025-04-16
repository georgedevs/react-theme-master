"use client"

import  React from "react"
import { useState, useRef, useEffect } from "react"
import type { ThemeSelectorProps } from "../types"
import { useTheme } from "../hooks/useTheme"

/**
 * ThemeSelector component
 * UI for selecting themes
 *
 * @param {ThemeSelectorProps} props - ThemeSelector props
 * @returns {JSX.Element} ThemeSelector component
 *
 * @example
 * \`\`\`tsx
 * // Basic dropdown
 * <ThemeSelector />
 *
 * // Grid of theme options
 * <ThemeSelector variant="grid" showPreview={true} />
 *
 * // Button group
 * <ThemeSelector variant="buttons" />
 *
 * // Icons only
 * <ThemeSelector variant="icons" />
 * \`\`\`
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  variant = "dropdown",
  showLabels = true,
  size = "md",
  placement = "bottom",
  className = "",
  style,
  onChange,
  themeIcons,
  showPreview = false,
  previewType = "color-circles",
}) => {
  const { theme, setTheme, availableThemes, themeObject } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle theme change
  const handleThemeChange = (themeName: string) => {
    setTheme(themeName)
    setIsOpen(false)

    if (onChange) {
      onChange(themeName)
    }
  }

  // Determine size classes
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  // Generate icon for a theme
  const getThemeIcon = (themeName: string) => {
    // If custom icon is provided, use it
    if (themeIcons && themeIcons[themeName]) {
      return themeIcons[themeName]
    }

    // Default icons
    switch (themeName) {
      case "light":
        return (
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
        )
      case "dark":
        return (
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )
      case "blue":
        return (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <circle cx="12" cy="12" r="7" fill="#3B82F6" />
          </svg>
        )
      case "green":
        return (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <circle cx="12" cy="12" r="7" fill="#10B981" />
          </svg>
        )
      case "purple":
        return (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <circle cx="12" cy="12" r="7" fill="#8B5CF6" />
          </svg>
        )
      default:
        return (
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
          </svg>
        )
    }
  }

  // Generate theme preview
  const generateThemePreview = (themeName: string) => {
    if (!showPreview) return null

    if (previewType === "color-circles") {
      return (
        <div className="flex gap-1.5 mt-1">
          {["primary", "secondary", "accent", "button"].map((colorKey) => {
            const themeColorClass = themeObject.colors[colorKey as keyof typeof themeObject.colors]
            return <div key={colorKey} className={`w-2.5 h-2.5 rounded-full ${themeColorClass}`} title={colorKey} />
          })}
        </div>
      )
    }

    if (previewType === "mini-mockup") {
      return (
        <div className="w-14 h-8 mt-1 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col shadow-sm">
          <div className={`flex-grow ${themeObject.colors.primary}`} />
          <div className={`h-2.5 ${themeObject.colors.accent}`} />
        </div>
      )
    }

    return null
  }

  // Render dropdown variant
  if (variant === "dropdown") {
    return (
      <div className={`relative ${className} ${sizeClasses[size]}`} style={style} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all ${
            themeObject.colors.buttonOutline
          } hover:${themeObject.colors.accent} hover:bg-opacity-10`}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-1.5">
            {getThemeIcon(theme)}
            {showLabels && (
              <span className={themeObject.colors.text}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
            )}
          </span>
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {isOpen && (
          <div
            className={`absolute z-50 mt-1 w-52 rounded-lg shadow-lg p-1.5 ${themeObject.colors.secondary} border ${themeObject.colors.border} ${
              placement === "top"
                ? "bottom-full mb-1"
                : placement === "left"
                  ? "right-full mr-1"
                  : placement === "right"
                    ? "left-full ml-1"
                    : "top-full mt-1"
            }`}
            style={{ backdropFilter: "blur(8px)" }}
          >
            {availableThemes.map((themeName) => (
              <button
                key={themeName}
                onClick={() => handleThemeChange(themeName)}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2.5 mb-0.5 transition-all hover:${themeObject.colors.accent} hover:bg-opacity-10 ${
                  theme === themeName ? `${themeObject.colors.accent} bg-opacity-15` : ""
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6">{getThemeIcon(themeName)}</div>
                <div className="flex flex-col">
                  <span className={`${themeObject.colors.text}`}>
                    {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                  </span>
                  {generateThemePreview(themeName)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Render buttons variant
  if (variant === "buttons") {
    return (
      <div className={`flex gap-1.5 ${className} ${sizeClasses[size]}`} style={style}>
        {availableThemes.map((themeName) => (
          <button
            key={themeName}
            onClick={() => handleThemeChange(themeName)}
            className={`px-2.5 py-1.5 rounded-md flex items-center gap-2 transition-all ${
              theme === themeName
                ? `${themeObject.colors.button} shadow-sm`
                : `${themeObject.colors.buttonOutline} hover:${themeObject.colors.accent} hover:bg-opacity-10`
            }`}
            aria-pressed={theme === themeName}
          >
            <div className="flex items-center justify-center w-5 h-5">{getThemeIcon(themeName)}</div>
            {showLabels && (
              <span className={themeObject.colors.text}>{themeName.charAt(0).toUpperCase() + themeName.slice(1)}</span>
            )}
          </button>
        ))}
      </div>
    )
  }

  // Render grid variant
  if (variant === "grid") {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 ${className}`} style={style}>
        {availableThemes.map((themeName) => (
          <button
            key={themeName}
            onClick={() => handleThemeChange(themeName)}
            className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${
              theme === themeName
                ? `${themeObject.colors.accent} bg-opacity-15 shadow-sm`
                : `hover:${themeObject.colors.accent} hover:bg-opacity-10`
            }`}
            aria-pressed={theme === themeName}
          >
            <div className="p-2.5 rounded-full bg-opacity-10 mb-1">{getThemeIcon(themeName)}</div>
            {showLabels && (
              <span className={`text-sm ${themeObject.colors.text}`}>
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              </span>
            )}
            {generateThemePreview(themeName)}
          </button>
        ))}
      </div>
    )
  }

  // Render icons variant
  if (variant === "icons") {
    return (
      <div className={`flex gap-1.5 ${className}`} style={style}>
        {availableThemes.map((themeName) => (
          <button
            key={themeName}
            onClick={() => handleThemeChange(themeName)}
            className={`p-1.5 rounded-full transition-all ${
              theme === themeName
                ? `${themeObject.colors.button} shadow-sm`
                : `${themeObject.colors.buttonOutline} hover:${themeObject.colors.accent} hover:bg-opacity-10`
            }`}
            aria-pressed={theme === themeName}
            title={themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          >
            {getThemeIcon(themeName)}
          </button>
        ))}
      </div>
    )
  }

  // Fallback to dropdown
  return <div>Invalid variant</div>
}

export default ThemeSelector
