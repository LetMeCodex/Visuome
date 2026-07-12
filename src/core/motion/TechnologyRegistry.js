/**
 * Registry container representing detected motion technologies.
 * Contains no calculations or logic.
 */
export class TechnologyRegistry {
  constructor(data = {}) {
    this.detectedTechnologies = data.detectedTechnologies || [];
    this.confidence = data.confidence || {
      score: 0,
      explanation: "No technology analysis has run.",
      factors: []
    };
    this.supportingEvidence = data.supportingEvidence || [];
    this.versionHints = data.versionHints || {};
    this.diagnostics = data.diagnostics || {
      executionTimeMs: 0,
      checkedSelectorsCount: 0
    };
  }
}
