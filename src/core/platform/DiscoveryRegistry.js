/**
 * Registry mapping raw website discovery findings.
 */
export class DiscoveryRegistry {
  constructor(data = {}) {
    this.pages = data.pages || []; // Array of PageNode snapshots
    this.templates = data.templates || []; // Array of detected layout template variants
    this.relationships = data.relationships || []; // Array of RelationshipEdge connections
    this.navigation = data.navigation || {
      primary: [],
      secondary: [],
      footer: [],
      sidebar: [],
      breadcrumbs: [],
      pagination: []
    };
    this.diagnostics = data.diagnostics || {
      crawledCount: 0,
      depthReached: 0,
      skippedCount: 0,
      executionTimeMs: 0
    };
  }
}
