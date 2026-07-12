import { GenomeAnalyzerInterface } from "./GenomeAnalyzerInterface.js";

/**
 * Normalizes Platform Registry data nodes.
 */
export class PlatformDNAExtractor extends GenomeAnalyzerInterface {
  async extract(scanResult) {
    const platform = scanResult.platformRegistry || {};
    return {
      pages: platform.pageRegistry || [],
      templates: platform.templateRegistry || [],
      patterns: platform.patternRegistry || [],
      assets: platform.assetRegistry || {},
      technologies: platform.technologyRegistry || {},
      responsive: platform.responsiveRegistry || {},
      confidence: platform.confidence || { score: 100 }
    };
  }

  name() {
    return "PlatformDNAExtractor";
  }

  version() {
    return "1.0.0";
  }

  dependencies() {
    return ["platformRegistry"];
  }
}
