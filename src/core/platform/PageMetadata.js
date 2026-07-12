/**
 * Data schema representing crawling metadata parameters for a single page node.
 * Contains no logical calculations or processing steps.
 */
export class PageMetadata {
  constructor(data = {}) {
    this.url = data.url || "";
    this.canonicalUrl = data.canonicalUrl || "";
    this.title = data.title || "";
    this.pageType = data.pageType || "Unknown";
    this.templateId = data.templateId || "";
    this.depth = data.depth || 0;
    this.priority = data.priority || 0;
    this.parentPage = data.parentPage || null;
    this.discoveredFrom = data.discoveredFrom || null;
    this.status = data.status || "discovered"; // discovered, pending, visited, failed
    this.visited = data.visited || false;
    this.confidence = data.confidence || {
      score: 100,
      factors: []
    };
  }
}
