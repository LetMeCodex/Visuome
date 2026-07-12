import { PromptStudioEngine } from "./PromptStudioEngine.js";
import { eventBus } from "../EventBus.js";

/**
 * Pipeline stage module wrapping Prompt Studio run sequences.
 */
export class PromptStudioModule {
  initialize() {
    this.engine = new PromptStudioEngine();
  }

  /**
   * Run Prompt Studio prompt profiles generation.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} PromptRegistry.
   */
  async scan(session) {
    console.log("PromptStudioModule: Executing scan hook...");
    if (!session.scanResult || !session.scanResult.designGenome) {
      console.warn("PromptStudioModule: No designGenome found. Skipping.");
      return {};
    }
    console.log("GENOME BUILT: active genome found inside session");

    eventBus.publish("PROMPT_BUILDING", session);
    console.log("PROMPTS GENERATED: building registry using PromptStudioEngine...");
    const registry = await this.engine.buildRegistry(session.scanResult.designGenome);

    session.scanResult.promptRegistry = registry;
    console.log("PROMPTS REGISTERED: promptRegistry successfully written into ScanResult", registry);

    return registry;
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
