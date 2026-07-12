import { DesignPhilosophyAnalyzerInterface } from "./DesignPhilosophyAnalyzerInterface.js";

export class TypographyPhilosophyAnalyzer extends DesignPhilosophyAnalyzerInterface {
  name() { return "TypographyPhilosophyAnalyzer"; }
  version() { return "1.0.0"; }
  dependencies() { return ["semanticRegistry"]; }

  /**
   * Evaluate typography dominance stats to determine Typography Philosophy scores.
   * @param {object} scanResult
   * @param {object} semanticRegistry
   * @param {object} rules
   * @param {object} cache
   * @returns {Promise<object>} Typography philosophy registry entries.
   */
  async analyze(scanResult, semanticRegistry, rules, cache) {
    const sRegistry = semanticRegistry || {};
    const typoChars = sRegistry.typographyCharacteristics || {};

    const dominance = typoChars.typographyDominance?.score || 50;

    const buildRecord = (score, confidence, reasoning, evidenceKey) => ({
      score,
      confidence,
      reasoning,
      supportingEvidence: [`Semantic characteristic "${evidenceKey}" evaluated at score ${score}`],
      contradictions: [],
      trace: {
        semanticRegistryKey: evidenceKey,
        visualLanguageRegistryKey: "",
        evidenceIds: []
      }
    });

    return {
      typographyPhilosophy: {
        typographyFirst: buildRecord(dominance, 90, `Typography-first score of ${dominance}/100.`, "typographyDominance"),
        balanced: buildRecord(100 - Math.abs(50 - dominance) * 2, 85, "Visual balance ratio.", "typographyDominance"),
        decorationFirst: buildRecord(Math.round((100 - dominance) * 0.7), 80, "Styling accents hierarchy prominence.", "typographyDominance"),
        informationFirst: buildRecord(dominance, 90, "Semantic density scannability hierarchy.", "typographyDominance")
      }
    };
  }
}
