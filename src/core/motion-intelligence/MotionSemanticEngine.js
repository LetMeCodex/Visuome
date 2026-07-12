import { MotionSemanticRegistry } from "./MotionSemanticRegistry.js";

export class MotionSemanticEngine {
  constructor() {
    this.caches = {
      global: new Map()
    };
    this.analyzers = [];
  }

  register(analyzer) {
    this.analyzers.push(analyzer);
  }

  /**
   * Orchestrates semantic intelligence calculation phases.
   * @param {object} motionRegistry Final MotionRegistry input.
   * @returns {Promise<MotionSemanticRegistry>} Frozen output.
   */
  async process(motionRegistry) {
    if (!motionRegistry) {
      return new MotionSemanticRegistry();
    }

    const startTime = performance.now();
    const motionCharacteristics = {};
    const interactionCharacteristics = {};
    const timelineCharacteristics = {};
    const technologyCharacteristics = {};

    const cacheRef = new Map();

    for (const analyzer of this.analyzers) {
      try {
        const findings = await analyzer.analyze(motionRegistry, cacheRef);
        const name = analyzer.name();

        if (name === "MotionCharacteristicsAnalyzer") {
          Object.assign(motionCharacteristics, findings);
        } else if (name === "InteractionCharacteristicsAnalyzer") {
          Object.assign(interactionCharacteristics, findings);
        } else if (name === "TimelineCharacteristicsAnalyzer") {
          Object.assign(timelineCharacteristics, findings);
        } else if (name === "TechnologyCharacteristicsAnalyzer") {
          Object.assign(technologyCharacteristics, findings);
        }
      } catch (error) {
        console.error(`MotionSemanticEngine [Error]: ${analyzer.name()} failed`, error);
      }
    }

    const registry = new MotionSemanticRegistry({
      motionCharacteristics,
      interactionCharacteristics,
      timelineCharacteristics,
      technologyCharacteristics,
      confidence: {
        score: 90,
        explanation: "Aggregated motion behaviors resolved successfully.",
        factors: []
      },
      evidence: ["Semantic inference mappings resolved."],
      diagnostics: {
        executionTimeMs: Math.round(performance.now() - startTime),
        analyzersRun: this.analyzers.map(a => `${a.name()} (v${a.version()})`)
      }
    });

    Object.freeze(registry);
    Object.freeze(registry.motionCharacteristics);
    Object.freeze(registry.interactionCharacteristics);
    Object.freeze(registry.timelineCharacteristics);
    Object.freeze(registry.technologyCharacteristics);
    Object.freeze(registry.confidence);
    Object.freeze(registry.diagnostics);

    return registry;
  }
}
