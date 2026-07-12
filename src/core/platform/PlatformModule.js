import { WebsiteDiscoveryModule } from "./WebsiteDiscoveryModule.js";
import { NavigationDiscoveryModule } from "./NavigationDiscoveryModule.js";
import { PageClassificationModule } from "./PageClassificationModule.js";
import { RelationshipDiscoveryModule } from "./RelationshipDiscoveryModule.js";
import { TemplateDiscoveryModule } from "./TemplateDiscoveryModule.js";
import { DiscoveryRegistry } from "./DiscoveryRegistry.js";
import { PlatformRegistry } from "./PlatformRegistry.js";
import { WebsiteCrawler } from "./WebsiteCrawler.js";
import { ComponentGraphBuilder } from "./ComponentGraphBuilder.js";
import { AssetIntelligenceModule } from "./AssetIntelligenceModule.js";
import { RelationshipIntelligenceModule } from "./RelationshipIntelligenceModule.js";
import { PatternDetectionModule } from "./PatternDetectionModule.js";
import { DesignSystemDiscoveryModule } from "./DesignSystemDiscoveryModule.js";
import { KnowledgeGraphOptimizer } from "./KnowledgeGraphOptimizer.js";
import { WebsiteKnowledgeGraph } from "./WebsiteKnowledgeGraph.js";
import { eventBus } from "../EventBus.js";

export class PlatformModule {
  initialize() {}

