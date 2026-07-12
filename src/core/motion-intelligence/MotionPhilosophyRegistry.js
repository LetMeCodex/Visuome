/**
 * Registry container representing structured Motion Philosophy output.
 * Contains no calculations or logic.
 */
export class MotionPhilosophyRegistry {
  constructor(data = {}) {
    this.motionPhilosophy = data.motionPhilosophy || {};
    this.interactionPhilosophy = data.interactionPhilosophy || {};
    this.cognitiveMotion = data.cognitiveMotion || {};
    
    this.confidence = data.confidence || {
      score: 0,
      explanation: "No philosophy analysis has run.",
      factors: []
    };
    
    this.evidence = data.evidence || [];
    this.diagnostics = data.diagnostics || {
      executionTimeMs: 0,
      analyzersRun: []
    };
  }
}
