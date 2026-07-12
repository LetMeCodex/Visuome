/**
 * Interface contract for motion semantic and philosophy analyzers.
 */
export class MotionAnalyzerInterface {
  /**
   * Run semantic or philosophy analysis.
   * @param {object} inputRegistry Input database values context (MotionRegistry / MotionSemanticRegistry)
   * @param {object} cache Shared execution namespace cache reference
   * @returns {Promise<object>} calculated properties
   */
  async analyze(inputRegistry, cache) {
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
   * Registry dependencies.
   * @returns {Array<string>}
   */
  dependencies() {
    return [];
  }
}