  /**
   * Run the Platform Intelligence analysis stage.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} PlatformRegistry structured data.
   */
  async scan(session) {
    if (!session.scanResult) {
      console.warn("PlatformModule: No scanResult found in session. Skipping platform analysis.");
      return {};
    }

    const startMs = performance.now();

    // 1. WebsiteDiscovery
    eventBus.publish("WEBSITE_DISCOVERY_STARTED", session);
    const webDiscovery = new WebsiteDiscoveryModule();
    webDiscovery.initialize();
    const websiteData = await webDiscovery.scan(session);
    session.data.WebsiteDiscovery = websiteData;
    eventBus.publish("WEBSITE_DISCOVERY_FINISHED", session);

    // 2. NavigationDiscovery
    eventBus.publish("NAVIGATION_DISCOVERY_STARTED", session);
    const navDiscovery = new NavigationDiscoveryModule();
    navDiscovery.initialize();
    const navData = await navDiscovery.scan(session);
    session.data.NavigationDiscovery = navData;

    // 3. PageClassification
    eventBus.publish("PAGE_CLASSIFICATION_STARTED", session);
    const classification = new PageClassificationModule();
    classification.initialize();
    const classificationData = await classification.scan(session);
    session.data.PageClassification = classificationData;

    // 4. RelationshipDiscovery
    eventBus.publish("RELATIONSHIP_DISCOVERY_STARTED", session);
    const relationship = new RelationshipDiscoveryModule();
    relationship.initialize();
    const relationshipData = await relationship.scan(session);
    session.data.RelationshipDiscovery = relationshipData;

    // 5. TemplateDiscovery
    eventBus.publish("TEMPLATE_DISCOVERY_STARTED", session);
    const template = new TemplateDiscoveryModule();
    template.initialize();
    const templateData = await template.scan(session);
    session.data.TemplateDiscovery = templateData;

    // 5.5 Crawl session execution
    const crawler = new WebsiteCrawler(100, 3);
    const crawlSession = await crawler.crawl(websiteData.currentUrl);

    // 5.6 Component Graph Builder
    eventBus.publish("COMPONENT_GRAPH_STARTED", session);
    const compBuilder = new ComponentGraphBuilder();
    compBuilder.initialize();
    const compData = await compBuilder.scan(session);
    session.data.ComponentGraphBuilder = compData;
    eventBus.publish("COMPONENT_GRAPH_FINISHED", session);

    // 5.7 Asset Intelligence
    eventBus.publish("ASSET_DISCOVERY_STARTED", session);
    const assetIntel = new AssetIntelligenceModule();
    assetIntel.initialize();
    const assetData = await assetIntel.scan(session);
    session.data.AssetIntelligence = assetData;
    eventBus.publish("ASSET_DISCOVERY_FINISHED", session);

    // 5.8 Relationship Intelligence
    eventBus.publish("RELATIONSHIP_INTELLIGENCE_STARTED", session);
    const relIntel = new RelationshipIntelligenceModule();
    relIntel.initialize();
    const relIntelData = await relIntel.scan(session);
    session.data.RelationshipIntelligence = relIntelData;
    eventBus.publish("RELATIONSHIP_INTELLIGENCE_FINISHED", session);

    // 5.9 Pattern Detection
    eventBus.publish("PATTERN_DETECTION_STARTED", session);
    const patternDetect = new PatternDetectionModule();
    patternDetect.initialize();
    const patternData = await patternDetect.scan(session);
    session.data.PatternDetection = patternData;
    eventBus.publish("PATTERN_DETECTION_FINISHED", session);

    // 5.10 Design System Discovery
    eventBus.publish("DESIGN_SYSTEM_DISCOVERY_STARTED", session);
    const designSys = new DesignSystemDiscoveryModule();
    designSys.initialize();
    const designSysData = await designSys.scan(session);
    session.data.DesignSystemDiscovery = designSysData;
    eventBus.publish("DESIGN_SYSTEM_DISCOVERY_FINISHED", session);

    // 5.11 Knowledge Graph Optimizer
    eventBus.publish("GRAPH_OPTIMIZATION_STARTED", session);
    const optimizer = new KnowledgeGraphOptimizer();
    optimizer.initialize();
    const optimizerReport = await optimizer.scan(session);
    session.data.KnowledgeGraphOptimizer = optimizerReport;
    eventBus.publish("GRAPH_OPTIMIZATION_FINISHED", session);

    // 6. Merge Registry
    const discoveryRegistry = new DiscoveryRegistry({
      pages: [{
        url: websiteData.currentUrl,
        title: document.title,
        type: classificationData,
        children: websiteData.internalLinks.map(l => l.url),
        relationships: relationshipData.map(r => r.relationshipType),
        confidence: { score: 100, factors: [] }
      }],
      templates: [templateData],
      relationships: relationshipData,
      navigation: navData,
      diagnostics: {
        crawledCount: crawlSession.visitedPages.length,
        depthReached: crawlSession.statistics.maximumDepth,
        skippedCount: crawlSession.statistics.pagesSkipped,
        executionTimeMs: Math.round(performance.now() - startMs)
      }
    });

    const knowledgeGraph = new WebsiteKnowledgeGraph({
      websiteNode: {
        domain: new URL(websiteData.currentUrl).hostname,
        crawledAt: new Date().toISOString()
      },
      pages: discoveryRegistry.pages,
      components: compData,
      relationships: relationshipData,
      assets: assetData,
      templates: [templateData],
      patterns: patternData,
      designSystem: designSysData
    });

    const registry = new PlatformRegistry({
      websiteMetadata: {
        domain: new URL(websiteData.currentUrl).hostname,
        crawledAt: new Date().toISOString(),
        totalPagesFound: websiteData.internalLinks.length
      },
      pageRegistry: discoveryRegistry.pages,
      relationshipRegistry: discoveryRegistry.relationships,
      crawlDiagnostics: {
        pagesAttempted: crawlSession.visitedPages.length + crawlSession.failedPages.length,
        pagesSucceeded: crawlSession.visitedPages.length,
        pagesFailed: crawlSession.failedPages.length,
        errors: []
      },
      confidence: {
        score: 95,
        explanation: "Website structure discovered successfully.",
        factors: []
      },
      crawlSession: crawlSession,
      crawlStatistics: crawlSession.statistics,
      pageMetadata: crawlSession.visitedPages,
      knowledgeGraph: knowledgeGraph,
      componentGraph: compData,
      assetGraph: assetData,
      relationshipGraph: relIntelData,
      templateRegistry: [templateData],
      patternRegistry: patternData,
      designSystemRegistry: designSysData,
      graphStatistics: optimizerReport,
      diagnostics: {
        executionTimeMs: Math.round(performance.now() - startMs),
        analyzersRun: [
          "WebsiteDiscoveryModule",
          "NavigationDiscoveryModule",
          "PageClassificationModule",
          "RelationshipDiscoveryModule",
          "TemplateDiscoveryModule",
          "WebsiteCrawler",
          "ComponentGraphBuilder",
          "AssetIntelligenceModule",
          "RelationshipIntelligenceModule",
          "PatternDetectionModule",
          "DesignSystemDiscoveryModule",
          "KnowledgeGraphOptimizer"
        ]
      }
    });

    session.scanResult.platformRegistry = registry;
    session.data.discoveryRegistry = discoveryRegistry;

    return registry;
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
