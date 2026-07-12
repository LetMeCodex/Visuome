import { PromptTemplateEngine } from "./PromptTemplateEngine.js";

/**
 * Normalizes DNA blocks and constructs six deterministic prompt profiles (Master, Clone, Mixer, Learning, Developer, Design System).
 */
export class PromptBuilder {
  /**
   * Builds the prompt registry with all profiles.
   * @param {object} genome DesignGenome master registry.
   * @param {string} format markdown, text, json, xml, yaml
   * @returns {object} Profiles map matching PromptRegistry.
   */
  static build(genome, format = "markdown") {
    if (!genome) return {};

    const masterPrompt = this.buildMaster(genome, format);
    const clonePrompt = this.buildClone(genome, format);
    const genomeMixerPrompt = this.buildMixer(genome, format);
    const learningPrompt = this.buildLearning(genome, format);
    const developerPrompt = this.buildDeveloper(genome, format);
    const designSystemPrompt = this.buildDesignSystem(genome, format);

    return {
      masterPrompt,
      clonePrompt,
      genomeMixerPrompt,
      learningPrompt,
      developerPrompt,
      designSystemPrompt
    };
  }

  static buildMaster(genome, format) {
    const sections = {
      "Visual DNA": genome.visualDNA || {},
      "Motion DNA": genome.motionDNA || {},
      "Platform DNA": genome.platformDNA || {},
      "Interaction DNA": genome.interactionDNA || {},
      "Layout DNA": genome.layoutDNA || {},
      "Semantic DNA": genome.semanticDNA || {},
      "Design System DNA": genome.designSystemDNA || {},
      "Knowledge Graph DNA": genome.knowledgeGraphDNA || {}
    };
    return PromptTemplateEngine.render("Master Prompt DNA Profiles", sections, format);
  }

  static buildClone(genome, format) {
    const sections = {
      "Layout & Grid Config": genome.layoutDNA || {},
      "Spacing & Typography Metrics": genome.visualDNA?.typography || {},
      "Design System Core": genome.designSystemDNA || {},
      "Navigation Flow": genome.platformDNA?.pages || [],
      "Animations and Timing Curves": genome.motionDNA?.animations || [],
      "User Interactive Binds": genome.interactionDNA || {}
    };
    return PromptTemplateEngine.render("Clone Code Generation Prompt", sections, format);
  }

  static buildMixer(genome, format) {
    const sections = {
      "Genome Mixing Nodes": "Provides the schema mappings for merging visual styles.",
      "Base Structure Node A": genome.metadata?.genomeId || "",
      "Base Structure Node B": "Placeholders for Genome B mappings.",
      "Merge Relationship Definitions": "contains, variantOf, inherits"
    };
    return PromptTemplateEngine.render("Genome Mixer Prompt Template", sections, format);
  }

  static buildLearning(genome, format) {
    const sections = {
      "Design Intent Analysis": genome.semanticDNA?.designPhilosophy || {},
      "Visual Hierarchy Decisions": "Explain how color and spacing registries define user focus.",
      "Motion Design Purpose": genome.motionDNA?.motionPhilosophy || {},
      "Component Reusability Strategy": "Analyzing how cards and repeating grid groups function."
    };
    return PromptTemplateEngine.render("Educational Architecture Prompt", sections, format);
  }

  static buildDeveloper(genome, format) {
    const sections = {
      "Project Folder Tree Structure": "Recommended components structure for this build.",
      "Standard Naming Conventions": "kebab-case component selectors and BEM css patterns.",
      "Component Interface Specifications": "Interfaces defined by graph nodes children arrays.",
      "Interactions & Easings Binds": genome.motionDNA?.animations || [],
      "Accessibility & Performance Standards": "Strict WCAG accessibility colors recommendations and responsive breakpoints."
    };
    return PromptTemplateEngine.render("Developer Implementation Blueprint", sections, format);
  }

  static buildDesignSystem(genome, format) {
    const sections = {
      "Spacing and Grid Scales": {
        spacingScale: genome.designSystemDNA?.spacingScale || [],
        gridScale: genome.designSystemDNA?.gridScale || []
      },
      "Typography Configuration": genome.designSystemDNA?.typographyScale || [],
      "Shadows and Radii Elevators": {
        radii: genome.designSystemDNA?.radiusScale || [],
        elevations: genome.designSystemDNA?.elevationScale || []
      },
      "Color Palettes & Tokens": genome.designSystemDNA?.colorTokens || {},
      "Motion System Tokens": genome.designSystemDNA?.motionScale || {}
    };
    return PromptTemplateEngine.render("Design System CSS Variables Blueprint", sections, format);
  }
}
