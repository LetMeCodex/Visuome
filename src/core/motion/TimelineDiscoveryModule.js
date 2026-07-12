export class TimelineDiscoveryModule {
  name() { return "TimelineDiscoveryModule"; }
  version() { return "1.0.0"; }
  dependencies() { return []; }

  /**
   * Scan elements to collect active timeline configurations.
   * @param {Array<HTMLElement>} elements
   * @param {function} getStyles
   * @returns {Promise<object>}
   */
  async scan(elements = [], getStyles) {
    const timelines = [];

    for (const el of elements) {
      try {
        const styles = getStyles(el);
        const animationTimeline = styles?.animationTimeline || "";
        if (animationTimeline && animationTimeline !== "none") {
          timelines.push({
            timeline: animationTimeline,
            duration: styles.animationDuration || "0s",
            iterationCount: styles.animationIterationCount || "1",
            direction: styles.animationDirection || "normal",
            fillMode: styles.animationFillMode || "none",
            playState: styles.animationPlayState || "running",
            timingFunction: styles.animationTimingFunction || "ease",
            delay: styles.animationDelay || "0s"
          });
        }
      } catch (error) {
        console.warn("TimelineDiscovery [Error]: element style read failed:", error);
      }
    }

    return {
      timelines,
      totalDetected: timelines.length
    };
  }
}
