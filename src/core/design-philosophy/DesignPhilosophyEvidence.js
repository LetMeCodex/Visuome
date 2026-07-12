/**
 * Groups and aggregates semantic evidence into design philosophy evidence.
 * Never creates new observations.
 */
export class DesignPhilosophyEvidence {
  /**
   * Aggregate semantic evidence into design philosophy evidence.
   * @param {Array<object>} semanticEvidences
   * @returns {object} High-level design philosophy evidence.
   */
  static aggregate(semanticEvidences = []) {
    let rawItemCount = 0;
    const sources = new Set();

    for (const s of semanticEvidences) {
      if (s.whitespaceEvidence) {
        rawItemCount += s.whitespaceEvidence.score || 0;
        s.whitespaceEvidence.sources?.forEach(src => sources.add(src));
      }
      if (s.densityEvidence) {
        rawItemCount += s.densityEvidence.score || 0;
        s.densityEvidence.sources?.forEach(src => sources.add(src));
      }
    }

    return {
      whitespacePhilosophyEvidence: {
        score: rawItemCount > 50 ? 95 : 60,
        summary: "Spacious layout reduces cognitive reading effort and maps to a visual restraint philosophy.",
        sources: Array.from(sources)
      },
      structuredFlowEvidence: {
        score: rawItemCount > 80 ? 90 : 50,
        summary: "Regular grid alignments map to systematic design principles.",
        sources: Array.from(sources)
      }
    };
  }
}
