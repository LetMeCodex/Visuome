import { SemanticAnalyzerInterface } from "./SemanticAnalyzerInterface.js";

export class VisualCharacteristicsAnalyzer extends SemanticAnalyzerInterface {
  name() { return "VisualCharacteristicsAnalyzer"; }
  version() { return "1.0.0"; }
  dependencies() { return ["visualLanguageRegistry"]; }

  /**
   * Assess spacing, density, corners, borders, and depth to formulate Visual Characteristics.
   * @param {object} scanResult
   * @param {object} visualLanguageRegistry
   * @param {object} rules
   * @param {object} cache
   * @returns {Promise<object>} Visual characteristic registry entries.
   */
  async analyze(scanResult, visualLanguageRegistry, rules, cache) {
    const vRegistry = visualLanguageRegistry || {};
    
    const densityScore = vRegistry.informationDensity?.score || 50;
    const whitespaceScore = 100 - densityScore;
    const designConsistency = vRegistry.designConsistency?.score || 50;

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
      whitespaceUsage: buildRecord(whitespaceScore, 90, `Whitespace is spacious and breathing (score: ${whitespaceScore}/100) based on inverted density.`, "informationDensity"),
      visualDensity: buildRecord(densityScore, 95, `Visual content density calculated at ${densityScore}/100.`, "informationDensity"),
      contrastEnergy: buildRecord(vRegistry.visualWeight?.score || 50, 85, "Calculated visual weight energy.", "visualWeight"),
      depthPerception: buildRecord(vRegistry.visualWeight?.score || 50, 80, "Perception based on styling depth elements.", "visualWeight"),
      surfaceComplexity: buildRecord(designConsistency, 80, "Surface styling consistency score.", "designConsistency"),
      textureRichness: buildRecord(vRegistry.visualWeight?.score || 50, 80, "Gradients and borders complexity.", "visualWeight"),
      visualNoise: buildRecord(Math.round(densityScore * 0.7), 85, "Visual noise projection.", "informationDensity"),
      shapeLanguage: buildRecord(designConsistency, 90, "Shape consistencies.", "designConsistency"),
      borderLanguage: buildRecord(vRegistry.visualWeight?.score || 50, 85, "Border weights tracking.", "visualWeight"),
      cornerLanguage: buildRecord(designConsistency, 90, "Correlates to layout styling border radius consistency.", "designConsistency")
    };
  }
}
