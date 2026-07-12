/**
 * Schema representing an observed section container within the website knowledge graph.
 */
export class SectionNode {
  constructor(data = {}) {
    this.id = data.id || "";
    this.name = data.name || "";
    this.parent = data.parent || null;
    this.components = data.components || [];
    this.relationships = data.relationships || [];
  }
}
