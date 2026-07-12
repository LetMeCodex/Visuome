/**
 * Schema representing a single page node within the website knowledge graph.
 */
export class PageNode {
  constructor(data = {}) {
    this.url = data.url || "";
    this.title = data.title || "";
    this.type = data.type || "landing"; // landing, auth, dashboard, documentation, custom
    this.children = data.children || []; // Sub-routes url strings or IDs
    this.relationships = data.relationships || [];
    this.confidence = data.confidence || {
      score: 100,
      factors: []
    };
  }
}
