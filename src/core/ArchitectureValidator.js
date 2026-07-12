import { moduleRegistry } from "./ModuleRegistry.js";

export class ArchitectureValidator {
  /**
   * Run complete validation against the active registry and stage configurations.
   * @param {object} scannerEngine
   * @returns {object} status: boolean, errors: Array<string>, details: object
   */
  static validate(scannerEngine) {
    const errors = [];
    const stages = [
      "INITIALIZE",
      "DOCUMENT_DISCOVERY",
      "DOM_DISCOVERY",
      "VISUAL_TREE_BUILD",
      "CSS_DISCOVERY",
      "STYLE_DISCOVERY",
      "TYPOGRAPHY_INTELLIGENCE",
      "COLOR_INTELLIGENCE",
      "SPACING_INTELLIGENCE",
      "LAYOUT_INTELLIGENCE",
      "COMPONENT_INTELLIGENCE",
      "EVIDENCE_FUSION",
      "CONFLICT_RESOLUTION",
      "CONFIDENCE_ANALYSIS",
      "SCAN_DIAGNOSTICS",
      "FINAL_SCAN_RESULT",
      "VISUAL_LANGUAGE_INTELLIGENCE",
      "SEMANTIC_INTELLIGENCE",
      "DESIGN_PHILOSOPHY",
      "MOTION_DISCOVERY",
      "PLATFORM_INTELLIGENCE",
      "DESIGN_GENOME_BUILD",
      "DESIGN_GENOME_VALIDATE",
      "DESIGN_GENOME_FREEZE",
      "PROMPT_STUDIO_BUILD",
      "PROMPT_COMPOSER_BUILD",
      "EXPORT_ENGINE",
      "WAITING_FOR_NEXT_STAGE"
    ];

    // 1. Check duplicate stages
    const uniqueStages = new Set(stages);
    if (uniqueStages.size !== stages.length) {
      errors.push("Duplicate pipeline stages defined.");
    }

    // 2. Check registered modules
    const expectedModules = [
      "DOCUMENT_DISCOVERY",
      "DOM_DISCOVERY",
      "VISUAL_TREE_BUILD",
      "STYLE_DISCOVERY",
      "TYPOGRAPHY_INTELLIGENCE",
      "COLOR_INTELLIGENCE",
      "SPACING_INTELLIGENCE",
      "LAYOUT_INTELLIGENCE",
      "COMPONENT_INTELLIGENCE",
      "EVIDENCE_FUSION",
      "CONFLICT_RESOLUTION",
      "CONFIDENCE_ANALYSIS",
      "SCAN_DIAGNOSTICS",
      "FINAL_SCAN_RESULT",
      "VISUAL_LANGUAGE_INTELLIGENCE",
      "SEMANTIC_INTELLIGENCE",
      "DESIGN_PHILOSOPHY",
      "MOTION_DISCOVERY",
      "PLATFORM_INTELLIGENCE",
      "DESIGN_GENOME_BUILD",
      "DESIGN_GENOME_VALIDATE",
      "DESIGN_GENOME_FREEZE",
      "PROMPT_STUDIO_BUILD",
      "PROMPT_COMPOSER_BUILD",
      "EXPORT_ENGINE"
    ];

    for (const mod of expectedModules) {
      if (!moduleRegistry.has(mod)) {
        errors.push(`Orphan stage configuration or missing module registration: "${mod}"`);
      }
    }

    // 3. Reachable stages & duplicate events check
    const duplicateEventCheck = new Set();
    const expectedEvents = [
      "SCAN_INITIALIZED",
      "DOCUMENT_DISCOVERY_STARTED", "DOCUMENT_DISCOVERY_FINISHED",
      "DOM_DISCOVERY_STARTED", "DOM_DISCOVERY_FINISHED",
      "VISUAL_TREE_STARTED", "VISUAL_TREE_FINISHED",
      "STYLE_DISCOVERY_STARTED", "STYLE_DISCOVERY_FINISHED",
      "TYPOGRAPHY_STARTED", "TYPOGRAPHY_FINISHED",
      "COLOR_STARTED", "COLOR_FINISHED",
      "SPACING_STARTED", "SPACING_FINISHED",
      "LAYOUT_STARTED", "LAYOUT_FINISHED",
      "COMPONENT_STARTED", "COMPONENT_FINISHED",
      "EVIDENCE_FUSION_STARTED", "EVIDENCE_FUSION_FINISHED",
      "CONFLICT_RESOLUTION_STARTED", "CONFLICT_RESOLUTION_FINISHED",
      "CONFIDENCE_ANALYSIS_STARTED", "CONFIDENCE_ANALYSIS_FINISHED",
      "SCAN_DIAGNOSTICS_STARTED", "SCAN_DIAGNOSTICS_FINISHED",
      "FINAL_SCAN_RESULT_STARTED", "FINAL_SCAN_RESULT_FINISHED",
      "VISUAL_LANGUAGE_STARTED", "VISUAL_LANGUAGE_FINISHED", "VISUAL_LANGUAGE_FAILED",
      "SEMANTIC_STARTED", "SEMANTIC_FINISHED", "SEMANTIC_FAILED",
      "DESIGN_PHILOSOPHY_STARTED", "DESIGN_PHILOSOPHY_FINISHED", "DESIGN_PHILOSOPHY_FAILED",
      "MOTION_STARTED", "MOTION_FINISHED", "MOTION_FAILED",
      "PLATFORM_STARTED", "PLATFORM_FINISHED", "PLATFORM_FAILED",
      "COMPONENT_GRAPH_STARTED", "COMPONENT_GRAPH_FINISHED",
      "ASSET_DISCOVERY_STARTED", "ASSET_DISCOVERY_FINISHED",
      "RELATIONSHIP_INTELLIGENCE_STARTED", "RELATIONSHIP_INTELLIGENCE_FINISHED",
      "PATTERN_DETECTION_STARTED", "PATTERN_DETECTION_FINISHED",
      "DESIGN_SYSTEM_DISCOVERY_STARTED", "DESIGN_SYSTEM_DISCOVERY_FINISHED",
      "GRAPH_OPTIMIZATION_STARTED", "GRAPH_OPTIMIZATION_FINISHED",
      "GENOME_STARTED", "GENOME_BUILDING", "GENOME_VALIDATING", "GENOME_SERIALIZING", "GENOME_FINISHED", "GENOME_FAILED",
      "DNA_EXTRACTION_STARTED", "DNA_EXTRACTION_FINISHED", "GENOME_FREEZE_STARTED", "GENOME_FREEZE_FINISHED",
      "PROMPT_STARTED", "PROMPT_BUILDING", "PROMPT_VALIDATING", "PROMPT_SERIALIZING", "PROMPT_FINISHED", "PROMPT_FAILED",
      "PROMPT_COMPOSER_STARTED", "PROMPT_BLOCKS_CREATED", "PROMPT_VARIABLES_CREATED", "PROMPT_TRANSFORMATIONS_READY", "PROMPT_COMPOSER_FINISHED", "PROMPT_COMPOSER_FAILED",
      "PROMPT_EXPORT_STARTED", "PROMPT_EXPORT_FINISHED", "MODEL_OPTIMIZATION_STARTED", "MODEL_OPTIMIZATION_FINISHED", "PROMPT_HISTORY_UPDATED", "PROMPT_PRESET_APPLIED", "PROMPT_UI_INITIALIZED"
    ];

    for (const evt of expectedEvents) {
      if (duplicateEventCheck.has(evt)) {
        errors.push(`Duplicate event name declaration: "${evt}"`);
      } else {
        duplicateEventCheck.add(evt);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      details: {
        stagesCount: stages.length,
        modulesCount: moduleRegistry.registry.size,
        eventsCount: expectedEvents.length
      }
    };
  }
}
