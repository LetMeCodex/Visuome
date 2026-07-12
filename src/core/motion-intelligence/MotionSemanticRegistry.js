/**
 * Registry container representing structured Motion Semantic output.
 * Contains no calculations or logic.
 */
export class MotionSemanticRegistry {
  constructor(data = {}) {
    this.motionCharacteristics = data.motionCharacteristics || {};
    this.interactionCharacteristics = data.interactionCharacteristics || {};
    this.timelineCharacteristics = data.timelineCharacteristics || {};
    this.technologyCharacteristics = data.technologyCharacteristics || {};
    
    this.confidence = data.confidence || {
      score: 0,
      explanation: "No semantic analysis has run.",
      factors: []
    };
    
    this.evidence = data.evidence || [];
    this.diagnostics = data.diagnostics || {
      executionTimeMs: 0,
      analyzersRun: []
    };
  }
}
