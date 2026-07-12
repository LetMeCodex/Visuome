/**
 * Validates prompt registry profiles parameters and content size limits.
 */
export class PromptValidator {
  /**
   * Run structural and content checks on a PromptRegistry object.
   * @param {object} promptRegistry
   * @returns {object} { valid, errors, warnings }
   */
  static validate(promptRegistry) {
    const errors = [];
    const warnings = [];

    if (!promptRegistry) {
      return { valid: false, errors: ["Prompt registry is undefined."], warnings: [] };
    }

    const required = [
      "masterPrompt", "clonePrompt", "genomeMixerPrompt",
      "learningPrompt", "developerPrompt", "designSystemPrompt"
    ];
    for (const r of required) {
      if (!promptRegistry[r]) {
        errors.push(`Missing profile key section: "${r}".`);
      } else if (promptRegistry[r].length < 10) {
        errors.push(`Profile content for "${r}" is too short (${promptRegistry[r].length} chars).`);
      }
    }

    if (!promptRegistry.metadata) {
      errors.push("Missing core metadata object.");
    } else {
      if (!promptRegistry.metadata.promptId) errors.push("Missing metadata promptId.");
      if (!promptRegistry.metadata.genomeId) errors.push("Missing metadata genomeId.");
    }

    const totalLength = required.reduce((acc, k) => acc + (promptRegistry[k]?.length || 0), 0);
    if (totalLength > 100000) {
      warnings.push(`Combined prompts content length is high (${totalLength} chars). Might exceed target context windows.`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
