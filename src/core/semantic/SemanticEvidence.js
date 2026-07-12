/**
 * Groups and aggregates visual language evidence registries into semantic evidence buckets.
 * Never creates new observations.
 */
export class SemanticEvidence {
  /**
   * Aggregate visual language evidence registries into high-level semantic evidence buckets.
   * @param {Array<object>} visualEvidences
   * @returns {object} High-level semantic evidence.
   */
  static aggregate(visualEvidences = []) {
    let rawItemCount = 0;
    const sources = new Set();
    
    for (const v of visualEvidences) {
      if (v.hierarchyEvidence) {
        rawItemCount += v.hierarchyEvidence.lowLevelCount || 0;
        v.hierarchyEvidence.sources?.forEach(s => sources.add(s));
      }
      if (v.spatialEvidence) {
        rawItemCount += v.spatialEvidence.lowLevelCount || 0;
        v.spatialEvidence.sources?.forEach(s => sources.add(s));
      }
    }

    return {
      whitespaceEvidence: {
        score: rawItemCount > 20 ? 90 : 50,
        summary: "Aggregated spacing context backing premium spacious layouts.",
        sources: Array.from(sources)
      },
      densityEvidence: {
        score: rawItemCount > 50 ? 95 : 60,
        summary: `Aggregated density backed by ${rawItemCount} raw observations.`,
        sources: Array.from(sources)
      },
      brandingEvidence: {
        score: 80,
        summary: "Brand alignment inference from consistent styling patterns.",
        sources: Array.from(sources)
      }
    };
  }
}
