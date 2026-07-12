import { GenomeBuilder } from "./GenomeBuilder.js";
import { GenomeSerializer } from "./GenomeSerializer.js";
import { eventBus } from "../EventBus.js";

/**
 * Pipeline stage module responsible for Design Genome building.
 */
export class GenomeModule {
  initialize() {
    this.builder = new GenomeBuilder();
  }

  /**
   * Run the Design Genome construction pipeline.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} GenomeRegistry instance.
   */
  async scan(session) {
    if (!session.scanResult) {
      console.warn("GenomeModule: No scanResult found in session. Skipping.");
      return {};
    }

    eventBus.publish("GENOME_BUILDING", session);
    const genome = await this.builder.build(session.scanResult);

    eventBus.publish("GENOME_SERIALIZING", session);
    GenomeSerializer.serialize(genome);

    session.scanResult.designGenome = genome;

    return genome;
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
