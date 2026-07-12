import { GenomeValidator } from "./GenomeValidator.js";
import { eventBus } from "../EventBus.js";

/**
 * Stage module wrapping genome validation checks.
 */
export class GenomeValidateModule {
  initialize() {}

  async scan(session) {
    if (!session.scanResult || !session.scanResult.designGenome) {
      return {};
    }

    eventBus.publish("GENOME_VALIDATING", session);

    const validation = GenomeValidator.validate(session.scanResult.designGenome);
    if (!validation.valid) {
      throw new Error(`Genome validation failed: ${validation.errors.join(", ")}`);
    }

    return validation;
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
