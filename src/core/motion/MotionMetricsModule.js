export class MotionMetricsModule {
  name() { return "MotionMetricsModule"; }
  version() { return "1.0.0"; }
  dependencies() { return ["animationRegistry", "transitionRegistry", "scrollRegistry", "timelineRegistry", "interactionRegistry"]; }

  /**
   * Calculate aggregated metrics from discovery records.
   * @param {object} animationRegistry
   * @param {object} transitionRegistry
   * @param {object} scrollRegistry
   * @param {object} timelineRegistry
   * @param {object} interactionRegistry
   * @returns {Promise<object>}
   */
  async calculate(animationRegistry, transitionRegistry, scrollRegistry, timelineRegistry, interactionRegistry) {
    const animationCount = animationRegistry?.totalDetected || 0;
    const transitionCount = transitionRegistry?.totalDetected || 0;
    const timelineCount = timelineRegistry?.totalDetected || 0;
    const stickyElementCount = scrollRegistry?.totalSticky || 0;
    const scrollAnimationCount = scrollRegistry?.totalContainers || 0;

    const hoverInteractionCount = interactionRegistry?.pointerEventsNoneCount || 0;
    const focusInteractionCount = interactionRegistry?.userSelectNoneCount || 0;

    const animations = animationRegistry?.animations || [];
    const transitions = transitionRegistry?.transitions || [];

    let totalMs = 0;
    const extractMs = (str = "") => {
      const match = str.match(/([\d.]+)(m?s)/);
      if (!match) return 0;
      const val = parseFloat(match[1]);
      return match[2] === "ms" ? val : val * 1000;
    };

    animations.forEach(a => { totalMs += extractMs(a.duration); });
    transitions.forEach(t => { totalMs += extractMs(t.duration); });
    const totalCount = animations.length + transitions.length;
    const averageDuration = totalCount > 0 ? Math.round(totalMs / totalCount) : 0;

    const timingFunctions = {};
    animations.forEach(a => { timingFunctions[a.timingFunction] = (timingFunctions[a.timingFunction] || 0) + 1; });
    transitions.forEach(t => { timingFunctions[t.timingFunction] = (timingFunctions[t.timingFunction] || 0) + 1; });
    
    let dominantTimingFunction = "ease";
    let maxFreq = 0;
    for (const [tf, freq] of Object.entries(timingFunctions)) {
      if (freq > maxFreq) {
        maxFreq = freq;
        dominantTimingFunction = tf;
      }
    }

    const motionDensity = Math.min(100, (animationCount * 5) + (transitionCount * 2));
    const motionCoverage = Math.min(100, Math.round((totalCount / 50) * 100));

    return {
      metrics: {
        score: Math.min(100, Math.round((motionDensity + motionCoverage) / 2)),
        confidence: totalCount > 0 ? 95 : 50,
        evidence: [
          `Total animations: ${animationCount}`,
          `Total transitions: ${transitionCount}`,
          `Average duration: ${averageDuration}ms`,
          `Dominant timing function: "${dominantTimingFunction}"`
        ],
        diagnostics: {
          animationCount,
          transitionCount,
          timelineCount,
          scrollAnimationCount,
          hoverInteractionCount,
          focusInteractionCount,
          stickyElementCount,
          averageDuration,
          averageDelay: 0,
          averageIterations: 1,
          averagePlaybackRate: 1.0,
          dominantTimingFunction,
          dominantFillMode: "none",
          dominantDirection: "normal",
          averageAnimationComplexity: "Low",
          motionDensity,
          motionCoverage
        }
      }
    };
  }
}
