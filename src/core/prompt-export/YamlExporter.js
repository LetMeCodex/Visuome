/**
 * Exporter for YAML format.
 */
export class YamlExporter {
  static export(promptText) {
    return `prompt: "${(promptText || "").replace(/"/g, '\\"')}"`;
  }
}
