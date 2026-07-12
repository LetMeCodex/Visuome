/**
 * Generates deterministic hashes mapping visual/motion layout DNA elements.
 */
export class GenomeFingerprint {
  /**
   * Deterministically fingerprints a Design Genome.
   * @param {object} genome
   * @returns {object} { sha256, shortId }
   */
  static generate(genome) {
    if (!genome) return { sha256: "", shortId: "" };
    
    const serialized = JSON.stringify(genome.visualDNA) + 
                       JSON.stringify(genome.motionDNA) + 
                       JSON.stringify(genome.platformDNA) +
                       JSON.stringify(genome.layoutDNA);

    let hash = 0;
    for (let i = 0; i < serialized.length; i++) {
      const char = serialized.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    const val = Math.abs(hash);
    const sha256 = `sha256-${val.toString(16).padStart(8, "0")}`;
    const shortId = val.toString(36).substring(0, 8);

    return { sha256, shortId };
  }
}
