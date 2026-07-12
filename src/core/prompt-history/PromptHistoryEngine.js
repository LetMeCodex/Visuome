import { PromptHistoryRegistry } from "./PromptHistoryRegistry.js";
import { PromptVersionNode } from "./PromptVersionNode.js";
import { eventBus } from "../EventBus.js";

/**
 * Manages caching history nodes to LocalStorage offline.
 */
export class PromptHistoryEngine {
  /**
   * Save node state into local storage.
   * @param {string} genomeId
   * @param {PromptVersionNode} node
   */
  static save(genomeId, node) {
    if (!genomeId || !node) return;

    try {
      const key = `visuome_history_${genomeId}`;
      const existingRaw = localStorage.getItem(key);
      let registry;

      if (existingRaw) {
        const parsed = JSON.parse(existingRaw);
        registry = new PromptHistoryRegistry(parsed);
      } else {
        registry = new PromptHistoryRegistry({ genomeId });
      }

      registry.nodes.push(node);
      registry.lastUpdated = new Date().toISOString();

      localStorage.setItem(key, JSON.stringify(registry));
      eventBus.publish("PROMPT_HISTORY_UPDATED", registry);
    } catch (e) {
      console.warn("PromptHistoryEngine: Storage write failed.", e);
    }
  }

  /**
   * Retrieve nodes list.
   * @param {string} genomeId
   * @returns {PromptHistoryRegistry}
   */
  static getHistory(genomeId) {
    if (!genomeId) return new PromptHistoryRegistry();

    try {
      const key = `visuome_history_${genomeId}`;
      const existingRaw = localStorage.getItem(key);
      if (existingRaw) {
        return new PromptHistoryRegistry(JSON.parse(existingRaw));
      }
    } catch (e) {
      console.warn("PromptHistoryEngine: Storage read failed.", e);
    }

    return new PromptHistoryRegistry({ genomeId });
  }
}
