import { MotionAnalyzerInterface } from "./MotionAnalyzerInterface.js";

export class TechnologyCharacteristicsAnalyzer extends MotionAnalyzerInterface {
  name() { return "TechnologyCharacteristicsAnalyzer"; }
  version() { return "1.0.0"; }

  /**
   * Run semantic analysis on technology characteristics.
   * @param {object} motionRegistry
   * @param {Map} cache
   * @returns {Promise<object>}
   */
  async analyze(motionRegistry, cache) {
    const techRegistry = motionRegistry.technologyRegistry || {};
    const detected = techRegistry.detectedTechnologies || [];

    const libraryDependence = detected.filter(t => t !== "Native WAAPI").length > 0 ? 90 : 10;
    const nativePreference = detected.includes("Native WAAPI") ? 80 : 30;

    const buildMetric = (metricName, score, confidence, reasoning, trace) => ({
      score,
      confidence,
      reasoning,
      supportingEvidence: [`Metric observed value for ${metricName} is ${score}.`],
      contradictions: [],
      trace
    });

    return {
      technologyComplexity: buildMetric("Technology Complexity", detected.length > 2 ? 80 : 30, 90, "Resolved from count of detected framework engines.", ["MotionRegistry.technologyRegistry"]),
      technologyDiversity: buildMetric("Technology Diversity", detected.length > 1 ? 75 : 15, 95, "Calculated based on standard active library types.", ["MotionRegistry.technologyRegistry"]),
      nativePreference: buildMetric("Native Preference", nativePreference, 90, "Determined based on Native WAAPI active detection.", ["MotionRegistry.technologyRegistry"]),
      libraryDependence: buildMetric("Library Dependence", libraryDependence, 95, "Calculated from presence of external animation scripts.", ["MotionRegistry.technologyRegistry"])
    };
  }
}
