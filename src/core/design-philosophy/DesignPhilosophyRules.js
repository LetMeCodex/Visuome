/**
 * Declarative rules for design philosophy engine.
 * Operates exclusively on semantic inputs. No URL or domain references.
 */
export const DesignPhilosophyRules = {
  minimalismScale: [
    { minWhitespace: 70, minRestraint: 70, label: "Minimalist Philosophy" },
    { minWhitespace: 0, minRestraint: 0, label: "Expressive / Decorative Philosophy" }
  ],
  cognitiveRanges: {
    complexityThreshold: 60,
    fatigueThreshold: 70
  }
};
