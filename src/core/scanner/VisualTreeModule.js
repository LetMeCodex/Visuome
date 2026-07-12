import { VisualTree } from "./VisualTree.js";

export class VisualTreeModule {
  initialize() {
    this.tree = null;
  }

  /**
   * Build the visual tree and bind to session.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object|null>} The root visual tree node.
   */
  async scan(session) {
    const root = document.body || document.documentElement;
    this.tree = VisualTree.build(root);
    session.data.visualTree = this.tree;
    return this.tree;
  }

  /**
   * Validate that a visual tree structure is present.
   */
  validate(data) {
    return data !== null && typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
