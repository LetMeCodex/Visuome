import { eventBus } from "../EventBus.js";

/**
 * Stage module wrapping genome freezing operations.
 */
export class GenomeFreezeModule {
  initialize() {}

  async scan(session) {
    if (!session.scanResult || !session.scanResult.designGenome) {
      return {};
    }

    eventBus.publish("GENOME_FREEZE_STARTED", session);

    const genome = session.scanResult.designGenome;

    Object.freeze(genome.metadata);
    Object.freeze(genome.visualDNA);
    Object.freeze(genome.motionDNA);
    Object.freeze(genome.platformDNA);
    Object.freeze(genome.interactionDNA);
    Object.freeze(genome.layoutDNA);
    Object.freeze(genome.semanticDNA);
    Object.freeze(genome.designSystemDNA);
    Object.freeze(genome.knowledgeGraphDNA);
    Object.freeze(genome.confidence);
    Object.freeze(genome.statistics);
    Object.freeze(genome.fingerprint);
    Object.freeze(genome.diagnostics);
    Object.freeze(genome);

    eventBus.publish("GENOME_FREEZE_FINISHED", session);

    return { frozen: true };
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
