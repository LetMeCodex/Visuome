import { MotionRegistry } from "./MotionRegistry.js";
import { MotionEvidence } from "./MotionEvidence.js";
import { MotionRules } from "./MotionRules.js";

export class MotionEngine {
  constructor() {
    this.caches = {
      global: new Map()
    };
    this.analyzers = [];
  }

  /**
   * Orchestrates the motion detection pipeline.
   * @param {object} scanResult
   * @returns {Promise<MotionRegistry>} Immutable motion registry.
   */
  async process(scanResult) {
    if (!scanResult) {
      return new MotionRegistry();
    }

    const scanId = scanResult.metadata?.scanId;
    if (scanId && this.caches.global.has(scanId)) {
      console.debug("Motion [Cache Hit]: Reusing global motion registry.");
      return this.caches.global.get(scanId);
    }

    const startTime = performance.now();
    const aggregatedData = {};

    const aggregatedEvidence = MotionEvidence.aggregate(scanResult.evidenceRegistry || []);

    const confidence = {
      score: 100,
      explanation: "Motion framework initialized successfully in dry mode.",
      factors: []
    };

    const registry = new MotionRegistry({
      ...aggregatedData,
      confidence,
      evidence: [aggregatedEvidence],
      diagnostics: {
        executionTimeMs: Math.round(performance.now() - startTime),
        analyzersRun: this.analyzers.map(a => `${a.name()} (v${a.version()})`)
      }
    });

    Object.freeze(registry);
    Object.freeze(registry.animationRegistry);
    Object.freeze(registry.interactionRegistry);
    Object.freeze(registry.scrollRegistry);
    Object.freeze(registry.transitionRegistry);
    Object.freeze(registry.timelineRegistry);
    Object.freeze(registry.motionPhilosophy);
    Object.freeze(registry.confidence);
    Object.freeze(registry.diagnostics);

    if (scanId) {
      this.caches.global.set(scanId, registry);
    }

    return registry;
  }
}
