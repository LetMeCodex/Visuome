import { VisualLanguageRegistry } from "./VisualLanguageRegistry.js";
import { VisualLanguageEvidence } from "./VisualLanguageEvidence.js";
import { InformationDensityAnalyzer } from "./InformationDensityAnalyzer.js";
import { VisualWeightAnalyzer } from "./VisualWeightAnalyzer.js";
import { HierarchyAnalyzer } from "./HierarchyAnalyzer.js";
import { RhythmAnalyzer } from "./RhythmAnalyzer.js";
import { SymmetryAnalyzer } from "./SymmetryAnalyzer.js";
import { ConsistencyAnalyzer } from "./ConsistencyAnalyzer.js";
import { CompositionAnalyzer } from "./CompositionAnalyzer.js";

export class VisualLanguageEngine {
  constructor() {
    this.caches = {
      InformationDensity: new Map(),
      VisualWeight: new Map(),
      Hierarchy: new Map(),
      Rhythm: new Map(),
      Symmetry: new Map(),
      Consistency: new Map(),
      Composition: new Map(),
      global: new Map()
    };

    this.analyzers = [
      new InformationDensityAnalyzer(),
      new VisualWeightAnalyzer(),
      new HierarchyAnalyzer(),
      new RhythmAnalyzer(),
      new SymmetryAnalyzer(),
      new ConsistencyAnalyzer(),
      new CompositionAnalyzer()
    ];
  }

  /**
   * Orchestrates the visual language analysis pipeline.
   * @param {object} scanResult
   * @returns {Promise<VisualLanguageRegistry>} Immutable visual language registry.
   */
  async process(scanResult) {
    if (!scanResult) {
      return new VisualLanguageRegistry();
    }

    const scanId = scanResult.metadata?.scanId;
    if (scanId && this.caches.global.has(scanId)) {
      console.debug("VisualLanguage [Cache Hit]: Reusing global visual registry.");
      return this.caches.global.get(scanId);
    }

    const startTime = performance.now();
    let aggregatedData = {};

    for (const analyzer of this.analyzers) {
      const name = analyzer.name().replace("Analyzer", "");
      const cacheNamespace = this.caches[name] || new Map();
      
      if (scanId && cacheNamespace.has(scanId)) {
        console.debug(`VisualLanguage.${name} [Cache Hit]: Reusing cached values.`);
        aggregatedData = { ...aggregatedData, ...cacheNamespace.get(scanId) };
        continue;
      }

      try {
        console.debug(`VisualLanguage.${name} [Started]: Executing analysis pass.`);
        const partial = await analyzer.analyze(scanResult, {}, {});
        
        if (scanId) {
          cacheNamespace.set(scanId, partial);
        }
        aggregatedData = { ...aggregatedData, ...partial };
        console.debug(`VisualLanguage.${name} [Finished]: Analysis completed.`);
      } catch (error) {
        console.error(`VisualLanguage.${name} [Error]: Execution failed:`, error);
      }
    }

    const density = aggregatedData.informationDensity?.score || 0;
    const weight = aggregatedData.visualWeight?.score || 0;
    const composition = aggregatedData.compositionStyle?.value || "Single Column Flow";

    let overallStyle = "Minimal Luxury";
    let styleScore = 60;
    
    if (composition === "Dashboard / Data Portal" || density > 75) {
      overallStyle = "Corporate / Complex";
      styleScore = 80;
    } else if (weight > 70 && density < 40) {
      overallStyle = "Neo-Brutalism";
      styleScore = 75;
    } else if (composition === "Hero-focused Landing" || weight > 50) {
      overallStyle = "Premium SaaS";
      styleScore = 85;
    }

    const aggregatedEvidence = VisualLanguageEvidence.aggregate(scanResult.evidenceRegistry || []);

    const confidence = {
      score: Math.min(100, Math.round((aggregatedData.designConsistency?.score || 50) * 0.4 + styleScore * 0.6)),
      explanation: `Synthesized overall style is "${overallStyle}" based on layout composition (${composition}) and styling weights.`,
      factors: [
        `Density score: ${density}`,
        `Weight score: ${weight}`,
        `Consistency score: ${aggregatedData.designConsistency?.score || 0}`
      ]
    };

    const registry = new VisualLanguageRegistry({
      ...aggregatedData,
      overallStyle,
      secondaryStyles: ["Modernist"],
      designMaturity: "Highly Structured Design System",
      confidence,
      evidence: [aggregatedEvidence],
      diagnostics: {
        executionTimeMs: Math.round(performance.now() - startTime),
        analyzersRun: this.analyzers.map(a => `${a.name()} (v${a.version()})`)
      }
    });

    Object.freeze(registry);
    Object.freeze(registry.informationDensity);
    Object.freeze(registry.visualWeight);
    Object.freeze(registry.hierarchyStrength);
    Object.freeze(registry.visualRhythm);
    Object.freeze(registry.symmetryScore);
    Object.freeze(registry.designConsistency);
    Object.freeze(registry.compositionStyle);
    Object.freeze(registry.confidence);
    Object.freeze(registry.diagnostics);

    if (scanId) {
      this.caches.global.set(scanId, registry);
    }

    return registry;
  }
}
