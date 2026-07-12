export class ModuleRegistry {
  constructor() {
    this.modules = new Map();
  }

  /**
   * Register a module and validate its compliance with the Module Contract.
   * @param {string} name Unique name of the module.
   * @param {object} moduleInstance Instance of the module.
   */
  register(name, moduleInstance) {
    if (this.modules.has(name)) {
      throw new Error(`Module with name "${name}" is already registered.`);
    }

    // Validate Module Contract compliance
    const requiredMethods = ["initialize", "scan", "validate", "cleanup", "destroy"];
    for (const method of requiredMethods) {
      if (typeof moduleInstance[method] !== "function") {
        throw new Error(`Module "${name}" is missing the required "${method}" method.`);
      }
    }

    this.modules.set(name, moduleInstance);
  }

  /**
   * Unregister a module and invoke its destroy hook.
   * @param {string} name Name of the module.
   */
  unregister(name) {
    const instance = this.modules.get(name);
    if (instance) {
      try {
        instance.destroy();
      } catch (error) {
        console.warn(`Visuome ModuleRegistry: Error destroying module "${name}":`, error);
      }
      this.modules.delete(name);
    }
  }

  /**
   * Retrieve a registered module by name.
   * @param {string} name Name of the module.
   * @returns {object|undefined} The module instance.
   */
  get(name) {
    return this.modules.get(name);
  }

  /**
   * Get all registered modules.
   * @returns {Array<{name: string, instance: object}>}
   */
  getAll() {
    return Array.from(this.modules.entries()).map(([name, instance]) => ({
      name,
      instance
    }));
  }

  /**
   * Clear all modules and call their destroy hooks.
   */
  clear() {
    for (const name of this.modules.keys()) {
      this.unregister(name);
    }
  }
}

export const moduleRegistry = new ModuleRegistry();
