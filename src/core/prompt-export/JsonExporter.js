/**
 * Exporter for JSON format.
 */
export class JsonExporter {
  static export(promptText) {
    return JSON.stringify({ prompt: promptText }, null, 2);
  }
}
