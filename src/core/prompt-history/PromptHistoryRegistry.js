/**
 * Schema registry storing historical versions.
 */
export class PromptHistoryRegistry {
  constructor(data = {}) {
    this.genomeId = data.genomeId || "";
    this.nodes = data.nodes || [];
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
  }
}
