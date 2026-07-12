/**
 * Master registry container for website-wide intelligence.
 * Contains no logical calculations or processing steps.
 */
export class PlatformRegistry {
  constructor(data = {}) {
    this.websiteMetadata = data.websiteMetadata || {
      domain: "",
      crawledAt: new Date().toISOString(),
      totalPagesFound: 0
    };
    this.pageRegistry = data.pageRegistry || [];
    this.sectionRegistry = data.sectionRegistry || [];
    this.relationshipRegistry = data.relationshipRegistry || [];
    this.assetRegistry = data.assetRegistry || {};
    this.technologyRegistry = data.technologyRegistry || {};
    this.responsiveRegistry = data.responsiveRegistry || {};
    
    this.crawlDiagnostics = data.crawlDiagnostics || {
      pagesAttempted: 0,
      pagesSucceeded: 0,
      pagesFailed: 0,
      errors: []
    };
    
    this.crawlSession = data.crawlSession || null;
    this.crawlStatistics = data.crawlStatistics || null;
    this.pageMetadata = data.pageMetadata || [];

    this.knowledgeGraph = data.knowledgeGraph || null;
    this.componentGraph = data.componentGraph || [];
    this.assetGraph = data.assetGraph || [];
    this.relationshipGraph = data.relationshipGraph || [];
    this.templateRegistry = data.templateRegistry || [];
    this.patternRegistry = data.patternRegistry || [];
    this.designSystemRegistry = data.designSystemRegistry || null;
    this.graphStatistics = data.graphStatistics || {
      totalNodes: 0,
      totalEdges: 0,
      duplicateNodesRemoved: 0,
      duplicateEdgesRemoved: 0,
      graphDepth: 0,
      graphDensity: 0,
      connectedComponents: 1,
      validationStatus: "PASS",
      optimizationRatio: 1.0
    };
    
    this.confidence = data.confidence || {
      score: 0,
      explanation: "No platform discovery has run.",
      factors: []
    };
    
    this.evidence = data.evidence || [];
    this.diagnostics = data.diagnostics || {
      executionTimeMs: 0,
      analyzersRun: []
    };
  }
}
