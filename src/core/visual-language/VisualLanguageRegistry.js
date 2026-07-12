/**
 * Expanded registry container representing structured Visual Language output.
 * Each dimension holds: score, confidence, evidence, contradictions, reasoning, and diagnostics.
 */
export class VisualLanguageRegistry {
  constructor(data = {}) {
    this.overallStyle = data.overallStyle || "Unknown";
    this.secondaryStyles = data.secondaryStyles || [];
    this.brandPersonality = data.brandPersonality || {};
    this.interfaceMood = data.interfaceMood || {};
    this.designMaturity = data.designMaturity || "Unknown";

    this.informationDensity = data.informationDensity || {
      score: 0,
      confidence: 0,
      evidence: [],
      contradictions: [],
      reasoning: "Not analyzed",
      diagnostics: {}
    };

    this.visualWeight = data.visualWeight || {
      score: 0,
      confidence: 0,
      evidence: [],
      contradictions: [],
      reasoning: "Not analyzed",
      diagnostics: {}
    };

    this.hierarchyStrength = data.hierarchyStrength || {
      score: 0,
      confidence: 0,
      evidence: [],
      contradictions: [],
      reasoning: "Not analyzed",
      diagnostics: {}
    };

    this.visualRhythm = data.visualRhythm || {
      score: 0,
      confidence: 0,
      evidence: [],
      contradictions: [],
      reasoning: "Not analyzed",
      diagnostics: {}
    };

    this.symmetryScore = data.symmetryScore || {
      score: 0,
      confidence: 0,
      evidence: [],
      contradictions: [],
      reasoning: "Not analyzed",
      diagnostics: {}
    };

    this.designConsistency = data.designConsistency || {
      score: 0,
      confidence: 0,
      evidence: [],
      contradictions: [],
      reasoning: "Not analyzed",
      diagnostics: {}
    };

    this.compositionStyle = data.compositionStyle || {
      value: "Unknown",
      score: 0,
      confidence: 0,
      evidence: [],
      contradictions: [],
      reasoning: "Not analyzed",
      diagnostics: {}
    };

    this.confidence = data.confidence || {
      score: 0,
      explanation: "No analysis has run.",
      factors: []
    };

    this.evidence = data.evidence || [];
    this.diagnostics = data.diagnostics || {
      executionTimeMs: 0,
      analyzersRun: []
    };
    this.futureExtensions = data.futureExtensions || {};
  }
}
