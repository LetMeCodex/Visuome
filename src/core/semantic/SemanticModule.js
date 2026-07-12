import { SemanticEngine } from "./SemanticEngine.js";

export class SemanticModule {
  initialize() {
    this.engine = new SemanticEngine();
  }

  /**
   * Run the Semantic Intelligence analysis on the final ScanResult.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} SemanticRegistry structured data.
   */
  async scan(session) {
    if (!session.scanResult) {
      console.warn("SemanticModule: No scanResult found in session. Skipping semantic analysis.");
      return {};
    }

    const registry = await this.engine.process(session.scanResult);
    
    // Append registry to scanResult as required
    session.scanResult.semanticRegistry = registry;
    
    return registry;
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
