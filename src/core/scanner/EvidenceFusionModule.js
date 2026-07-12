export class EvidenceFusionModule {
  initialize() {
    this.verifiedObservations = new Map();
    this.rawObservationsCount = 0;
  }

  /**
   * Run the evidence fusion processor.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<Map<string, object>>} Map of key-value verified observations.
   */
  async scan(session) {
    const rawEvidences = session.data.evidences || [];
    this.rawObservationsCount = rawEvidences.length;

    // Group evidence by target property path (e.g., "node-0 -> color" or "system -> primaryFontFamily")
    const groups = new Map();
    for (const ev of rawEvidences) {
      const key = `${ev.relatedNode || "system"}::${ev.observedProperty || "style"}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(ev);
    }

    // Merge and verify observations
    for (const [key, evList] of groups.entries()) {
      const valCounts = new Map();
      for (const ev of evList) {
        let normalizedVal = String(ev.value).trim();
        if (normalizedVal.startsWith("rgb")) {
          normalizedVal = normalizedVal.toLowerCase().replace(/\s+/g, "");
        }
        valCounts.set(normalizedVal, (valCounts.get(normalizedVal) || 0) + 1);
      }

      // Sort values by count (frequency)
      const sortedVals = Array.from(valCounts.entries()).sort((a, b) => b[1] - a[1]);
      const dominantValue = sortedVals[0]?.[0] || "";

      const totalCount = evList.length;
      const agreementRate = sortedVals[0]?.[1] / totalCount;
      const isConflicted = sortedVals.length > 1;

      // Update original evidence statuses
      for (const ev of evList) {
        ev.conflictStatus = isConflicted ? "conflicted" : "none";
        ev.verificationStatus = (String(ev.value).trim() === dominantValue) ? "verified" : "rejected";
      }

      this.verifiedObservations.set(key, {
        propertyKey: key,
        value: dominantValue,
        agreementRate,
        isConflicted,
        evidenceCount: totalCount,
        sources: Array.from(new Set(evList.map(e => e.origin))),
        evidenceList: evList
      });
    }

    session.data.verifiedObservations = this.verifiedObservations;
    return this.verifiedObservations;
  }

  validate(data) {
    return data instanceof Map;
  }

  cleanup() {}
  destroy() {}
}
