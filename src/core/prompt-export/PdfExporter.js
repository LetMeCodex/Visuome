/**
 * Mock exporter for PDF binary content representation.
 */
export class PdfExporter {
  static export(promptText) {
    return {
      type: "application/pdf",
      size: (promptText || "").length,
      binaryMock: true
    };
  }
}
