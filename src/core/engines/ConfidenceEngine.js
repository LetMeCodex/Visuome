export class ConfidenceEngine {
  /**
   * Systematically calculate confidence based on observations.
   * @param {Array<import('../models/Evidence').Evidence>} evidences Array of gathered evidence objects.
   * @param {object} options Additional configuration parameters (e.g., conflictCount, agreementLevel).
   * @returns {{ score: number, reasons: Array<string>, explanation: string, factors: Array<string> }}
   */
  static calculate(evidences = [], options = {}) {
    if (!Array.isArray(evidences) || evidences.length === 0) {
      return {
        score: 0,
        reasons: ["No evidence was observed to support the claim."],
        explanation: "No evidence was observed to support the claim.",
        factors: ["Missing data"]
      };
    }

    // Weights representing reliability levels of each origin
    const weights = {
      "Computed Style": 1.0,
      "Inline Style": 0.9,
      "CSS Variable": 0.9,
      "Runtime": 0.9,
      "Accessibility": 0.8,
      "JavaScript": 0.8,
      "SVG": 0.7,
      "DOM": 0.6,
      "Canvas": 0.5,
      "Network": 0.5
    };

    let totalWeight = 0;
    let weightedConfidenceSum = 0;
    const uniqueValues = new Set();
    const originCounts = {};

    for (const ev of evidences) {
      const weight = weights[ev.origin] || 0.5;
      weightedConfidenceSum += ev.confidence * weight;
      totalWeight += weight;

      uniqueValues.add(ev.value);
      originCounts[ev.origin] = (originCounts[ev.origin] || 0) + 1;
    }

    // Calculate base weighted score
    let score = totalWeight > 0 ? weightedConfidenceSum / totalWeight : 50;
    const reasons = [];
    const factors = [];

    // 1. Conflict and Consistency checking
    const conflictCount = options.conflictCount !== undefined ? options.conflictCount : (uniqueValues.size > 1 ? uniqueValues.size - 1 : 0);
    if (conflictCount === 0) {
      score += 10;
      factors.push("High observation consistency");
      reasons.push("All observed evidence is fully consistent with no conflicts.");
    } else {
      const penalty = Math.min(35, conflictCount * 12);
      score -= penalty;
      factors.push("Active conflict count penalty");
      reasons.push(`Ambiguity detected: found ${conflictCount} conflicting values.`);
    }

    // 2. Source Diversity Check
    const sourceTypes = Object.keys(originCounts);
    if (sourceTypes.length > 1) {
      const diversityBonus = (sourceTypes.length - 1) * 8;
      score += diversityBonus;
      factors.push("Multi-source corroboration");
      reasons.push(`Corroborated by ${sourceTypes.length} independent source types (${sourceTypes.join(", ")}).`);
    } else {
      score -= 15;
      factors.push("Single source type vulnerability");
      reasons.push(`Relies entirely on a single evidence type (${sourceTypes[0] || "Unknown"}).`);
    }

    // 3. Agreement level
    const agreementLevel = options.agreementLevel !== undefined ? options.agreementLevel : 1.0;
    if (agreementLevel < 0.6) {
      score -= 20;
      factors.push("Low source agreement");
      reasons.push(`Low agreement level between sources (${Math.round(agreementLevel * 100)}%).`);
    } else if (agreementLevel >= 0.9) {
      score += 5;
      factors.push("Strong source consensus");
    }

    // Recency (within scan) bonus
    score += 5;
    factors.push("Fresh scan recency");

    // Bound output to 0 - 100 range
    const finalScore = Math.round(Math.max(0, Math.min(100, score)));
    let explanation = reasons.join(" ");

    // Categorization
    if (finalScore >= 90) {
      explanation = "Extremely high confidence: strongly supported by multiple consistent signals. " + explanation;
    } else if (finalScore >= 70) {
      explanation = "High confidence: likely correct, supported by several signals. " + explanation;
    } else if (finalScore >= 40) {
      explanation = "Moderate confidence: reasonable inference from available data. " + explanation;
    } else {
      explanation = "Low confidence: insufficient or highly conflicting evidence. " + explanation;
    }

    return {
      score: finalScore,
      reasons,
      explanation,
      factors
    };
  }
}
