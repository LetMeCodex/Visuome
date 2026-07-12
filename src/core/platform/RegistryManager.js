/**
 * Central infrastructure lifecycle manager for all registries in the scanning pipeline.
 * Performs no data analysis.
 */
export class RegistryManager {
  constructor() {
    this.registries = new Map();
    this.dependencies = new Map();
    this.versions = new Map();
  }

  /**
   * Register a registry instance.
   * @param {string} name
   * @param {object} instance
   * @param {string} version
   * @param {Array<string>} deps
   */
  register(name, instance, version = "1.0.0", deps = []) {
    if (this.registries.has(name)) {
      throw new Error(`RegistryManager [Error]: Registry "${name}" already registered (Duplicate detected).`);
    }
    this.registries.set(name, instance);
    this.versions.set(name, version);
    this.dependencies.set(name, deps);
  }

  /**
   * Look up a registered registry.
   * @param {string} name
   * @returns {object}
   */
  lookup(name) {
    if (!this.registries.has(name)) {
      throw new Error(`RegistryManager [Error]: Registry "${name}" not found.`);
    }
    return this.registries.get(name);
  }

  /**
   * Validate registry dependencies.
   * @returns {boolean}
   */
  validateDependencies() {
    for (const [name, deps] of this.dependencies.entries()) {
      for (const dep of deps) {
        if (!this.registries.has(dep)) {
          throw new Error(`RegistryManager [Dependency Error]: Registry "${name}" requires missing registry "${dep}".`);
        }
      }
    }
    return true;
  }

  /**
   * Freeze registry structures.
   */
  freezeAll() {
    for (const [name, instance] of this.registries.entries()) {
      Object.freeze(instance);
      console.debug(`RegistryManager [Freeze]: Registry "${name}" frozen.`);
    }
  }

  /**
   * Check registry health.
   * @returns {object}
   */
  getHealth() {
    return {
      healthy: this.registries.size > 0,
      totalRegistries: this.registries.size,
      details: Array.from(this.registries.keys()).map(name => ({
        name,
        version: this.versions.get(name) || "1.0.0",
        dependenciesCount: this.dependencies.get(name)?.length || 0
      }))
    };
  }

  /**
   * Serialization helper.
   * @param {string} name
   * @returns {string}
   */
  serialize(name) {
    const registry = this.lookup(name);
    return JSON.stringify(registry);
  }

  /**
   * Memory cleanup.
   */
  cleanup() {
    this.registries.clear();
    this.dependencies.clear();
    this.versions.clear();
  }
}
