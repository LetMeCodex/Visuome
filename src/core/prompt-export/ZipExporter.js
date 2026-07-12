/**
 * Mock exporter for ZIP compressed binary representation.
 */
export class ZipExporter {
  static export(promptText) {
    return {
      type: "application/zip",
      size: (promptText || "").length,
      binaryMock: true
    };
  }
}
