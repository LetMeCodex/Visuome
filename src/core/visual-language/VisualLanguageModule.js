import { VisualLanguageEngine } from "./VisualLanguageEngine.js";

export class VisualLanguageModule {
  initialize() {
    this.engine = new VisualLanguageEngine();
  }

  /**
   * Run the Visual Language Analysis on the final ScanResult.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} VisualLanguageRegistry structured data.
   */
  async scan(session) {
    if (!session.scanResult) {
      console.warn("VisualLanguageModule: No scanResult found in session. Skipping visual analysis.");
      return {};
    }

    const registry = await this.engine.process(session.scanResult);
    
    // Append registry to scanResult as required
    session.scanResult.visualLanguageRegistry = registry;
    
    return registry;
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
