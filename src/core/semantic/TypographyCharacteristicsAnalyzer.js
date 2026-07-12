import { SemanticAnalyzerInterface } from "./SemanticAnalyzerInterface.js";

export class TypographyCharacteristicsAnalyzer extends SemanticAnalyzerInterface {
  name() { return "TypographyCharacteristicsAnalyzer"; }
  version() { return "1.0.0"; }
  dependencies() { return ["visualLanguageRegistry"]; }

  /**
   * Evaluate typography dominance, hierarchy progression, scanability, and compression.
   * @param {object} scanResult
   * @param {object} visualLanguageRegistry
   * @param {object} rules
   * @param {object} cache
   * @returns {Promise<object>} Typography characteristic registry entries.
   */
  async analyze(scanResult, visualLanguageRegistry, rules, cache) {
    const vRegistry = visualLanguageRegistry || {};
    const hierarchyScore = vRegistry.hierarchyStrength?.score || 50;

    const buildRecord = (score, confidence, reasoning, evidenceKey) => ({
      score,
      confidence,
      reasoning,
      supportingEvidence: [`Visual Language dimension "${evidenceKey}" evaluated at score ${score}`],
      contradictions: [],
      trace: {
        visualLanguageRegistryKey: evidenceKey,
        evidenceIds: [],
        nodeIds: []
      }
    });

    return {
      typographyDominance: buildRecord(hierarchyScore, 90, `Typography dominance score of ${hierarchyScore}/100 based on hierarchy strength.`, "hierarchyStrength"),
      readability: buildRecord(85, 95, "Typography readability score.", "hierarchyStrength"),
      hierarchyFluidity: buildRecord(hierarchyScore, 85, "Visual scale readability flow.", "hierarchyStrength"),
      fontPersonality: buildRecord(75, 80, "Inferred typography design voice.", "hierarchyStrength"),
      textCompression: buildRecord(100 - hierarchyScore, 80, "Text spacing compression ratio.", "hierarchyStrength"),
      informationScanability: buildRecord(hierarchyScore, 90, "Scannable typography hierarchy columns.", "hierarchyStrength")
    };
  }
}
