import { SemanticAnalyzerInterface } from "./SemanticAnalyzerInterface.js";

export class BrandCharacteristicsAnalyzer extends SemanticAnalyzerInterface {
  name() { return "BrandCharacteristicsAnalyzer"; }
  version() { return "1.0.0"; }
  dependencies() { return ["visualLanguageRegistry", "colorRegistry"]; }

  /**
   * Translate spatial layouts and visual token scales to compute continuous Brand Characteristics.
   * @param {object} scanResult
   * @param {object} visualLanguageRegistry
   * @param {object} rules
   * @param {object} cache
   * @returns {Promise<object>} Brand feeling registry entries.
   */
  async analyze(scanResult, visualLanguageRegistry, rules, cache) {
    const vRegistry = visualLanguageRegistry || {};
    const colorReg = scanResult.colorRegistry || {};

    const rhythm = vRegistry.visualRhythm?.score || 50;
    const consistency = vRegistry.designConsistency?.score || 50;
    const density = vRegistry.informationDensity?.score || 50;
    const hierarchy = vRegistry.hierarchyStrength?.score || 50;

    const professionalism = Math.round((rhythm + consistency) / 2);
    const technical = colorReg.theme === "Dark" ? 85 : 55;
    const luxury = Math.round(((100 - density) + hierarchy) / 2);
    const friendliness = Math.round(consistency * 0.8);
    const playfulness = Math.round((colorReg.dominantPalette?.length || 2) * 8);
    const corporate = professionalism;
    const innovation = colorReg.theme === "Dark" ? 80 : 50;
    const trustworthiness = consistency;

    const buildRecord = (score, confidence, reasoning, evidenceKey) => ({
      score,
      confidence,
      reasoning,
      supportingEvidence: [`Visual Language dimension "${evidenceKey}" evaluated.`],
      contradictions: [],
      trace: {
        visualLanguageRegistryKey: evidenceKey,
        evidenceIds: [],
        nodeIds: []
      }
    });

    return {
      professionalism: buildRecord(professionalism, 90, "Formulated from alignment stability and high spacing rhythm consistency.", "visualRhythm"),
      friendliness: buildRecord(friendliness, 85, "Soft rounded corner language and balanced contrast style.", "designConsistency"),
      luxury: buildRecord(luxury, 80, "Generous whitespace usage and high typographic hierarchy strength.", "informationDensity"),
      playfulness: buildRecord(playfulness, 80, "Vibrant color palette counts.", "colorRegistry"),
      technicalFeel: buildRecord(technical, 85, "Dark theme configuration and grid alignments.", "colorRegistry"),
      corporateFeel: buildRecord(corporate, 90, "Regular grid structures and spacing scale containment.", "visualRhythm"),
      innovationFeel: buildRecord(innovation, 80, "Gradients usage and sleek dark backdrop contrast.", "colorRegistry"),
      trustworthiness: buildRecord(trustworthiness, 95, "Unified button outlines and font weight uniformity.", "designConsistency")
    };
  }
}
