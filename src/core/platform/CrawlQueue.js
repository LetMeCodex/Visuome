/**
 * In-memory URL traversal queue supporting priority sorting, duplicates filtering, and depth caps.
 */
export class CrawlQueue {
  constructor(maxDepth = 3) {
    this.queue = [];
    this.visitedUrls = new Set();
    this.maxDepth = maxDepth;
  }

  /**
   * Enqueue a new page target.
   * @param {object} item { url, depth, priority, parentPage, discoveredFrom }
   * @returns {boolean} True if successfully added.
   */
  enqueue(item) {
    if (!item || !item.url) return false;
    if (item.depth > this.maxDepth) return false;
    
    let urlString;
    try {
      urlString = new URL(item.url).href;
    } catch {
      return false;
    }

    if (this.visitedUrls.has(urlString)) {
      return false;
    }

    if (this.queue.some(q => q.url === urlString)) {
      return false;
    }

    this.queue.push({
      url: urlString,
      depth: item.depth || 0,
      priority: item.priority || 0,
      parentPage: item.parentPage || null,
      discoveredFrom: item.discoveredFrom || null
    });

    this.queue.sort((a, b) => b.priority - a.priority);
    return true;
  }

  /**
   * Dequeue the next page target.
   * @returns {object|null}
   */
  dequeue() {
    if (this.queue.length === 0) return null;
    const item = this.queue.shift();
    this.visitedUrls.add(item.url);
    return item;
  }

  size() {
    return this.queue.length;
  }

  clear() {
    this.queue = [];
    this.visitedUrls.clear();
  }
}
