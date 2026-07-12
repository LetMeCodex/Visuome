/**
 * Handles serialization of prompt profiles, preserving strict ordering keys.
 */
export class PromptSerializer {
  /**
   * Serializes prompt profiles into string outputs.
   * @param {object} promptRegistry
   * @param {string} format markdown, txt, json
   * @returns {string}
   */
  static serialize(promptRegistry, format = "markdown") {
    if (!promptRegistry) return "";

    const orderedKeys = [
      "masterPrompt",
      "clonePrompt",
      "genomeMixerPrompt",
      "learningPrompt",
      "developerPrompt",
      "designSystemPrompt"
    ];

    switch (format.toLowerCase()) {
      case "json": {
        const out = {};
        for (const k of orderedKeys) {
          out[k] = promptRegistry[k];
        }
        return JSON.stringify(out, null, 2);
      }
      case "txt":
      case "text": {
        let out = "";
        for (const k of orderedKeys) {
          out += `=== ${k.toUpperCase()} ===\n${promptRegistry[k]}\n\n`;
        }
        return out.trim();
      }
      case "markdown":
      default: {
        let out = "";
        for (const k of orderedKeys) {
          out += `## ${k}\n\n${promptRegistry[k]}\n\n`;
        }
        return out.trim();
      }
    }
  }
}
