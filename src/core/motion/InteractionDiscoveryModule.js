export class InteractionDiscoveryModule {
  name() { return "InteractionDiscoveryModule"; }
  version() { return "1.0.0"; }
  dependencies() { return []; }

  /**
   * Scan elements to collect active user interaction styling cues.
   * @param {Array<HTMLElement>} elements
   * @param {function} getStyles
   * @returns {Promise<object>}
   */
  async scan(elements = [], getStyles) {
    const pointerEventsNone = [];
    const customCursors = [];
    const selectNone = [];
    const touchActions = [];

    for (const el of elements) {
      try {
        const styles = getStyles(el);
        const cursor = styles?.cursor || "auto";
        const pointerEvents = styles?.pointerEvents || "auto";
        const userSelect = styles?.userSelect || "auto";
        const touchAction = styles?.touchAction || "auto";

        if (pointerEvents === "none") {
          pointerEventsNone.push({ tag: el.tagName });
        }
        if (cursor !== "auto" && cursor !== "default" && cursor !== "text" && cursor !== "pointer") {
          customCursors.push({ cursor });
        }
        if (userSelect === "none") {
          selectNone.push({ tag: el.tagName });
        }
        if (touchAction !== "auto") {
          touchActions.push({ touchAction });
        }
      } catch (error) {
        console.warn("InteractionDiscovery [Error]: element style read failed:", error);
      }
    }

    return {
      pointerEventsNoneCount: pointerEventsNone.length,
      customCursorsCount: customCursors.length,
      userSelectNoneCount: selectNone.length,
      customTouchActionsCount: touchActions.length,
      totalDetected: pointerEventsNone.length + customCursors.length + selectNone.length + touchActions.length
    };
  }
}
