import { CrawlQueue } from "./CrawlQueue.js";
import { CrawlStatistics } from "./CrawlStatistics.js";
import { WebsiteKnowledgeGraph } from "./WebsiteKnowledgeGraph.js";

/**
 * State container for an active crawler crawl session.
 * Contains no logical calculations or processing steps.
 */
export class CrawlSession {
  constructor(data = {}) {
    this.sessionId = data.sessionId || `session-${Math.random().toString(36).slice(2, 11)}`;
    this.startedAt = data.startedAt || new Date().toISOString();
    this.finishedAt = data.finishedAt || null;
    this.status = data.status || "IDLE"; // IDLE, RUNNING, PAUSED, COMPLETED, ABORTED
    this.queue = data.queue || new CrawlQueue();
    this.visitedPages = data.visitedPages || [];
    this.failedPages = data.failedPages || [];
    this.pendingPages = data.pendingPages || [];
    this.graph = data.graph || new WebsiteKnowledgeGraph();
    this.statistics = data.statistics || new CrawlStatistics();
  }
}
