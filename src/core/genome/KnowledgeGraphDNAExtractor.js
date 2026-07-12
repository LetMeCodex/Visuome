import { GenomeAnalyzerInterface } from "./GenomeAnalyzerInterface.js";

/**
 * Outputs a normalized snapshot of the WebsiteKnowledgeGraph domain, page, component, asset, pattern, and relationship nodes.
 */
export class KnowledgeGraphDNAExtractor extends GenomeAnalyzerInterface {
  async extract(scanResult) {
    const platform = scanResult.platformRegistry || {};
    const kg = platform.knowledgeGraph || {};
    return {
      website: kg.websiteNode || {},
      pages: kg.pages || [],
      sections: kg.sections || [],
      components: kg.components || [],
      assets: kg.assets || [],
      relationships: kg.relationships || [],
      patterns: kg.patterns || []
    };
  }

  name() {
    return "KnowledgeGraphDNAExtractor";
  }

  version() {
    return "1.0.0";
  }

  dependencies() {
    return ["platformRegistry"];
  }
}
