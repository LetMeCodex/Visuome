import { GenomeAnalyzerInterface } from "./GenomeAnalyzerInterface.js";

/**
 * Extracts and maps keyboard, mouse hover/click, and pointer touch trigger scales.
 */
export class InteractionDNAExtractor extends GenomeAnalyzerInterface {
  async extract(scanResult) {
    const motion = scanResult.motionRegistry || {};
    const platform = scanResult.platformRegistry || {};

    return {
      hover: motion.hoverInteractions || [],
      click: motion.clickInteractions || [],
      focus: motion.focusInteractions || [],
      touch: [],
      keyboard: [],
      pointer: [],
      scroll: platform.scrollAnimationCount || 0,
      passive: [],
      active: []
    };
  }

  name() {
    return "InteractionDNAExtractor";
  }

  version() {
    return "1.0.0";
  }

  dependencies() {
    return ["motionRegistry", "platformRegistry"];
  }
}
