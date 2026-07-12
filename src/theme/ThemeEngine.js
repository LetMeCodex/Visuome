import ThemeRegistry from "./ThemeRegistry.js";
import DesignTokens from "./DesignTokens.js";

/**
 * Maps DesignTokens to document root custom CSS properties.
 */
export class ThemeEngine {
  constructor() {
    this.registry = new ThemeRegistry();
  }

  /**
   * Applies the target theme onto document element root.
   * @param {string} themeName light, dark
   */
  applyTheme(themeName) {
    const colors = this.registry.get(themeName);
    const root = document.documentElement;

    // Apply color variables
    for (const [key, val] of Object.entries(colors)) {
      root.style.setProperty(`--color-${key}`, val);
    }

    // Apply layout variables
    for (const [key, val] of Object.entries(DesignTokens.spacing)) {
      root.style.setProperty(`--spacing-${key}`, val);
    }

    for (const [key, val] of Object.entries(DesignTokens.radius)) {
      root.style.setProperty(`--radius-${key}`, val);
    }

    for (const [key, val] of Object.entries(DesignTokens.elevation)) {
      root.style.setProperty(`--elevation-${key}`, val);
    }

    root.setAttribute("data-theme", themeName);
  }
}
export default ThemeEngine;
