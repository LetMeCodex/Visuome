/**
 * Aggregates confidence metrics from various scan subsystems (visual, motion, layout).
 */
export class GenomeConfidence {
  /**
   * Aggregates confidence values from different scanner registries.
   * @param {object} scanResult
   * @returns {object} { score, explanation, factors }
   */
  aggregate(scanResult) {
    if (!scanResult) {
      return { score: 100, explanation: "Standard default genome confidence.", factors: [] };
    }

    let totalScore = 0;
    let counts = 0;
    const factors = [];

    const registries = ["typographyRegistry", "colorRegistry", "spacingRegistry", "layoutRegistry"];
    for (const reg of registries) {
      if (scanResult[reg]?.confidence?.score !== undefined) {
        totalScore += scanResult[reg].confidence.score;
        counts++;
        if (scanResult[reg].confidence.explanation) {
          factors.push(`${reg}: ${scanResult[reg].confidence.explanation}`);
        }
      }
    }

    const score = counts > 0 ? Math.round(totalScore / counts) : 100;

    return {
      score,
      explanation: `Genome confidence computed successfully from ${counts} registries.`,
      factors
    };
  }
}
