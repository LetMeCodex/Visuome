export class ReplayMetadataModule {
  name() { return "ReplayMetadataModule"; }
  version() { return "1.0.0"; }
  dependencies() { return []; }

  /**
   * Translate discovered transitions and keyframes into timeline replay sequences.
   * @param {object} animationRegistry
   * @param {object} transitionRegistry
   * @returns {Promise<object>} replayMetadata observations
   */
  async generate(animationRegistry, transitionRegistry) {
    const replayMetadata = [];
    const animations = animationRegistry?.animations || [];
    const transitions = transitionRegistry?.transitions || [];

    animations.forEach((a, index) => {
      replayMetadata.push({
        elementReference: `CSS Animation [${a.name}]`,
        trigger: "Page Load",
        delay: a.delay,
        duration: a.duration,
        timingFunction: a.timingFunction,
        direction: a.direction,
        iterations: a.iterationCount,
        fillMode: a.fillMode,
        playState: a.playState,
        timeline: "document-timeline",
        sequenceIndex: index,
        origin: "CSS Keyframes",
        confidence: 95
      });
    });

    transitions.forEach((t, index) => {
      replayMetadata.push({
        elementReference: `CSS Transition [${t.property}]`,
        trigger: "Hover/Focus State",
        delay: t.delay,
        duration: t.duration,
        timingFunction: t.timingFunction,
        direction: "normal",
        iterations: "1",
        fillMode: "none",
        playState: "running",
        timeline: null,
        sequenceIndex: index,
        origin: "CSS Transition Rule",
        confidence: 90
      });
    });

    return { replayMetadata };
  }
}
