/**
 * Exporter for Markdown format.
 */
export class MarkdownExporter {
  static export(promptText) {
    return `# Visuome Design Prompt\n\n${promptText || ""}`;
  }
}
