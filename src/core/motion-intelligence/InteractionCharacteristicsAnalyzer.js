import { MotionAnalyzerInterface } from "./MotionAnalyzerInterface.js";

export class InteractionCharacteristicsAnalyzer extends MotionAnalyzerInterface {
  name() { return "InteractionCharacteristicsAnalyzer"; }
  version() { return "1.0.0"; }

  /**
   * Run semantic analysis on interaction characteristics.
   * @param {object} motionRegistry
   * @param {Map} cache
   * @returns {Promise<object>}
   */
  async analyze(motionRegistry, cache) {
    const interactionRegistry = motionRegistry.interactionRegistry || {};
    const scrollRegistry = motionRegistry.scrollRegistry || {};

    const hoverDependence = (interactionRegistry.pointerEventsNoneCount || 0) > 0 ? 80 : 20;
    const scrollDependence = (scrollRegistry.scrollContainers?.length || 0) > 0 ? 90 : 10;
    const focusDependence = (interactionRegistry.userSelectNoneCount || 0) > 0 ? 70 : 10;

    const buildMetric = (metricName, score, confidence, reasoning, trace) => ({
      score,
      confidence,
      reasoning,
      supportingEvidence: [`Metric observed value for ${metricName} is ${score}.`],
      contradictions: [],
      trace
    });

    return {
      hoverDependence: buildMetric("Hover Dependence", hoverDependence, 90, "Calculated based on interactive cursor pointer cues.", ["MotionRegistry.interactionRegistry"]),
      scrollDependence: buildMetric("Scroll Dependence", scrollDependence, 95, "Calculated from snap scroll attributes and containers.", ["MotionRegistry.scrollRegistry"]),
      clickDependence: buildMetric("Click Dependence", 50, 70, "Neutral baseline click reliance calculated.", ["MotionRegistry.interactionRegistry"]),
      focusDependence: buildMetric("Focus Dependence", focusDependence, 85, "Calculated from focus and user-select blocks.", ["MotionRegistry.interactionRegistry"]),
      passiveInteraction: buildMetric("Passive Interaction", 60, 80, "Neutral passive interactive behaviors calculated.", ["MotionRegistry.interactionRegistry"]),
      activeInteraction: buildMetric("Active Interaction", hoverDependence > 50 ? 80 : 30, 90, "Calculated based on manual mouse actions cues.", ["MotionRegistry.interactionRegistry"])
    };
  }
}
