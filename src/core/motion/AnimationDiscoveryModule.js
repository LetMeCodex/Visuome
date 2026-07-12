export class AnimationDiscoveryModule {
  name() { return "AnimationDiscoveryModule"; }
  version() { return "1.0.0"; }
  dependencies() { return []; }

  /**
   * Scan elements and styles to identify CSS animation definitions and active player counts.
   * @param {Array<HTMLElement>} elements
   * @param {function} getStyles
   * @returns {Promise<object>}
   */
  async scan(elements = [], getStyles) {
    const animations = [];
    let waapiCount = 0;

    for (const el of elements) {
      try {
        const styles = getStyles(el);
        const name = styles?.animationName || "";
        if (name && name !== "none") {
          animations.push({
            name,
            duration: styles.animationDuration || "0s",
            timingFunction: styles.animationTimingFunction || "ease",
            delay: styles.animationDelay || "0s",
            iterationCount: styles.animationIterationCount || "1",
            direction: styles.animationDirection || "normal",
            fillMode: styles.animationFillMode || "none",
            playState: styles.animationPlayState || "running"
          });
        }
      } catch (error) {
        console.warn("AnimationDiscovery [Error]: element style read failed:", error);
      }
    }

    try {
      if (typeof document.getAnimations === "function") {
        waapiCount = document.getAnimations().length;
      }
    } catch (error) {
      console.debug("AnimationDiscovery [Diagnostics]: WAAPI document.getAnimations unavailable.");
    }

    return {
      animations,
      waapiCount,
      totalDetected: animations.length
    };
  }
}
