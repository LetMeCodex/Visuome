export class TransitionDiscoveryModule {
  name() { return "TransitionDiscoveryModule"; }
  version() { return "1.0.0"; }
  dependencies() { return []; }

  /**
   * Scan elements to collect active computed CSS transitions.
   * @param {Array<HTMLElement>} elements
   * @param {function} getStyles
   * @returns {Promise<object>}
   */
  async scan(elements = [], getStyles) {
    const transitions = [];

    for (const el of elements) {
      try {
        const styles = getStyles(el);
        const property = styles?.transitionProperty || "";
        if (property && property !== "none" && property !== "all 0s ease 0s") {
          transitions.push({
            property,
            duration: styles.transitionDuration || "0s",
            delay: styles.transitionDelay || "0s",
            timingFunction: styles.transitionTimingFunction || "ease",
            behavior: styles.transitionBehavior || "normal"
          });
        }
      } catch (error) {
        console.warn("TransitionDiscovery [Error]: element style read failed:", error);
      }
    }

    return {
      transitions,
      totalDetected: transitions.length
    };
  }
}
