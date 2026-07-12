/**
 * Schema representing edge connections between nodes in the website knowledge graph.
 */
export class RelationshipEdge {
  constructor(data = {}) {
    this.source = data.source || "";
    this.target = data.target || "";
    this.relationshipType = data.relationshipType || "child"; // child, contains, transitions, links, inherits
    this.confidence = data.confidence || {
      score: 100,
      factors: []
    };
    this.evidence = data.evidence || [];
  }
}
