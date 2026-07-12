/**
 * Placeholder registry container for captured site assets.
 * Contains no logical calculations.
 */
export class AssetRegistry {
  constructor(data = {}) {
    this.images = data.images || [];
    this.videos = data.videos || [];
    this.icons = data.icons || [];
    this.fonts = data.fonts || [];
    this.svg = data.svg || [];
    this.canvas = data.canvas || [];
    this.webgl = data.webgl || [];
  }
}
