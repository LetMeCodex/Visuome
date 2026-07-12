/**
 * Represents a single version state in prompt history.
 */
export class PromptVersionNode {
  constructor(data = {}) {
    this.versionId = data.versionId || `v-${Math.random().toString(36).slice(2, 11)}`;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.promptText = data.promptText || "";
    this.preset = data.preset || "Custom";
    this.variables = data.variables || [];
    this.genomeVersion = data.genomeVersion || "1.0.0";
    this.checksum = data.checksum || "";
    this.changeSummary = data.changeSummary || "Initial save";
  }
}
