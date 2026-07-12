import { GenomeAnalyzerInterface } from "./GenomeAnalyzerInterface.js";

/**
 * Normalizes Motion, Motion Semantic, and Motion Philosophy registries.
 */
export class MotionDNAExtractor extends GenomeAnalyzerInterface {
  async extract(scanResult) {
    const motion = scanResult.motionRegistry || {};
    return {
      animations: motion.animations || [],
      timelines: motion.timelines || [],
      interactions: motion.interactions || [],
      motionCharacteristics: scanResult.motionSemanticRegistry || {},
      motionPhilosophy: scanResult.motionPhilosophyRegistry || {},
      confidence: motion.confidence || { score: 100 },
      evidence: motion.evidence || []
    };
  }

  name() {
    return "MotionDNAExtractor";
  }

  version() {
    return "1.0.0";
  }

  dependencies() {
    return ["motionRegistry", "motionSemanticRegistry", "motionPhilosophyRegistry"];
  }
}
