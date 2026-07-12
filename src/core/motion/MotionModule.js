import { MotionEngine } from "./MotionEngine.js";
import { eventBus } from "../EventBus.js";
import { AnimationDiscoveryModule } from "./AnimationDiscoveryModule.js";
import { TransitionDiscoveryModule } from "./TransitionDiscoveryModule.js";
import { ScrollDiscoveryModule } from "./ScrollDiscoveryModule.js";
import { TimelineDiscoveryModule } from "./TimelineDiscoveryModule.js";
import { InteractionDiscoveryModule } from "./InteractionDiscoveryModule.js";
import { MotionMetricsModule } from "./MotionMetricsModule.js";
import { TriggerDetectionModule } from "./TriggerDetectionModule.js";
import { ReplayMetadataModule } from "./ReplayMetadataModule.js";
import { TechnologyDetectionModule } from "./TechnologyDetectionModule.js";

// Import Motion Intelligence Stage Orchestrators
import { MotionSemanticEngine } from "../motion-intelligence/MotionSemanticEngine.js";
import { MotionPhilosophyEngine } from "../motion-intelligence/MotionPhilosophyEngine.js";

// Import Semantics Analyzers
import { MotionCharacteristicsAnalyzer } from "../motion-intelligence/MotionCharacteristicsAnalyzer.js";
import { InteractionCharacteristicsAnalyzer } from "../motion-intelligence/InteractionCharacteristicsAnalyzer.js";
import { TimelineCharacteristicsAnalyzer } from "../motion-intelligence/TimelineCharacteristicsAnalyzer.js";
import { TechnologyCharacteristicsAnalyzer } from "../motion-intelligence/TechnologyCharacteristicsAnalyzer.js";

// Import Philosophy Analyzers
import { MotionPhilosophyAnalyzer } from "../motion-intelligence/MotionPhilosophyAnalyzer.js";
import { InteractionPhilosophyAnalyzer } from "../motion-intelligence/InteractionPhilosophyAnalyzer.js";
import { CognitiveMotionAnalyzer } from "../motion-intelligence/CognitiveMotionAnalyzer.js";

export class MotionModule {
  constructor() {
    this.caches = {
      metrics: new Map(),
      triggers: new Map(),
      replay: new Map(),
      technology: new Map()
    };
  }

  initialize() {
    this.engine = new MotionEngine();
    this.animationDiscovery = new AnimationDiscoveryModule();
    this.transitionDiscovery = new TransitionDiscoveryModule();
    this.scrollDiscovery = new ScrollDiscoveryModule();
    this.timelineDiscovery = new TimelineDiscoveryModule();
    this.interactionDiscovery = new InteractionDiscoveryModule();
    this.motionMetrics = new MotionMetricsModule();
    this.triggerDetection = new TriggerDetectionModule();
    this.replayMetadata = new ReplayMetadataModule();
    this.technologyDetection = new TechnologyDetectionModule();

    // Initialize Semantics Orchestration Engine
    this.semanticEngine = new MotionSemanticEngine();
    this.semanticEngine.register(new MotionCharacteristicsAnalyzer());
    this.semanticEngine.register(new InteractionCharacteristicsAnalyzer());
    this.semanticEngine.register(new TimelineCharacteristicsAnalyzer());
    this.semanticEngine.register(new TechnologyCharacteristicsAnalyzer());

    // Initialize Philosophy Orchestration Engine
    this.philosophyEngine = new MotionPhilosophyEngine();
    this.philosophyEngine.register(new MotionPhilosophyAnalyzer());
    this.philosophyEngine.register(new InteractionPhilosophyAnalyzer());
    this.philosophyEngine.register(new CognitiveMotionAnalyzer());
  }

