import { TechnologyRegistry } from "./TechnologyRegistry.js";

export class TechnologyDetectionModule {
  name() { return "TechnologyDetectionModule"; }
  version() { return "1.0.0"; }
  dependencies() { return []; }

  /**
   * Scans document elements to detect libraries based on styling cues and DOM signatures.
   * @param {Array<HTMLElement>} elements
   * @param {object} animationRegistry
   * @returns {Promise<object>} TechnologyRegistry observations
   */
  async detect(elements = [], animationRegistry) {
    const startTime = performance.now();
    const detectedTechnologies = [];
    const supportingEvidence = [];
    const versionHints = {};

    let checkedSelectorsCount = 0;

    const hasAos = elements.some(el => {
      checkedSelectorsCount++;
      return el.hasAttribute && el.hasAttribute("data-aos");
    });
    if (hasAos) {
      detectedTechnologies.push("AOS");
      supportingEvidence.push("DOM contains elements with 'data-aos' trigger attributes.");
    }

    const hasSr = elements.some(el => {
      checkedSelectorsCount++;
      return el.hasAttribute && el.hasAttribute("data-scrollreveal");
    });
    if (hasSr) {
      detectedTechnologies.push("ScrollReveal");
      supportingEvidence.push("DOM contains elements with 'data-scrollreveal' animations.");
    }

    const hasWow = elements.some(el => {
      checkedSelectorsCount++;
      return el.classList && el.classList.contains("wow");
    });
    if (hasWow) {
      detectedTechnologies.push("WOW.js");
      supportingEvidence.push("DOM contains elements styled with 'wow' class prefixes.");
    }

    const hasLottie = elements.some(el => {
      checkedSelectorsCount++;
      const tag = el.tagName?.toLowerCase();
      return tag === "lottie-player" || tag === "dotlottie-player" || (el.classList && el.classList.contains("lottie"));
    });
    if (hasLottie) {
      detectedTechnologies.push("Lottie");
      supportingEvidence.push("Lottie player nodes or container elements observed.");
    }

    const hasGsap = elements.some(el => {
      checkedSelectorsCount++;
      return el._gsap !== undefined || (el.getAttribute && el.getAttribute("style")?.includes("--gsap"));
    });
    if (hasGsap) {
      detectedTechnologies.push("GSAP");
      supportingEvidence.push("Element property instances contain active GSAP animation handles.");
    }

    const hasFramer = elements.some(el => {
      checkedSelectorsCount++;
      return (el.classList && el.classList.contains("framer-motion")) || (el.getAttribute && el.getAttribute("style")?.includes("framer"));
    });
    if (hasFramer) {
      detectedTechnologies.push("Framer Motion");
      supportingEvidence.push("CSS variable prefixes indicate Framer Motion animation values.");
    }

    if (animationRegistry && animationRegistry.waapiCount > 0) {
      detectedTechnologies.push("Native WAAPI");
      supportingEvidence.push(`Active document players detected: ${animationRegistry.waapiCount} WAAPI elements.`);
    }

    const confidence = {
      score: detectedTechnologies.length > 0 ? 95 : 50,
      explanation: detectedTechnologies.length > 0
        ? `Identified ${detectedTechnologies.join(", ")} via observable inline attributes and runtime style classes.`
        : "No framework-specific triggers observed in elements.",
      factors: [`Tested selectors: ${checkedSelectorsCount}`]
    };

    const registry = new TechnologyRegistry({
      detectedTechnologies,
      confidence,
      supportingEvidence,
      versionHints,
      diagnostics: {
        executionTimeMs: Math.round(performance.now() - startTime),
        checkedSelectorsCount
      }
    });

    return { technologyRegistry: registry };
  }
}
