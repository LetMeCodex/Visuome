/**
 * Handles backup saving, loading, and deletion of crawl session telemetry from Local Storage.
 */
export class SessionPersistence {
  static KEY_PREFIX = "visuome.crawl.session.";

  /**
   * Save session data to local storage.
   * @param {string} sessionId
   * @param {object} sessionData
   */
  static save(sessionId, sessionData) {
    try {
      localStorage.setItem(`${this.KEY_PREFIX}${sessionId}`, JSON.stringify(sessionData));
      return true;
    } catch (e) {
      console.error("SessionPersistence [Error]: Failed to save crawl session.", e);
      return false;
    }
  }

  /**
   * Restore session data from local storage.
   * @param {string} sessionId
   * @returns {object|null}
   */
  static restore(sessionId) {
    try {
      const data = localStorage.getItem(`${this.KEY_PREFIX}${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("SessionPersistence [Error]: Failed to restore crawl session.", e);
      return null;
    }
  }

  /**
   * Clear session data.
   * @param {string} sessionId
   */
  static clear(sessionId) {
    try {
      localStorage.removeItem(`${this.KEY_PREFIX}${sessionId}`);
    } catch {}
  }
}