  /**
   * Run the Motion Intelligence analysis stages.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} MotionRegistry structured data.
   */
  async scan(session) {
    if (!session.scanResult) {
      console.warn("MotionModule: No scanResult found in session. Skipping motion analysis.");
      return {};
    }

    const scanId = session.scanResult.metadata?.scanId;

    const elements = (session.data.domElements && session.data.domElements.size > 0)
      ? Array.from(session.data.domElements.values())
      : Array.from(document.querySelectorAll("*"));

    const styleCache = new Map();
    const getStyles = (element) => {
      if (!styleCache.has(element)) {
        let style = null;
        try {
          style = window.getComputedStyle(element);
        } catch {}
        styleCache.set(element, style || { getPropertyValue: () => "" });
      }
      return styleCache.get(element);
    };

    eventBus.publish("ANIMATION_DISCOVERY_STARTED", session);
    const animationRegistry = await this.animationDiscovery.scan(elements, getStyles);
    eventBus.publish("ANIMATION_DISCOVERY_FINISHED", session);

    eventBus.publish("TRANSITION_DISCOVERY_STARTED", session);
    const transitionRegistry = await this.transitionDiscovery.scan(elements, getStyles);

    eventBus.publish("SCROLL_DISCOVERY_STARTED", session);
    const scrollRegistry = await this.scrollDiscovery.scan(elements, getStyles);

    eventBus.publish("TIMELINE_DISCOVERY_STARTED", session);
    const timelineRegistry = await this.timelineDiscovery.scan(elements, getStyles);

    eventBus.publish("INTERACTION_DISCOVERY_STARTED", session);
    const interactionRegistry = await this.interactionDiscovery.scan(elements, getStyles);

    eventBus.publish("MOTION_METRICS_STARTED", session);
    let metricsOut = {};
    if (scanId && this.caches.metrics.has(scanId)) {
      console.debug("MotionMetrics [Cache Hit]: Reusing cached values.");
      metricsOut = this.caches.metrics.get(scanId);
    } else {
      metricsOut = await this.motionMetrics.calculate(animationRegistry, transitionRegistry, scrollRegistry, timelineRegistry, interactionRegistry);
      if (scanId) this.caches.metrics.set(scanId, metricsOut);
    }
    eventBus.publish("MOTION_METRICS_FINISHED", session);

    eventBus.publish("TRIGGER_DETECTION_STARTED", session);
    let triggersOut = {};
    if (scanId && this.caches.triggers.has(scanId)) {
      console.debug("TriggerDetection [Cache Hit]: Reusing cached values.");
      triggersOut = this.caches.triggers.get(scanId);
    } else {
      triggersOut = await this.triggerDetection.detect(animationRegistry, transitionRegistry, scrollRegistry, interactionRegistry);
      if (scanId) this.caches.triggers.set(scanId, triggersOut);
    }
    eventBus.publish("TRIGGER_DETECTION_FINISHED", session);

    eventBus.publish("REPLAY_METADATA_STARTED", session);
    let replayOut = {};
    if (scanId && this.caches.replay.has(scanId)) {
      console.debug("Replay [Cache Hit]: Reusing cached values.");
      replayOut = this.caches.replay.get(scanId);
    } else {
      replayOut = await this.replayMetadata.generate(animationRegistry, transitionRegistry);
      if (scanId) this.caches.replay.set(scanId, replayOut);
    }
    eventBus.publish("REPLAY_METADATA_FINISHED", session);

    eventBus.publish("TECHNOLOGY_DETECTION_STARTED", session);
    let techOut = {};
    if (scanId && this.caches.technology.has(scanId)) {
      console.debug("Technology [Cache Hit]: Reusing cached values.");
      techOut = this.caches.technology.get(scanId);
    } else {
      techOut = await this.technologyDetection.detect(elements, animationRegistry);
      if (scanId) this.caches.technology.set(scanId, techOut);
    }
    eventBus.publish("TECHNOLOGY_DETECTION_FINISHED", session);

    const rawRegistry = await this.engine.process(session.scanResult);
    
    const motionRegistry = {
      ...rawRegistry,
      animationRegistry,
      transitionRegistry,
      scrollRegistry,
      timelineRegistry,
      interactionRegistry,
      ...metricsOut,
      ...triggersOut,
      ...replayOut,
      ...techOut,
      diagnostics: {
        ...rawRegistry.diagnostics,
        totalElementsProcessed: elements.length,
        styleCacheHits: styleCache.size
      }
    };

    Object.freeze(motionRegistry);
    Object.freeze(motionRegistry.animationRegistry);
    Object.freeze(motionRegistry.interactionRegistry);
    Object.freeze(motionRegistry.scrollRegistry);
    Object.freeze(motionRegistry.transitionRegistry);
    Object.freeze(motionRegistry.timelineRegistry);
    Object.freeze(motionRegistry.metrics);
    Object.freeze(motionRegistry.triggerRegistry);
    Object.freeze(motionRegistry.replayMetadata);
    Object.freeze(motionRegistry.technologyRegistry);

    session.scanResult.motionRegistry = motionRegistry;

    // 10. Motion Semantics Stage
    eventBus.publish("MOTION_SEMANTICS_STARTED", session);
    const semanticRegistry = await this.semanticEngine.process(motionRegistry);
    session.scanResult.motionSemanticRegistry = semanticRegistry;
    eventBus.publish("MOTION_SEMANTICS_FINISHED", session);

    // 11. Motion Philosophy Stage
    eventBus.publish("MOTION_PHILOSOPHY_STARTED", session);
    const philosophyRegistry = await this.philosophyEngine.process(semanticRegistry);
    session.scanResult.motionPhilosophyRegistry = philosophyRegistry;
    eventBus.publish("MOTION_PHILOSOPHY_FINISHED", session);

    return motionRegistry;
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
