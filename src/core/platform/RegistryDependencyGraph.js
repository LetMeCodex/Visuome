/**
 * Maintains relationships between design registries.
 * Resolves dependency ordering and circular references.
 */
export class RegistryDependencyGraph {
  constructor() {
    this.nodes = new Set();
    this.adjacencyList = new Map();
  }

  addNode(node) {
    this.nodes.add(node);
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, new Set());
    }
  }

  addEdge(source, target) {
    this.addNode(source);
    this.addNode(target);
    this.adjacencyList.get(source).add(target);
  }

  /**
   * Resolve topological order of registries.
   * @returns {Array<string>} Mapped order array.
   */
  getTopologicalOrder() {
    const visited = new Set();
    const temp = new Set();
    const order = [];

    const visit = (node) => {
      if (temp.has(node)) {
        throw new Error(`RegistryDependencyGraph: Circular dependency detected at node "${node}".`);
      }
      if (!visited.has(node)) {
        temp.add(node);
        const neighbors = this.adjacencyList.get(node) || new Set();
        for (const neighbor of neighbors) {
          visit(neighbor);
        }
        temp.delete(node);
        visited.add(node);
        order.unshift(node);
      }
    };

    for (const node of this.nodes) {
      if (!visited.has(node)) {
        visit(node);
      }
    }

    return order.reverse();
  }
}
