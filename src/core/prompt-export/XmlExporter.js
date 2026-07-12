/**
 * Exporter for XML format.
 */
export class XmlExporter {
  static export(promptText) {
    return `<prompt><![CDATA[\n${promptText || ""}\n]]></prompt>`;
  }
}
