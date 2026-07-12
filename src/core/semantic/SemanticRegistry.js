/**
 * Registry container representing structured Semantic Intelligence output.
 * Contains no calculations or logic.
 */
export class SemanticRegistry {
  constructor(data = {}) {
    this.visualCharacteristics = data.visualCharacteristics || {};
    this.styleCharacteristics = data.styleCharacteristics || {};
    this.layoutCharacteristics = data.layoutCharacteristics || {};
    this.colorCharacteristics = data.colorCharacteristics || {};
    this.typographyCharacteristics = data.typographyCharacteristics || {};
    this.interactionCharacteristics = data.interactionCharacteristics || { placeholder: true };
    this.motionCharacteristics = data.motionCharacteristics || { placeholder: true };
    this.brandCharacteristics = data.brandCharacteristics || {};
    
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
