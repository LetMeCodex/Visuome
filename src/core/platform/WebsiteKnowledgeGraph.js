/**
 * WebsiteKnowledgeGraph schema container representing relationships between domains, pages, assets, and components.
 * Contains no logical calculations or processing steps.
 */
export class WebsiteKnowledgeGraph {
  constructor(data = {}) {
    this.websiteNode = data.websiteNode || {
      domain: "",
      crawledAt: new Date().toISOString()
    };
    this.pages = data.pages || []; // Array of PageNode
    this.sections = data.sections || []; // Array of SectionNode
    this.components = data.components || [];
    this.relationships = data.relationships || []; // Array of RelationshipEdge
    this.assets = data.assets || [];
    this.templates = data.templates || [];
    this.patterns = data.patterns || [];
    this.designSystem = data.designSystem || null;
    this.technologies = data.technologies || [];
    this.responsiveVariants = data.responsiveVariants || [];
    this.evidence = data.evidence || [];
    this.discoveryMetadata = data.discoveryMetadata || {
      crawlerVersion: "1.0.0",
      crawlDepthCap: 3,
      maxPagesCap: 100
    };
  }
}
