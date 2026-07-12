import { ExportEngine } from "./ExportEngine.js";
import { eventBus } from "../EventBus.js";

/**
 * Pipeline stage module wrapping Prompt Export runs.
 */
export class ExportModule {
  initialize() {
    this.engine = new ExportEngine();
  }

  /**
   * Run Prompt Export scans.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} ExportRegistry.
   */
  async scan(session) {
    if (!session.scanResult || !session.scanResult.promptRegistry) {
      console.warn("ExportModule: No promptRegistry found. Skipping.");
      return {};
    }

    eventBus.publish("PROMPT_EXPORT_STARTED", session);
    const registry = await this.engine.buildExport(session.scanResult.promptRegistry);

    session.scanResult.promptExports = registry;

    eventBus.publish("PROMPT_EXPORT_FINISHED", session);
    return registry;
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
