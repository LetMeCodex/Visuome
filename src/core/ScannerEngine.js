import { ScanSession } from "./ScanSession.js";
import { eventBus } from "./EventBus.js";
import { moduleRegistry } from "./ModuleRegistry.js";
import { PipelineEngine } from "./PipelineEngine.js";

export class ScannerEngine {
  constructor() {
    this.pipeline = null;
    this.activeSession = null;
  }

  /**
   * Set up the pipeline with all Visuome scanning stages.
   */
  initializePipeline() {
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

    const steps = stages.map((stage) => {
      return {
        name: stage,
        critical: ["INITIALIZE", "DOCUMENT_DISCOVERY", "DOM_DISCOVERY", "VISUAL_TREE_BUILD"].includes(stage),
        run: async (session) => {
          const stepStartTime = performance.now();
          // Emit specific lifecycle start events
          if (stage === "INITIALIZE") {
            eventBus.publish("SCAN_INITIALIZED", session);
          } else if (stage === "DOCUMENT_DISCOVERY") {
            eventBus.publish("DOCUMENT_DISCOVERY_STARTED", session);
          } else if (stage === "DOM_DISCOVERY") {
            eventBus.publish("DOM_DISCOVERY_STARTED", session);
          } else if (stage === "VISUAL_TREE_BUILD") {
            eventBus.publish("VISUAL_TREE_STARTED", session);
          } else if (stage === "STYLE_DISCOVERY") {
            eventBus.publish("STYLE_DISCOVERY_STARTED", session);
          } else if (stage === "TYPOGRAPHY_INTELLIGENCE") {
            eventBus.publish("TYPOGRAPHY_STARTED", session);
          } else if (stage === "COLOR_INTELLIGENCE") {
            eventBus.publish("COLOR_STARTED", session);
          } else if (stage === "SPACING_INTELLIGENCE") {
            eventBus.publish("SPACING_STARTED", session);
          } else if (stage === "LAYOUT_INTELLIGENCE") {
            eventBus.publish("LAYOUT_STARTED", session);
          } else if (stage === "COMPONENT_INTELLIGENCE") {
            eventBus.publish("COMPONENT_STARTED", session);
          } else if (stage === "EVIDENCE_FUSION") {
            eventBus.publish("EVIDENCE_FUSION_STARTED", session);
          } else if (stage === "CONFLICT_RESOLUTION") {
            eventBus.publish("CONFLICT_RESOLUTION_STARTED", session);
          } else if (stage === "CONFIDENCE_ANALYSIS") {
            eventBus.publish("CONFIDENCE_ANALYSIS_STARTED", session);
          } else if (stage === "SCAN_DIAGNOSTICS") {
            eventBus.publish("SCAN_DIAGNOSTICS_STARTED", session);
          } else if (stage === "FINAL_SCAN_RESULT") {
            eventBus.publish("FINAL_SCAN_RESULT_STARTED", session);
          } else if (stage === "VISUAL_LANGUAGE_INTELLIGENCE") {
            eventBus.publish("VISUAL_LANGUAGE_STARTED", session);
          } else if (stage === "SEMANTIC_INTELLIGENCE") {
            eventBus.publish("SEMANTIC_STARTED", session);
          } else if (stage === "DESIGN_PHILOSOPHY") {
            eventBus.publish("DESIGN_PHILOSOPHY_STARTED", session);
          } else if (stage === "MOTION_DISCOVERY") {
            eventBus.publish("MOTION_STARTED", session);
          } else if (stage === "PLATFORM_INTELLIGENCE") {
            eventBus.publish("PLATFORM_STARTED", session);
          } else if (stage === "DESIGN_GENOME_BUILD") {
            eventBus.publish("GENOME_STARTED", session);
          } else if (stage === "DESIGN_GENOME_VALIDATE") {
            eventBus.publish("GENOME_VALIDATING", session);
          } else if (stage === "DESIGN_GENOME_FREEZE") {
            eventBus.publish("GENOME_FREEZE_STARTED", session);
          } else if (stage === "PROMPT_STUDIO_BUILD") {
            eventBus.publish("PROMPT_STARTED", session);
          } else if (stage === "PROMPT_COMPOSER_BUILD") {
            eventBus.publish("PROMPT_COMPOSER_STARTED", session);
          } else if (stage === "EXPORT_ENGINE") {
            eventBus.publish("PROMPT_EXPORT_STARTED", session);
          }

          const moduleInstance = moduleRegistry.get(stage);
          if (!moduleInstance) {
            console.info(`Visuome ScannerEngine: No registered module for stage "${stage}". Skipping.`);
            
            // Emit finish even if skipping
            if (stage === "DOCUMENT_DISCOVERY") {
              eventBus.publish("DOCUMENT_DISCOVERY_FINISHED", session);
            } else if (stage === "DOM_DISCOVERY") {
              eventBus.publish("DOM_DISCOVERY_FINISHED", session);
            } else if (stage === "VISUAL_TREE_BUILD") {
              eventBus.publish("VISUAL_TREE_FINISHED", session);
            } else if (stage === "STYLE_DISCOVERY") {
              eventBus.publish("STYLE_DISCOVERY_FINISHED", session);
            } else if (stage === "TYPOGRAPHY_INTELLIGENCE") {
              eventBus.publish("TYPOGRAPHY_FINISHED", session);
            } else if (stage === "COLOR_INTELLIGENCE") {
              eventBus.publish("COLOR_FINISHED", session);
            } else if (stage === "SPACING_INTELLIGENCE") {
              eventBus.publish("SPACING_FINISHED", session);
            } else if (stage === "LAYOUT_INTELLIGENCE") {
              eventBus.publish("LAYOUT_FINISHED", session);
            } else if (stage === "COMPONENT_INTELLIGENCE") {
              eventBus.publish("COMPONENT_FINISHED", session);
            } else if (stage === "EVIDENCE_FUSION") {
              eventBus.publish("EVIDENCE_FUSION_FINISHED", session);
            } else if (stage === "CONFLICT_RESOLUTION") {
              eventBus.publish("CONFLICT_RESOLUTION_FINISHED", session);
            } else if (stage === "CONFIDENCE_ANALYSIS") {
              eventBus.publish("CONFIDENCE_ANALYSIS_FINISHED", session);
            } else if (stage === "SCAN_DIAGNOSTICS") {
              eventBus.publish("SCAN_DIAGNOSTICS_FINISHED", session);
            } else if (stage === "FINAL_SCAN_RESULT") {
              eventBus.publish("FINAL_SCAN_RESULT_FINISHED", session);
            } else if (stage === "VISUAL_LANGUAGE_INTELLIGENCE") {
              eventBus.publish("VISUAL_LANGUAGE_FINISHED", session);
            } else if (stage === "SEMANTIC_INTELLIGENCE") {
              eventBus.publish("SEMANTIC_FINISHED", session);
            } else if (stage === "DESIGN_PHILOSOPHY") {
              eventBus.publish("DESIGN_PHILOSOPHY_FINISHED", session);
            } else if (stage === "MOTION_DISCOVERY") {
              eventBus.publish("MOTION_FINISHED", session);
            } else if (stage === "PLATFORM_INTELLIGENCE") {
              eventBus.publish("PLATFORM_FINISHED", session);
            } else if (stage === "DESIGN_GENOME_BUILD") {
              eventBus.publish("GENOME_FINISHED", session);
            } else if (stage === "DESIGN_GENOME_VALIDATE") {
              eventBus.publish("GENOME_FINISHED", session);
            } else if (stage === "DESIGN_GENOME_FREEZE") {
              eventBus.publish("GENOME_FREEZE_FINISHED", session);
            } else if (stage === "PROMPT_STUDIO_BUILD") {
              eventBus.publish("PROMPT_FINISHED", session);
            } else if (stage === "PROMPT_COMPOSER_BUILD") {
              eventBus.publish("PROMPT_COMPOSER_FINISHED", session);
            } else if (stage === "EXPORT_ENGINE") {
              eventBus.publish("PROMPT_EXPORT_FINISHED", session);
            }

            if (!session.data.pipelineTimings) {
              session.data.pipelineTimings = {};
            }
            session.data.pipelineTimings[stage] = Math.round(performance.now() - stepStartTime);
            return;
          }

          try {
            await moduleInstance.initialize();
            const result = await moduleInstance.scan(session);
            
            if (typeof moduleInstance.validate === "function" && result !== undefined) {
              const isValid = await moduleInstance.validate(result);
              if (!isValid) {
                throw new Error(`Validation failed for stage "${stage}" output.`);
              }
            }

            session.data[stage] = result || {};
          } catch (error) {
            if (stage === "VISUAL_LANGUAGE_INTELLIGENCE") {
              eventBus.publish("VISUAL_LANGUAGE_FAILED", session);
            } else if (stage === "SEMANTIC_INTELLIGENCE") {
              eventBus.publish("SEMANTIC_FAILED", session);
            } else if (stage === "DESIGN_PHILOSOPHY") {
              eventBus.publish("DESIGN_PHILOSOPHY_FAILED", session);
            } else if (stage === "MOTION_DISCOVERY") {
              eventBus.publish("MOTION_FAILED", session);
            } else if (stage === "PLATFORM_INTELLIGENCE") {
              eventBus.publish("PLATFORM_FAILED", session);
            } else if (stage === "DESIGN_GENOME_BUILD") {
              eventBus.publish("GENOME_FAILED", session);
            } else if (stage === "DESIGN_GENOME_VALIDATE") {
              eventBus.publish("GENOME_FAILED", session);
            } else if (stage === "DESIGN_GENOME_FREEZE") {
              eventBus.publish("GENOME_FAILED", session);
            } else if (stage === "PROMPT_STUDIO_BUILD") {
              eventBus.publish("PROMPT_FAILED", session);
            } else if (stage === "PROMPT_COMPOSER_BUILD") {
              eventBus.publish("PROMPT_COMPOSER_FAILED", session);
            } else if (stage === "EXPORT_ENGINE") {
              eventBus.publish("PROMPT_EXPORT_FINISHED", session); // Fallback fail as finished
            }
            throw error;
          } finally {
            if (typeof moduleInstance.cleanup === "function") {
              await moduleInstance.cleanup();
            }

            // Emit specific lifecycle finish events
            if (stage === "DOCUMENT_DISCOVERY") {
              eventBus.publish("DOCUMENT_DISCOVERY_FINISHED", session);
            } else if (stage === "DOM_DISCOVERY") {
              eventBus.publish("DOM_DISCOVERY_FINISHED", session);
            } else if (stage === "VISUAL_TREE_BUILD") {
              eventBus.publish("VISUAL_TREE_FINISHED", session);
            } else if (stage === "STYLE_DISCOVERY") {
              eventBus.publish("STYLE_DISCOVERY_FINISHED", session);
            } else if (stage === "TYPOGRAPHY_INTELLIGENCE") {
              eventBus.publish("TYPOGRAPHY_FINISHED", session);
            } else if (stage === "COLOR_INTELLIGENCE") {
              eventBus.publish("COLOR_FINISHED", session);
            } else if (stage === "SPACING_INTELLIGENCE") {
              eventBus.publish("SPACING_FINISHED", session);
            } else if (stage === "LAYOUT_INTELLIGENCE") {
              eventBus.publish("LAYOUT_FINISHED", session);
            } else if (stage === "COMPONENT_INTELLIGENCE") {
              eventBus.publish("COMPONENT_FINISHED", session);
            } else if (stage === "EVIDENCE_FUSION") {
              eventBus.publish("EVIDENCE_FUSION_FINISHED", session);
            } else if (stage === "CONFLICT_RESOLUTION") {
              eventBus.publish("CONFLICT_RESOLUTION_FINISHED", session);
            } else if (stage === "CONFIDENCE_ANALYSIS") {
              eventBus.publish("CONFIDENCE_ANALYSIS_FINISHED", session);
            } else if (stage === "SCAN_DIAGNOSTICS") {
              eventBus.publish("SCAN_DIAGNOSTICS_FINISHED", session);
            } else if (stage === "FINAL_SCAN_RESULT") {
              eventBus.publish("FINAL_SCAN_RESULT_FINISHED", session);
            } else if (stage === "VISUAL_LANGUAGE_INTELLIGENCE") {
              eventBus.publish("VISUAL_LANGUAGE_FINISHED", session);
            } else if (stage === "SEMANTIC_INTELLIGENCE") {
              eventBus.publish("SEMANTIC_FINISHED", session);
            } else if (stage === "DESIGN_PHILOSOPHY") {
              eventBus.publish("DESIGN_PHILOSOPHY_FINISHED", session);
            } else if (stage === "MOTION_DISCOVERY") {
              eventBus.publish("MOTION_FINISHED", session);
            } else if (stage === "PLATFORM_INTELLIGENCE") {
              eventBus.publish("PLATFORM_FINISHED", session);
            } else if (stage === "DESIGN_GENOME_BUILD") {
              eventBus.publish("GENOME_FINISHED", session);
            } else if (stage === "DESIGN_GENOME_VALIDATE") {
              eventBus.publish("GENOME_FINISHED", session);
            } else if (stage === "DESIGN_GENOME_FREEZE") {
              eventBus.publish("GENOME_FREEZE_FINISHED", session);
            } else if (stage === "PROMPT_STUDIO_BUILD") {
              eventBus.publish("PROMPT_FINISHED", session);
            } else if (stage === "PROMPT_COMPOSER_BUILD") {
              eventBus.publish("PROMPT_COMPOSER_FINISHED", session);
            } else if (stage === "EXPORT_ENGINE") {
              eventBus.publish("PROMPT_EXPORT_FINISHED", session);
            }

            if (!session.data.pipelineTimings) {
              session.data.pipelineTimings = {};
            }
            session.data.pipelineTimings[stage] = Math.round(performance.now() - stepStartTime);
          }
        }
      };
    });

    this.pipeline = new PipelineEngine(steps);
    this.pipeline.setEventBus(eventBus);
  }

