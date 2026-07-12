/**
 * Declarative rules for semantic intelligence mapping.
 * Operates purely on visual metric ranges. No URLs or domain signatures.
 */
export const SemanticRules = {
  whitespaceScale: [
    { maxScore: 30, label: "Compact / High density" },
    { maxScore: 70, label: "Balanced / Structured spacing" },
    { maxScore: 100, label: "Generous / Premium breathing room" }
  ],
  brandFeelRanges: {
    professionalism: {
      minRhythmScore: 60,
      minConsistencyScore: 65
    },
    friendliness: {
      maxContrastEnergy: 50,
      minPlayfulnessScore: 40
    },
    luxury: {
      maxDensityScore: 40,
      minHierarchyScore: 70
    }
  }
};
