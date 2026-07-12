export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event.
   * @param {string} event Name of the event.
   * @param {function} callback Callback function.
   * @returns {function} Unsubscribe function.
   */
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.unsubscribe(event, callback);
  }

  /**
   * Unsubscribe from an event.
   * @param {string} event Name of the event.
   * @param {function} callback Callback function.
   */
  unsubscribe(event, callback) {
    const list = this.listeners.get(event);
    if (list) {
      list.delete(callback);
      if (list.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Publish an event.
   * @param {string} event Name of the event.
   * @param {any} data Payload data.
   */
  publish(event, data) {
    const list = this.listeners.get(event);
    if (list) {
      for (const callback of list) {
        try {
          callback(data);
        } catch (error) {
          console.error(`Visuome EventBus error for event "${event}":`, error);
        }
      }
    }
  }

  /**
   * Clear all subscribers.
   */
  clear() {
    this.listeners.clear();
  }
}

export const eventBus = new EventBus();
