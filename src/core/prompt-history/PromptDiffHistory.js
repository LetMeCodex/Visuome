/**
 * Computes version deltas for history nodes.
 */
export class PromptDiffHistory {
  /**
   * Compares node A to node B.
   * @param {object} nodeA
   * @param {object} nodeB
   * @returns {object} Deltas summary.
   */
  static compare(nodeA, nodeB) {
    if (!nodeA || !nodeB) return { changes: 0, textDiff: "" };

    const lenDiff = nodeB.promptText.length - nodeA.promptText.length;
    return {
      changes: Math.abs(lenDiff),
      textDiff: `Length difference: ${lenDiff} characters.`
    };
  }
}
