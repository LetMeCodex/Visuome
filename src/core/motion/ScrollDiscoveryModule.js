export class ScrollDiscoveryModule {
  name() { return "ScrollDiscoveryModule"; }
  version() { return "1.0.0"; }
  dependencies() { return []; }

  /**
   * Scan elements and window styles to capture scroll characteristics.
   * @param {Array<HTMLElement>} elements
   * @param {function} getStyles
   * @returns {Promise<object>}
   */
  async scan(elements = [], getStyles) {
    const scrollContainers = [];
    const stickyElements = [];

    for (const el of elements) {
      try {
        const styles = getStyles(el);
        const overflowY = styles?.overflowY || "";
        const overflowX = styles?.overflowX || "";
        
        if (overflowY === "auto" || overflowY === "scroll" || overflowX === "auto" || overflowX === "scroll") {
          scrollContainers.push({
            overflowX,
            overflowY,
            scrollBehavior: styles.scrollBehavior || "auto",
            scrollSnapType: styles.scrollSnapType || "none"
          });
        }

        if (styles?.position === "sticky") {
          stickyElements.push({
            top: styles.top || "auto",
            bottom: styles.bottom || "auto",
            left: styles.left || "auto",
            right: styles.right || "auto"
          });
        }
      } catch (error) {
        console.warn("ScrollDiscovery [Error]: element style read failed:", error);
      }
    }

    let documentScrollBehavior = "auto";
    try {
      documentScrollBehavior = getStyles(document.documentElement)?.scrollBehavior || "auto";
    } catch (error) {
      console.warn("ScrollDiscovery [Error]: documentElement style read failed:", error);
    }

    return {
      scrollContainers,
      stickyElements,
      documentScrollBehavior,
      totalContainers: scrollContainers.length,
      totalSticky: stickyElements.length
    };
  }
}
