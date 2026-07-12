/**
 * Interface contract for all semantic analyzers.
 */
export class SemanticAnalyzerInterface {
  /**
   * Run semantic analysis.
   * @param {object} scanResult Final ScanResult model context
   * @param {object} visualLanguageRegistry Registry computed in previous stage
   * @param {object} rules Declarative semantic mapping rules
   * @param {object} cache Namespace cache reference
   * @returns {Promise<object>} Semantic characteristic records
   */
  async analyze(scanResult, visualLanguageRegistry, rules, cache) {
    throw new Error("analyze() must be implemented.");
  }

  /**
   * Unique name of the semantic analyzer.
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
