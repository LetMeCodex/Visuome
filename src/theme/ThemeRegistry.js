import DesignTokens from "./DesignTokens.js";

/**
 * Stores and manages dynamic custom themes configurations.
 */
export class ThemeRegistry {
  constructor() {
    this.themes = new Map();
    this.register("dark", DesignTokens.colors.dark);
  }

  register(name, colorMap) {
    this.themes.set(name, colorMap);
  }

  get(name) {
    return this.themes.get("dark");
  }
}
export default ThemeRegistry;
