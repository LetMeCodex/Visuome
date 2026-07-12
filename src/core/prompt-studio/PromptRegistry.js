/**
 * Master prompt registry holding rendered output profiles.
 */
export class PromptRegistry {
  constructor(data = {}) {
    this.metadata = data.metadata || {
      promptId: "",
      genomeId: "",
      generatedAt: new Date().toISOString(),
      version: "1.0.0",
      compatibilityVersion: "1.0.0"
    };

    this.masterPrompt = data.masterPrompt || "";
    this.clonePrompt = data.clonePrompt || "";
    this.genomeMixerPrompt = data.genomeMixerPrompt || "";
    this.learningPrompt = data.learningPrompt || "";
    this.developerPrompt = data.developerPrompt || "";
    this.designSystemPrompt = data.designSystemPrompt || "";

    this.confidence = data.confidence || {
      score: 100,
      explanation: "All prompt profiles generated successfully.",
      factors: []
    };

    this.diagnostics = data.diagnostics || {
      executionTimeMs: 0,
      generatedProfiles: 0,
      serializer: "markdown",
      validationStatus: "PASS"
    };
  }
}
