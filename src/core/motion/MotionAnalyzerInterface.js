/**
 * Interface contract for all motion and interaction analyzers.
 */
export class MotionAnalyzerInterface {
  /**
   * Run motion analysis.
   * @param {object} scanResult Final ScanResult model context
   * @param {object} rules Declarative mapping rules
   * @param {object} cache Namespace cache reference
   * @returns {Promise<object>} Motion findings
   */
  async analyze(scanResult, rules, cache) {
    throw new Error("analyze() must be implemented.");
  }

  /**
   * Unique name of the motion analyzer.
   * @returns {string}
   */
  name() {
    throw new Error("name() must be implemented.");
  }

  /**
   * Version of the analyzer.
   * @returns {string}
   */
  version() {
    throw new Error("version() must be implemented.");
  }

  /**
   * Array of registry names this analyzer depends on.
   * @returns {Array<string>}
   */
  dependencies() {
    return [];
  }
}
