export class PipelineEngine {
  constructor(steps = []) {
    this.steps = steps; // List of steps: { name: string, run: async (session) => {}, critical: boolean }
    this.currentStepIndex = -1;
    this.isPaused = false;
    this.isCancelled = false;
    this.session = null;
    this.eventBus = null;
    this.resumeResolve = null;
  }

  /**
   * Set the EventBus reference for pipeline event broadcasts.
   * @param {EventBus} eventBus
   */
  setEventBus(eventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Start pipeline execution for a scan session.
   * @param {ScanSession} session
   * @returns {Promise<ScanSession>}
   */
  async start(session) {
    this.session = session;
    this.currentStepIndex = 0;
    this.isPaused = false;
    this.isCancelled = false;

    if (this.eventBus) {
      this.eventBus.publish("SCAN_STARTED", this.session);
    }

    return this.executePipeline();
  }

  /**
   * Internal pipeline loop.
   */
  async executePipeline() {
    while (this.currentStepIndex < this.steps.length) {
      if (this.isCancelled) {
        this.session.endSession(false);
        this.session.updateStatus("FAILED");
        if (this.eventBus) {
          this.eventBus.publish("SCAN_FINISHED", this.session);
        }
        return this.session;
      }

      if (this.isPaused) {
        await new Promise((resolve) => {
          this.resumeResolve = resolve;
        });
      }

      const step = this.steps[this.currentStepIndex];
      this.updateSessionState(step.name);

      if (this.eventBus) {
        this.eventBus.publish(`${step.name}_START`, this.session);
      }

      try {
        await step.run(this.session);
        if (this.eventBus) {
          this.eventBus.publish(`${step.name}_COMPLETE`, this.session);
        }
      } catch (error) {
        console.error(`Visuome PipelineEngine: Step "${step.name}" failed:`, error);
        this.session.addError(step.name, error);

        // Fail-safe execution boundary
        if (step.critical) {
          this.session.endSession(false);
          this.session.updateStatus("FAILED");
          if (this.eventBus) {
            this.eventBus.publish("SCAN_FINISHED", this.session);
          }
          throw error;
        }
      }

      this.currentStepIndex++;
    }

    const hasErrors = this.session.errors.length > 0;
    this.session.endSession(!hasErrors || this.session.status !== "FAILED");
    if (hasErrors) {
      this.session.updateStatus("PARTIAL");
    } else {
      this.session.updateStatus("COMPLETED");
    }

    if (this.eventBus) {
      this.eventBus.publish("SCAN_FINISHED", this.session);
    }

    return this.session;
  }

  /**
   * Pause execution after the current active step completes.
   */
  pause() {
    if (this.session && !["COMPLETED", "FAILED", "PARTIAL"].includes(this.session.status)) {
      this.isPaused = true;
    }
  }

  /**
   * Resume paused pipeline execution.
   */
  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      if (this.resumeResolve) {
        const resolve = this.resumeResolve;
        this.resumeResolve = null;
        resolve();
      }
    }
  }

  /**
   * Cancel scanning and immediately stop pipeline propagation.
   */
  cancel() {
    this.isCancelled = true;
    this.resume(); // Ensure paused pipeline is woken up to exit
  }

  /**
   * Retry a single step in isolation.
   * @param {string} stepName
   * @returns {Promise<boolean>} True if retry succeeded.
   */
  async retry(stepName) {
    const step = this.steps.find((s) => s.name === stepName);
    if (!step) {
      throw new Error(`Pipeline step "${stepName}" not found.`);
    }

    // Filter out previous errors for this step
    this.session.errors = this.session.errors.filter((e) => e.module !== stepName);

    try {
      await step.run(this.session);
      if (this.eventBus) {
        this.eventBus.publish(`${step.name}_COMPLETE`, this.session);
      }
      return true;
    } catch (error) {
      this.session.addError(stepName, error);
      return false;
    }
  }

  /**
   * Map step names to Scan Session States.
   */
  updateSessionState(stepName) {
    const mapping = {
      "INITIALIZE": "IDLE",
      "DISCOVER_DOM": "DISCOVERING",
      "FILTER_DOM": "FILTERING",
      "BUILD_VISUAL_TREE": "SCANNING",
      "EXTRACT_STYLES": "SCANNING",
      "EXTRACT_TOKENS": "SCANNING",
      "SECTION_ANALYSIS": "ANALYZING",
      "COMPONENT_ANALYSIS": "ANALYZING",
      "LAYOUT_ANALYSIS": "ANALYZING",
      "TYPOGRAPHY_ANALYSIS": "ANALYZING",
      "COLOR_ANALYSIS": "ANALYZING",
      "SPACING_ANALYSIS": "ANALYZING",
      "ANIMATION_ANALYSIS": "ANALYZING",
      "TECHNOLOGY_ANALYSIS": "ANALYZING",
      "ACCESSIBILITY_ANALYSIS": "ANALYZING",
      "PERFORMANCE_ANALYSIS": "ANALYZING",
      "CLASSIFICATION": "CLASSIFYING",
      "CONFIDENCE": "CLASSIFYING",
      "PROMPT_GENERATION": "GENERATING_PROMPT",
      "REPORT_GENERATION": "FINALIZING",
      "STORE_RESULTS": "FINALIZING"
    };

    const state = mapping[stepName] || "SCANNING";
    this.session.updateStatus(state);
  }
}
