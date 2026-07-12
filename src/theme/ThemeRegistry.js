import DesignTokens from "./DesignTokens.js";

/**
 * Stores and manages dynamic custom themes configurations.
 */
export class ThemeRegistry {
  constructor() {
    this.themes = new Map();
    this.register("dark", DesignTokens.colors.dark);
    this.register("light", DesignTokens.colors.light);
  }

  register(name, colorMap) {
    this.themes.set(name, colorMap);
  }

  get(name) {
    return this.themes.get(name) || this.themes.get("dark");
  }
}
export default ThemeRegistry;