  /**
   * Run a complete scan for a given URL.
   * @param {string} url
   * @returns {Promise<ScanSession>}
   */
  async runScan(url) {
    if (!this.pipeline) {
      this.initializePipeline();
    }

    this.activeSession = new ScanSession(url);
    try {
      await this.pipeline.start(this.activeSession);
      if (this.activeSession.status === "FAILED") {
        eventBus.publish("SCAN_FAILED", this.activeSession);
      } else {
        eventBus.publish("SCAN_FINISHED", this.activeSession);
      }
    } catch (error) {
      console.error("Visuome ScannerEngine: Scan execution session failed", error);
      this.activeSession.addError("GLOBAL_ORCHESTRATOR", error);
      this.activeSession.endSession(false);
      eventBus.publish("SCAN_FAILED", this.activeSession);
    }

    return this.activeSession;
  }

  /**
   * Pause the active pipeline execution.
   */
  pause() {
    if (this.pipeline) {
      this.pipeline.pause();
    }
  }

  /**
   * Resume the active pipeline execution.
   */
  resume() {
    if (this.pipeline) {
      this.pipeline.resume();
    }
  }

  /**
   * Cancel the active pipeline execution.
   */
  cancel() {
    if (this.pipeline) {
      this.pipeline.cancel();
    }
  }

  /**
   * Retry execution of a failed step.
   * @param {string} stageName Name of the stage step.
   */
  async retryStep(stageName) {
    if (this.pipeline) {
      return this.pipeline.retry(stageName);
    }
    return false;
  }
}

export const scannerEngine = new ScannerEngine();
