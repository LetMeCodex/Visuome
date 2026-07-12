/**
 * Structural check validator for ExportRegistry objects.
 */
export class ExportValidator {
  /**
   * Validates export configurations.
   * @param {object} registry
   * @returns {object} { valid, errors, warnings }
   */
  static validate(registry) {
    const errors = [];
    const warnings = [];

    if (!registry) {
      return { valid: false, errors: ["Export registry is null."], warnings: [] };
    }

    if (!registry.metadata) {
      errors.push("Missing core metadata.");
    } else {
      if (!registry.metadata.exportId) errors.push("Missing metadata exportId.");
      if (!registry.metadata.checksum) errors.push("Missing checksum identifier.");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
