/**
 * Registry container representing structured Design Philosophy output.
 * Contains no calculations or logic.
 */
export class DesignPhilosophyRegistry {
  constructor(data = {}) {
    this.visualPhilosophy = data.visualPhilosophy || {};
    this.layoutPhilosophy = data.layoutPhilosophy || {};
    this.typographyPhilosophy = data.typographyPhilosophy || {};
    this.colorPhilosophy = data.colorPhilosophy || {};
    this.compositionPhilosophy = data.compositionPhilosophy || {};
    this.interactionExpectation = data.interactionExpectation || { placeholder: true };
    this.cognitiveProfile = data.cognitiveProfile || {};
    this.designIntent = data.designIntent || { placeholder: true };
    
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
