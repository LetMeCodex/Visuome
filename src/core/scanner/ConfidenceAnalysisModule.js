import { ConfidenceEngine } from "../engines/ConfidenceEngine.js";

export class ConfidenceAnalysisModule {
  initialize() {}

  /**
   * Run the confidence analysis pass.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} Confidence analysis summary.
   */
  async scan(session) {
    const registries = [
      { name: "typographyRegistry", key: "typography" },
      { name: "colorRegistry", key: "color" },
      { name: "spacingRegistry", key: "spacing" },
      { name: "layoutRegistry", key: "layout" },
      { name: "componentRegistry", key: "components" }
    ];

    const scores = [];

    for (const reg of registries) {
      const data = session.data[reg.name];
      if (!data) continue;

      const relatedEvidences = (session.data.evidences || []).filter(e => 
        e.registryReference === reg.key || 
        String(e.relatedNode).includes(reg.key) || 
        String(e.observedProperty).includes(reg.key)
      );

      const conflicts = (session.data.conflicts || []).filter(c => 
        String(c.propertyKey).includes(reg.key)
      );

      const calculated = ConfidenceEngine.calculate(
        relatedEvidences.length > 0 ? relatedEvidences : (session.data.evidences || []), 
        { conflictCount: conflicts.length }
      );

      data.confidence = {
        score: calculated.score,
        explanation: calculated.explanation,
        factors: calculated.factors
      };

      scores.push(calculated.score);
    }

    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    session.data.confidenceSummary = {
      globalConfidenceScore: avgScore,
      rating: avgScore >= 90 ? "Excellent" : avgScore >= 70 ? "High" : avgScore >= 45 ? "Moderate" : "Low",
      registryScores: scores
    };

    return session.data.confidenceSummary;
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
