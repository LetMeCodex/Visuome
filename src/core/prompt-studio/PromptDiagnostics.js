/**
 * Calculates prompt generation profiling metrics (lengths, min/max bounds, formats).
 */
export class PromptDiagnostics {
  /**
   * Generates performance telemetry for a PromptRegistry build.
   * @param {object} promptRegistry
   * @param {number} genMs
   * @param {number} valMs
   * @param {number} serMs
   * @returns {object} Telemetry report payload.
   */
  static generate(promptRegistry, genMs = 0, valMs = 0, serMs = 0) {
    if (!promptRegistry) return {};

    const profiles = [
      "masterPrompt", "clonePrompt", "genomeMixerPrompt",
      "learningPrompt", "developerPrompt", "designSystemPrompt"
    ];

    const sizes = {};
    let totalLength = 0;
    let maxLen = 0;
    let minLen = Infinity;
    let largest = "";
    let smallest = "";

    for (const key of profiles) {
      const len = promptRegistry[key]?.length || 0;
      sizes[key] = len;
      totalLength += len;

      if (len > maxLen) {
        maxLen = len;
        largest = key;
      }
      if (len < minLen) {
        minLen = len;
        smallest = key;
      }
    }

    return {
      generationTimeMs: genMs,
      validationTimeMs: valMs,
      serializationTimeMs: serMs,
      profileCount: profiles.length,
      promptSizes: sizes,
      averageLength: Math.round(totalLength / profiles.length),
      largestPrompt: largest,
      smallestPrompt: smallest,
      formattingType: "markdown"
    };
  }
}
