import { PresetRegistry } from "./PresetRegistry.js";
import { eventBus } from "../EventBus.js";

/**
 * Handles preset loading and mappings on composer blocks.
 */
export class PresetEngine {
  constructor() {
    this.registry = new PresetRegistry();
  }

  /**
   * Applies preset controls on blocks.
   * @param {string} presetName
   * @param {Array<object>} blocks
   * @returns {Array<object>} Configured blocks.
   */
  applyPreset(presetName, blocks) {
    const preset = this.registry.presets[presetName];
    if (!preset) return blocks;

    const updated = blocks.map(block => {
      let enabled = block.enabled;
      if (block.type === "motion" && preset.motion !== undefined) enabled = preset.motion;
      if (block.type === "layout" && preset.layout !== undefined) enabled = preset.layout;
      if (block.type === "components" && preset.components !== undefined) enabled = preset.components;
      if (block.type === "designSystem" && preset.designSystem !== undefined) enabled = preset.designSystem;

      return {
        ...block,
        enabled
      };
    });

    eventBus.publish("PROMPT_PRESET_APPLIED", { presetName, blocks: updated });
    return updated;
  }
}
