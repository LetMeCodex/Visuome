import { MotionPhilosophyRegistry } from "./MotionPhilosophyRegistry.js";

export class MotionPhilosophyEngine {
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
   * Orchestrates philosophy calculation phases.
   * @param {object} semanticRegistry MotionSemanticRegistry input.
   * @returns {Promise<MotionPhilosophyRegistry>} Frozen output.
   */
  async process(semanticRegistry) {
    if (!semanticRegistry) {
      return new MotionPhilosophyRegistry();
    }

    const startTime = performance.now();
    const motionPhilosophy = {};
    const interactionPhilosophy = {};
    const cognitiveMotion = {};

    const cacheRef = new Map();

    for (const analyzer of this.analyzers) {
      try {
        const findings = await analyzer.analyze(semanticRegistry, cacheRef);
        const name = analyzer.name();

        if (name === "MotionPhilosophyAnalyzer") {
          Object.assign(motionPhilosophy, findings);
        } else if (name === "InteractionPhilosophyAnalyzer") {
          Object.assign(interactionPhilosophy, findings);
        } else if (name === "CognitiveMotionAnalyzer") {
          Object.assign(cognitiveMotion, findings);
        }
      } catch (error) {
        console.error(`MotionPhilosophyEngine [Error]: ${analyzer.name()} failed`, error);
      }
    }

    const registry = new MotionPhilosophyRegistry({
      motionPhilosophy,
      interactionPhilosophy,
      cognitiveMotion,
      confidence: {
        score: 90,
        explanation: "Design philosophy metrics mapping complete.",
        factors: []
      },
      evidence: ["Cognitive and interaction values analyzed."],
      diagnostics: {
        executionTimeMs: Math.round(performance.now() - startTime),
        analyzersRun: this.analyzers.map(a => `${a.name()} (v${a.version()})`)
      }
    });

    Object.freeze(registry);
    Object.freeze(registry.motionPhilosophy);
    Object.freeze(registry.interactionPhilosophy);
    Object.freeze(registry.cognitiveMotion);
    Object.freeze(registry.confidence);
    Object.freeze(registry.diagnostics);

    return registry;
  }
}
