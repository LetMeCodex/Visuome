/**
 * Interface contract for all visual language analyzers.
 */
export class VisualLanguageAnalyzerInterface {
  /**
   * Run visual analysis on a ScanResult.
   * @param {object} scanResult
   * @param {object} rules Declarative rules from VisualLanguageRules
   * @param {object} cache Memory cache reference
   * @returns {Promise<object>} Part of the registry output
   */
  async analyze(scanResult, rules, cache) {
    throw new Error("analyze() must be implemented.");
  }

  /**
   * Unique name of the analyzer.
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
   * Array of stage names or registries this analyzer depends on.
   * @returns {Array<string>}
   */
  dependencies() {
    return [];
  }
}
