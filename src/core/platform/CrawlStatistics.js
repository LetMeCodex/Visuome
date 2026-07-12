/**
 * Statistics metrics mapped for crawl operations telemetry.
 * Contains no logical calculations or processing steps.
 */
export class CrawlStatistics {
  constructor(data = {}) {
    this.pagesDiscovered = data.pagesDiscovered || 0;
    this.pagesVisited = data.pagesVisited || 0;
    this.pagesSkipped = data.pagesSkipped || 0;
    this.pagesFailed = data.pagesFailed || 0;
    this.averageDepth = data.averageDepth || 0;
    this.maximumDepth = data.maximumDepth || 0;
    this.queueSize = data.queueSize || 0;
    this.discoveryRate = data.discoveryRate || 0;
    this.executionTime = data.executionTime || 0;
  }
}
