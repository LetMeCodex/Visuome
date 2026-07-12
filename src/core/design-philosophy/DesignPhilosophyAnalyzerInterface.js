/**
 * Interface contract for all design philosophy analyzers.
 */
export class DesignPhilosophyAnalyzerInterface {
  /**
   * Run philosophy analysis.
   * @param {object} scanResult Final ScanResult model context
   * @param {object} semanticRegistry Registry computed in previous stage
   * @param {object} rules Declarative semantic mapping rules
   * @param {object} cache Namespace cache reference
   * @returns {Promise<object>} Design philosophy findings
   */
  async analyze(scanResult, semanticRegistry, rules, cache) {
    throw new Error("analyze() must be implemented.");
  }

  /**
   * Unique name of the philosophy analyzer.
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
