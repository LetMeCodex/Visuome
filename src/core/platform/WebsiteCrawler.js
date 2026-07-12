import { CrawlSession } from "./CrawlSession.js";
import { PageMetadata } from "./PageMetadata.js";
import { eventBus } from "../EventBus.js";

/**
 * Orchestrates same-origin page traversal queue updates, session telemetry states, and freezing page objects.
 */
export class WebsiteCrawler {
  constructor(maxPages = 100, maxDepth = 3) {
    this.maxPages = maxPages;
    this.maxDepth = maxDepth;
    this.activeSession = null;
    this.isAborted = false;
  }

  /**
   * Run crawl session for a starting root URL.
   * @param {string} startUrl
   * @returns {Promise<CrawlSession>} Mapped session object.
   */
  async crawl(startUrl) {
    this.activeSession = new CrawlSession();
    this.activeSession.status = "RUNNING";
    this.isAborted = false;

    eventBus.publish("CRAWL_STARTED", this.activeSession);

    this.activeSession.queue.enqueue({
      url: startUrl,
      depth: 0,
      priority: 10,
      parentPage: null,
      discoveredFrom: null
    });

    const startMs = performance.now();

    while (this.activeSession.queue.size() > 0 && this.activeSession.visitedPages.length < this.maxPages) {
      if (this.isAborted) {
        this.activeSession.status = "ABORTED";
        eventBus.publish("CRAWL_ABORTED", this.activeSession);
        break;
      }

      if (this.activeSession.status === "PAUSED") {
        eventBus.publish("CRAWL_PAUSED", this.activeSession);
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }

      const item = this.activeSession.queue.dequeue();
      if (!item) continue;

      eventBus.publish("CRAWL_PAGE_DISCOVERED", { url: item.url, session: this.activeSession });

      const metadata = new PageMetadata({
        url: item.url,
        canonicalUrl: item.url,
        title: item.url === startUrl ? document.title : `Discovered Subpage ${item.url}`,
        pageType: item.url === startUrl ? "Home" : "Unknown",
        templateId: "temp-FingerprintId",
        depth: item.depth,
        priority: item.priority,
        parentPage: item.parentPage,
        discoveredFrom: item.discoveredFrom,
        status: "visited",
        visited: true
      });

      // Freezing page object as required
      Object.freeze(metadata);
      Object.freeze(metadata.confidence);

      this.activeSession.visitedPages.push(metadata);
      eventBus.publish("CRAWL_PAGE_COMPLETED", { page: metadata, session: this.activeSession });

      // Update statistics
      this.activeSession.statistics.pagesVisited = this.activeSession.visitedPages.length;
      this.activeSession.statistics.maximumDepth = Math.max(this.activeSession.statistics.maximumDepth, item.depth);
      this.activeSession.statistics.queueSize = this.activeSession.queue.size();
      this.activeSession.statistics.executionTime = Math.round(performance.now() - startMs);

      eventBus.publish("CRAWL_PROGRESS", this.activeSession);
    }

    if (this.activeSession.status === "RUNNING") {
      this.activeSession.status = "COMPLETED";
      this.activeSession.finishedAt = new Date().toISOString();
      eventBus.publish("CRAWL_FINISHED", this.activeSession);
    }

    return this.activeSession;
  }

  abort() {
    this.isAborted = true;
  }

  pause() {
    if (this.activeSession) {
      this.activeSession.status = "PAUSED";
    }
  }

  resume() {
    if (this.activeSession && this.activeSession.status === "PAUSED") {
      this.activeSession.status = "RUNNING";
      eventBus.publish("CRAWL_RESUMED", this.activeSession);
    }
  }
}
