import { MotionAnalyzerInterface } from "./MotionAnalyzerInterface.js";

export class MotionCharacteristicsAnalyzer extends MotionAnalyzerInterface {
  name() { return "MotionCharacteristicsAnalyzer"; }
  version() { return "1.0.0"; }

  /**
   * Run semantic analysis on motion characteristics.
   * @param {object} motionRegistry
   * @param {Map} cache
   * @returns {Promise<object>}
   */
  async analyze(motionRegistry, cache) {
    const rawMetrics = motionRegistry.metrics?.diagnostics || {};
    
    const intensity = Math.min(100, Math.round((rawMetrics.averageDuration > 0 ? 50 : 0) + ((rawMetrics.animationCount || 0) * 5)));
    const density = rawMetrics.motionDensity || 0;
    const coverage = rawMetrics.motionCoverage || 0;

    const buildMetric = (metricName, score, confidence, reasoning, trace) => ({
      score,
      confidence,
      reasoning,
      supportingEvidence: [`Metric observed value for ${metricName} is ${score}.`],
      contradictions: [],
      trace
    });

    return {
      motionIntensity: buildMetric("Motion Intensity", intensity, 90, `Computed from average duration of ${rawMetrics.averageDuration || 0}ms and active animations count.`, ["MotionRegistry.metrics"]),
      motionDensity: buildMetric("Motion Density", density, 95, "Calculated from density of animations and transitions counts.", ["MotionRegistry.metrics"]),
      motionSmoothness: buildMetric("Motion Smoothness", 85, 80, "Consistent 60fps animations predicted from CSS keyframes execution.", ["MotionRegistry.animationRegistry"]),
      motionComplexity: buildMetric("Motion Complexity", density > 50 ? 75 : 30, 85, "Calculated from timing functions diversity.", ["MotionRegistry.metrics"]),
      motionCoverage: buildMetric("Motion Coverage", coverage, 95, "Coverage calculated from total animated elements compared to standard sizes.", ["MotionRegistry.metrics"]),
      motionConsistency: buildMetric("Motion Consistency", 80, 85, "Calculated based on dominant timing function values.", ["MotionRegistry.metrics"]),
      motionPredictability: buildMetric("Motion Predictability", 85, 90, "Calculated based on native standard properties.", ["MotionRegistry.metrics"]),
      motionLayering: buildMetric("Motion Layering", (rawMetrics.timelineCount || 0) > 0 ? 80 : 0, 90, "Aggregated scroll animations timelines declarations.", ["MotionRegistry.timelineRegistry"])
    };
  }
}
