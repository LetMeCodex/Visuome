/**
 * Static validator validating Design Genome metadata, confidence structures, and version alignment.
 */
export class GenomeValidator {
  /**
   * Validate Design Genome payload integrity.
   * @param {object} genome
   * @returns {object} { valid, errors, warnings }
   */
  static validate(genome) {
    const errors = [];
    const warnings = [];

    if (!genome) {
      return {
        valid: false,
        errors: ["Genome is undefined or null."],
        warnings: []
      };
    }

    // 1. Missing metadata checks
    if (!genome.metadata) {
      errors.push("Missing core metadata object.");
    } else {
      if (!genome.metadata.genomeId) errors.push("Missing metadata genomeId.");
      if (!genome.metadata.schemaVersion) errors.push("Missing metadata schemaVersion.");
    }

    // 2. Confidence boundaries validation
    if (!genome.confidence) {
      errors.push("Missing confidence registry mapping.");
    } else {
      const score = genome.confidence.score;
      if (typeof score !== "number" || score < 0 || score > 100) {
        errors.push(`Invalid confidence range value: ${score}. Must reside between 0 and 100.`);
      }
    }

    // 3. DNA duplicates checks
    const DNAKeys = [
      "visualDNA", "motionDNA", "platformDNA", "interactionDNA",
      "layoutDNA", "semanticDNA", "designSystemDNA", "knowledgeGraphDNA"
    ];
    for (const key of DNAKeys) {
      if (genome[key] === undefined) {
        warnings.push(`Registry DNA block key missing: "${key}".`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
