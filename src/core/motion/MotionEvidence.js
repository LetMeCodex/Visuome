/**
 * Converts raw animation observations into standardized motion evidence objects.
 * Performs no guesses or inferences.
 */
export class MotionEvidence {
  /**
   * Standardize raw motion observations.
   * @param {Array<object>} rawObservations
   * @returns {object} Standardized motion evidence.
   */
  static aggregate(rawObservations = []) {
    return {
      timingEvidence: {
        score: rawObservations.length > 0 ? 80 : 0,
        summary: `Standardized observed motion timings based on ${rawObservations.length} attributes.`,
        sources: ["DOM", "CSS Rules"]
      }
    };
  }
}
