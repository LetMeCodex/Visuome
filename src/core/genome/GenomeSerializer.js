/**
 * Static serializer helper outputting sorted key compact or pretty string JSONs.
 */
export class GenomeSerializer {
  /**
   * Serializes a genome payload with stable keys ordering.
   * @param {object} genome
   * @param {boolean} pretty
   * @returns {string}
   */
  static serialize(genome, pretty = false) {
    if (!genome) return "";

    const stableObj = this.sortKeys(genome);
    return pretty ? JSON.stringify(stableObj, null, 2) : JSON.stringify(stableObj);
  }

  /**
   * Sort keys of an object recursively.
   */
  static sortKeys(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortKeys(item));
    }
    const sortedKeys = Object.keys(obj).sort();
    const result = {};
    for (const key of sortedKeys) {
      result[key] = this.sortKeys(obj[key]);
    }
    return result;
  }
}
