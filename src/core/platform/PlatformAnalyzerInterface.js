/**
 * Base contract for Platform Intelligence Analyzers.
 */
export class PlatformAnalyzerInterface {
  /**
   * Run platform analysis.
   * @param {object} scanResult Context scan result.
   * @param {object} cache Execution cache namespace.
   * @returns {Promise<object>} Results.
   */
  async analyze(scanResult, cache) {
    throw new Error("analyze() must be implemented.");
  }

  /**
   * Name of the analyzer.
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
   * Registry dependencies.
   * @returns {Array<string>}
   */
  dependencies() {
    return [];
  }
}
