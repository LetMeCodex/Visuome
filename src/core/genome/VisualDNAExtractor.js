import { GenomeAnalyzerInterface } from "./GenomeAnalyzerInterface.js";

/**
 * Normalizes Typography, Color, Spacing, Layout, Components, Visual Language, and Design Philosophy registries.
 */
export class VisualDNAExtractor extends GenomeAnalyzerInterface {
  async extract(scanResult) {
    return {
      typography: scanResult.typographyRegistry || {},
      colors: scanResult.colorRegistry || {},
      spacing: scanResult.spacingRegistry || {},
      layout: scanResult.layoutRegistry || {},
      components: scanResult.componentRegistry || {},
      visualLanguage: scanResult.visualLanguageRegistry || {},
      designPhilosophy: scanResult.designPhilosophyRegistry || {},
      confidence: scanResult.confidenceAnalysis || { score: 100 },
      evidence: scanResult.evidence || []
    };
  }

  name() {
    return "VisualDNAExtractor";
  }

  version() {
    return "1.0.0";
  }

  dependencies() {
    return ["typographyRegistry", "colorRegistry", "spacingRegistry", "layoutRegistry"];
  }
}
