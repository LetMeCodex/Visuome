/**
 * Base abstract interface representing rendering configurations for specific prompt profile outputs.
 */
export class PromptProfileInterface {
  /**
   * Render design DNA elements to prompt strings.
   * @param {object} genome DesignGenome master object.
   * @param {string} format output formatting (markdown, text, json, xml, yaml)
   * @returns {string|object} Mapped prompt structure or payload content.
   */
  render(genome, format = "markdown") {
    throw new Error("render() must be implemented.");
  }

  name() {
    throw new Error("name() must be implemented.");
  }
}
