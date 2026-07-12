import { DesignPhilosophyAnalyzerInterface } from "./DesignPhilosophyAnalyzerInterface.js";

export class CognitiveLoadAnalyzer extends DesignPhilosophyAnalyzerInterface {
  name() { return "CognitiveLoadAnalyzer"; }
  version() { return "1.0.0"; }
  dependencies() { return ["semanticRegistry"]; }

  /**
   * Assess layout density and visual noise levels to formulate Cognitive Profile.
   * @param {object} scanResult
   * @param {object} semanticRegistry
   * @param {object} rules
   * @param {object} cache
   * @returns {Promise<object>} Cognitive load registry entries.
   */
  async analyze(scanResult, semanticRegistry, rules, cache) {
    const sRegistry = semanticRegistry || {};
    const visualChars = sRegistry.visualCharacteristics || {};

    const density = visualChars.visualDensity?.score || 50;
    const noise = visualChars.visualNoise?.score || 50;
    const whitespace = visualChars.whitespaceUsage?.score || 50;

    const cognitiveLoad = Math.round((density * 0.6) + (noise * 0.4));
    const fatigueRisk = Math.round((density * 0.5) + (noise * 0.5));
    const stability = whitespace;

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
      cognitiveProfile: {
        estimatedCognitiveLoad: buildRecord(cognitiveLoad, 90, `Estimated cognitive reading load is ${cognitiveLoad}/100.`, "visualDensity"),
        attentionDistribution: buildRecord(whitespace, 85, "Calculated focus scannability area.", "whitespaceUsage"),
        readingEffort: buildRecord(density, 80, "Syllable reading density progression effort.", "visualDensity"),
        scanningComplexity: buildRecord(noise, 85, "Overlay visual noise tracking.", "visualNoise"),
        visualFatigueRisk: buildRecord(fatigueRisk, 90, `Estimated visual fatigue risk calculated at ${fatigueRisk}/100 based on noise.`, "visualNoise"),
        decisionComplexity: buildRecord(cognitiveLoad, 80, "Inferred complexity of layout options.", "visualDensity"),
        focusStability: buildRecord(stability, 95, `Inferred focus stability rating of ${stability}/100 based on spacing comfort.`, "whitespaceUsage")
      }
    };
  }
}
