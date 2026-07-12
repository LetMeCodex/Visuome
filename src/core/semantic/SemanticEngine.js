import { SemanticRegistry } from "./SemanticRegistry.js";
import { SemanticEvidence } from "./SemanticEvidence.js";
import { SemanticRules } from "./SemanticRules.js";
import { VisualCharacteristicsAnalyzer } from "./VisualCharacteristicsAnalyzer.js";
import { TypographyCharacteristicsAnalyzer } from "./TypographyCharacteristicsAnalyzer.js";
import { LayoutCharacteristicsAnalyzer } from "./LayoutCharacteristicsAnalyzer.js";
import { ColorCharacteristicsAnalyzer } from "./ColorCharacteristicsAnalyzer.js";
import { BrandCharacteristicsAnalyzer } from "./BrandCharacteristicsAnalyzer.js";

export class SemanticEngine {
  constructor() {
    this.caches = {
      Visual: new Map(),
      Typography: new Map(),
      Layout: new Map(),
      Color: new Map(),
      Brand: new Map(),
      global: new Map()
    };

    this.analyzers = [
      new VisualCharacteristicsAnalyzer(),
      new TypographyCharacteristicsAnalyzer(),
      new LayoutCharacteristicsAnalyzer(),
      new ColorCharacteristicsAnalyzer(),
      new BrandCharacteristicsAnalyzer()
    ];
  }

  /**
   * Orchestrates the semantic analysis pipeline.
   * @param {object} scanResult
   * @returns {Promise<SemanticRegistry>} Immutable semantic registry.
   */
  async process(scanResult) {
    if (!scanResult || !scanResult.visualLanguageRegistry) {
      console.warn("SemanticEngine: Missing visualLanguageRegistry. Returning empty registry.");
      return new SemanticRegistry();
    }

    const scanId = scanResult.metadata?.scanId;
    if (scanId && this.caches.global.has(scanId)) {
      console.debug("Semantic [Cache Hit]: Reusing global semantic registry.");
      return this.caches.global.get(scanId);
    }

    const startTime = performance.now();
    let aggregatedData = {
      visualCharacteristics: {},
      styleCharacteristics: {},
      layoutCharacteristics: {},
      colorCharacteristics: {},
      typographyCharacteristics: {},
      brandCharacteristics: {}
    };

    for (const analyzer of this.analyzers) {
      const name = analyzer.name().replace("CharacteristicsAnalyzer", "").replace("Analyzer", "");
      const cacheNamespace = this.caches[name] || new Map();

      if (scanId && cacheNamespace.has(scanId)) {
        console.debug(`Semantic.${name} [Cache Hit]: Reusing cached values.`);
        const partial = cacheNamespace.get(scanId);
        this.mergePartial(aggregatedData, partial, name);
        continue;
      }

      try {
        console.debug(`Semantic.${name} [Started]: Executing analysis pass.`);
        const partial = await analyzer.analyze(scanResult, scanResult.visualLanguageRegistry, SemanticRules, {});
        
        if (scanId) {
          cacheNamespace.set(scanId, partial);
        }
        this.mergePartial(aggregatedData, partial, name);
        console.debug(`Semantic.${name} [Finished]: Analysis completed.`);
      } catch (error) {
        console.error(`Semantic.${name} [Error]: Execution failed:`, error);
      }
    }

    const aggregatedEvidence = SemanticEvidence.aggregate(scanResult.visualLanguageRegistry.evidence || []);

    const scores = [];
    const pushScore = (item) => { if (item?.score !== undefined) scores.push(item.score); };
    Object.values(aggregatedData.brandCharacteristics).forEach(pushScore);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 50;

    const confidence = {
      score: avgScore,
      explanation: `Semantic confidence calculated at ${avgScore}/100 based on consistency, rhythm and layout constraints.`,
      factors: [`Average brand feel score: ${avgScore}`]
    };

    const registry = new SemanticRegistry({
      ...aggregatedData,
      confidence,
      evidence: [aggregatedEvidence],
      diagnostics: {
        executionTimeMs: Math.round(performance.now() - startTime),
        analyzersRun: this.analyzers.map(a => `${a.name()} (v${a.version()})`)
      }
    });

    Object.freeze(registry);
    Object.freeze(registry.visualCharacteristics);
    Object.freeze(registry.styleCharacteristics);
    Object.freeze(registry.layoutCharacteristics);
    Object.freeze(registry.colorCharacteristics);
    Object.freeze(registry.typographyCharacteristics);
    Object.freeze(registry.interactionCharacteristics);
    Object.freeze(registry.motionCharacteristics);
    Object.freeze(registry.brandCharacteristics);
    Object.freeze(registry.confidence);
    Object.freeze(registry.diagnostics);

    if (scanId) {
      this.caches.global.set(scanId, registry);
    }

    return registry;
  }

  mergePartial(target, partial, name) {
    if (name === "Visual") {
      target.visualCharacteristics = { ...target.visualCharacteristics, ...partial };
    } else if (name === "Typography") {
      target.typographyCharacteristics = { ...target.typographyCharacteristics, ...partial };
    } else if (name === "Layout") {
      target.layoutCharacteristics = { ...target.layoutCharacteristics, ...partial };
    } else if (name === "Color") {
      target.colorCharacteristics = { ...target.colorCharacteristics, ...partial };
    } else if (name === "Brand") {
      target.brandCharacteristics = { ...target.brandCharacteristics, ...partial };
    }
  }
}
