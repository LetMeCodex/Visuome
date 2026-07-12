import { DesignPhilosophyAnalyzerInterface } from "./DesignPhilosophyAnalyzerInterface.js";

export class CompositionPhilosophyAnalyzer extends DesignPhilosophyAnalyzerInterface {
  name() { return "CompositionPhilosophyAnalyzer"; }
  version() { return "1.0.0"; }
  dependencies() { return ["visualLanguageRegistry"]; }

  /**
   * Assess layout format values from visual registry to formulate Composition Philosophy.
   * @param {object} scanResult
   * @param {object} semanticRegistry
   * @param {object} rules
   * @param {object} cache
   * @returns {Promise<object>} Composition philosophy registry entries.
   */
  async analyze(scanResult, semanticRegistry, rules, cache) {
    const vRegistry = scanResult.visualLanguageRegistry || {};
    const compVal = vRegistry.compositionStyle?.value || "Single Column Flow";

    const buildRecord = (score, confidence, reasoning, value) => ({
      score,
      confidence,
      reasoning: `${reasoning} Inferred from layout format: ${value}`,
      supportingEvidence: [`Composition registry format detected: ${value}`],
      contradictions: [],
      trace: {
        semanticRegistryKey: "",
        visualLanguageRegistryKey: "compositionStyle",
        evidenceIds: []
      }
    });

    const isHero = compVal === "Hero-focused Landing";
    const isDashboard = compVal === "Dashboard / Data Portal";
    const isGrid = compVal === "Card Grid Portal";
    const isImmersive = compVal === "Immersive Media Display";

    return {
      compositionPhilosophy: {
        heroCentric: buildRecord(isHero ? 90 : 30, 95, "Hero centered composition focus.", compVal),
        editorial: buildRecord(isHero ? 60 : 40, 80, "Editorial column readability.", compVal),
        dashboard: buildRecord(isDashboard ? 95 : 10, 95, "Dense metrics panel controls layout.", compVal),
        immersive: buildRecord(isImmersive ? 90 : 20, 85, "Visual cinematic backdrop immersion layout.", compVal),
        gridFirst: buildRecord(isGrid || isDashboard ? 90 : 40, 90, "Structured structural grid boundaries.", compVal),
        storyFirst: buildRecord(isHero ? 80 : 30, 80, "Storytelling content narrative flow alignment.", compVal),
        systematic: buildRecord(isDashboard || isGrid ? 90 : 50, 90, "Rules-based design framework composition.", compVal)
      }
    };
  }
}
