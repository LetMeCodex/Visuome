export class ConflictResolutionModule {
  initialize() {
    this.conflicts = [];
  }

  /**
   * Run the conflict resolution engine.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<Array<object>>} List of conflict resolution logs.
   */
  async scan(session) {
    const verifiedObservations = session.data.verifiedObservations;
    if (!verifiedObservations) {
      return this.conflicts;
    }

    for (const [key, obs] of verifiedObservations.entries()) {
      if (obs.isConflicted) {
        const values = Array.from(new Set(obs.evidenceList.map(e => e.value)));
        
        let resolvedValue = obs.value;
        let strategy = "Dominant Frequency Selection";
        let reason = `Picked "${obs.value}" since it has the highest agreement rate (${Math.round(obs.agreementRate * 100)}%) across ${obs.evidenceCount} observations.`;

        // Check for complete tie
        const isTie = obs.evidenceList.length > 1 && obs.agreementRate <= 0.5 && values.length > 1;
        if (isTie) {
          resolvedValue = "UNKNOWN";
          strategy = "Tie Breaker Failure";
          reason = `Marked as UNKNOWN due to perfect tie between values: [${values.join(", ")}].`;
        }

        this.conflicts.push({
          propertyKey: key,
          conflictingValues: values,
          resolvedValue,
          sources: obs.sources,
          resolutionStrategy: strategy,
          reason
        });
      }
    }

    session.data.conflicts = this.conflicts;
    
    session.data.conflictSummary = {
      totalConflicts: this.conflicts.length,
      resolvedCount: this.conflicts.filter(c => c.resolvedValue !== "UNKNOWN").length,
      unresolvedCount: this.conflicts.filter(c => c.resolvedValue === "UNKNOWN").length
    };

    return this.conflicts;
  }

  validate(data) {
    return Array.isArray(data);
  }

  cleanup() {}
  destroy() {}
}
