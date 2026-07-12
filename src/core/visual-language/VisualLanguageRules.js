/**
 * Declarative rules for visual language analysis.
 * Contains no hardcoded brands, domains, or website signatures.
 */
export const VisualLanguageRules = {
  styles: [
    {
      name: "Neo-Brutalism",
      conditions: {
        minBordersStrength: "Strong",
        minContrastRatio: 6.0,
        maxBorderRadius: 4,
        dominantDisplay: "block"
      },
      weight: 1.2
    },
    {
      name: "Minimal Luxury",
      conditions: {
        maxBgColorsCount: 3,
        minSpacingScaleRange: 16,
        minHierarchyStrength: 0.8,
        themeType: "Light"
      },
      weight: 1.1
    },
    {
      name: "Premium SaaS",
      conditions: {
        hasGradients: true,
        hasRoundedBorders: true,
        minNestedLayouts: 5
      },
      weight: 1.0
    },
    {
      name: "Editorial",
      conditions: {
        hasSerifPrimaryFont: true,
        highContrastText: true,
        minHeadingHierarchy: 3
      },
      weight: 1.0
    }
  ],
  characteristics: {
    densityThresholds: {
      high: 800,
      medium: 300,
      low: 0
    },
    symmetryWeights: {
      gridScore: 0.6,
      flexScore: 0.4
    }
  }
};
