import { MotionAnalyzerInterface } from "./MotionAnalyzerInterface.js";

export class CognitiveMotionAnalyzer extends MotionAnalyzerInterface {
  name() { return "CognitiveMotionAnalyzer"; }
  version() { return "1.0.0"; }

  /**
   * Run philosophy analysis on cognitive impact metrics.
   * @param {object} semanticRegistry
   * @param {Map} cache
   * @returns {Promise<object>}
   */
  async analyze(semanticRegistry, cache) {
    const motionChars = semanticRegistry.motionCharacteristics || {};
    const intensity = motionChars.motionIntensity?.score || 0;
    const density = motionChars.motionDensity?.score || 0;

    const cogLoad = Math.round((intensity + density) / 2);
    const fatigue = Math.round(intensity * 0.7 + density * 0.3);
    const focus = Math.max(0, 100 - fatigue);

    const buildPhilosophy = (metricName, score, confidence, reasoning, trace) => ({
      score,
      confidence,
      reasoning,
      supportingEvidence: [`Mapped from ${metricName} characteristic with value ${score}.`],
      contradictions: [],
      trace
    });

    return {
      motionCognitiveLoad: buildPhilosophy("Motion Cognitive Load", cogLoad, 90, "Calculated from motion intensity and layouts density averages.", ["MotionSemanticRegistry.motionCharacteristics.motionIntensity"]),
      attentionGuidance: buildPhilosophy("Attention Guidance", intensity > 30 && intensity < 70 ? 80 : 40, 85, "Visual focus stability maps to moderate animation speeds.", ["MotionSemanticRegistry.motionCharacteristics.motionIntensity"]),
      animationFatigueRisk: buildPhilosophy("Animation Fatigue Risk", fatigue, 90, "Calculated directly from continuous animation loops scores.", ["MotionSemanticRegistry.motionCharacteristics.motionIntensity"]),
      focusStability: buildPhilosophy("Focus Stability", focus, 90, "Focus levels map inversely to visual fatigue risks.", ["MotionSemanticRegistry.motionCharacteristics.motionIntensity"])
    };
  }
}
