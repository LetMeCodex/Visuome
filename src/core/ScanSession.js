export class ScanSession {
  constructor(url) {
    this.scanId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    this.startTime = Date.now();
    this.url = url;
    this.status = "IDLE";
    this.duration = 0;
    this.errors = [];
    this.data = {}; // A container for incremental outputs from each pipeline stage
  }

  /**
   * Update the current status of the scan session.
   * @param {string} status The target state.
   */
  updateStatus(status) {
    const VALID_STATES = [
      "IDLE",
      "DISCOVERING",
      "FILTERING",
      "SCANNING",
      "ANALYZING",
      "CLASSIFYING",
      "GENERATING_PROMPT",
      "FINALIZING",
      "COMPLETED",
      "FAILED",
      "PARTIAL"
    ];
    if (VALID_STATES.includes(status)) {
      this.status = status;
    } else {
      console.warn(`Visuome ScanSession: Invalid status state "${status}"`);
    }
  }

  /**
   * Log an error within a specific module of the scan pipeline.
   * @param {string} moduleName Name of the module.
   * @param {Error|string} error The encountered error.
   */
  addError(moduleName, error) {
    this.errors.push({
      module: moduleName,
      message: error?.message || String(error),
      timestamp: Date.now()
    });
  }

  /**
   * Finalize the scan session duration and status.
   * @param {boolean} success True if the scan succeeded overall.
   */
  endSession(success = true) {
    this.duration = Date.now() - this.startTime;
    if (this.errors.length > 0) {
      this.status = success ? "PARTIAL" : "FAILED";
    } else {
      this.status = success ? "COMPLETED" : "FAILED";
    }
  }
}
