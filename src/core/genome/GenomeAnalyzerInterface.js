/**
 * Base contract for Design Genome DNA extraction analyzers.
 */
export class GenomeAnalyzerInterface {
  /**
   * Run DNA segment extraction.
   * @param {object} scanResult Context scan result.
   * @returns {Promise<object>} Extracted DNA structures.
   */
  async extract(scanResult) {
    throw new Error("extract() must be implemented.");
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
