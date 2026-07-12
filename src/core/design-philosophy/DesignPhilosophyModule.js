import { DesignPhilosophyEngine } from "./DesignPhilosophyEngine.js";

export class DesignPhilosophyModule {
  initialize() {
    this.engine = new DesignPhilosophyEngine();
  }

  /**
   * Run the Design Philosophy analysis on the final ScanResult.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} DesignPhilosophyRegistry structured data.
   */
  async scan(session) {
    if (!session.scanResult) {
      console.warn("DesignPhilosophyModule: No scanResult found in session. Skipping philosophy analysis.");
      return {};
    }

    const registry = await this.engine.process(session.scanResult);
    
    // Append registry to scanResult as required
    session.scanResult.designPhilosophyRegistry = registry;
    
    return registry;
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
