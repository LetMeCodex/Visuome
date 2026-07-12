/**
 * Registry container representing structured Motion & Interaction Intelligence output.
 * Contains no calculations or logic.
 */
export class MotionRegistry {
  constructor(data = {}) {
    this.animationRegistry = data.animationRegistry || {
      animations: [],
      waapiCount: 0,
      totalDetected: 0
    };
    this.interactionRegistry = data.interactionRegistry || {
      pointerEventsNoneCount: 0,
      customCursorsCount: 0,
      userSelectNoneCount: 0,
      customTouchActionsCount: 0,
      totalDetected: 0
    };
    this.scrollRegistry = data.scrollRegistry || {
      scrollContainers: [],
      stickyElements: [],
      documentScrollBehavior: "auto"
    };
    this.transitionRegistry = data.transitionRegistry || {
      transitions: [],
      totalDetected: 0
    };
    this.timelineRegistry = data.timelineRegistry || {
      timelines: [],
      totalDetected: 0
    };
    this.motionPhilosophy = data.motionPhilosophy || { placeholder: true };
    
    this.metrics = data.metrics || {
      score: 0,
      confidence: 50,
      evidence: [],
      diagnostics: {}
    };
    this.triggerRegistry = data.triggerRegistry || {};
    this.replayMetadata = data.replayMetadata || [];
    this.technologyRegistry = data.technologyRegistry || {};

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
