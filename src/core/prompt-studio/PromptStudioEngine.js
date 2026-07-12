import { PromptBuilder } from "./PromptBuilder.js";
import { PromptValidator } from "./PromptValidator.js";
import { PromptSerializer } from "./PromptSerializer.js";
import { PromptDiagnostics } from "./PromptDiagnostics.js";
import { PromptRegistry } from "./PromptRegistry.js";
import { PromptVersion } from "./PromptVersion.js";

/**
 * Orchestrates prompts construction, validation checks, serialization metrics, and freezing registries.
 */
export class PromptStudioEngine {
  /**
   * Generates prompt profiles from a completed Design Genome.
   * @param {object} genome DesignGenome.
   * @param {string} format markdown, text, json
   * @returns {Promise<PromptRegistry>} Master registry containing compiled prompts.
   */
  async buildRegistry(genome, format = "markdown") {
    const startGen = performance.now();
    const profiles = PromptBuilder.build(genome, format);
    const genMs = Math.round(performance.now() - startGen);

    const version = new PromptVersion();
    const registry = new PromptRegistry({
      metadata: {
        promptId: `prompt-${Math.random().toString(36).slice(2, 11)}`,
        genomeId: genome?.metadata?.genomeId || "",
        generatedAt: new Date().toISOString(),
        version: version.version,
        compatibilityVersion: version.compatibilityVersion
      },
      ...profiles
    });

    const startVal = performance.now();
    const validation = PromptValidator.validate(registry);
    const valMs = Math.round(performance.now() - startVal);

    const startSer = performance.now();
    PromptSerializer.serialize(registry, format);
    const serMs = Math.round(performance.now() - startSer);

    const diagnostics = PromptDiagnostics.generate(registry, genMs, valMs, serMs);
    registry.diagnostics = diagnostics;

    Object.freeze(registry.metadata);
    Object.freeze(registry.diagnostics);
    Object.freeze(registry.confidence);
    Object.freeze(registry);

    return registry;
  }
}
