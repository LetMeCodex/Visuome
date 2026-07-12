import { VisualLanguageAnalyzerInterface } from "./VisualLanguageAnalyzerInterface.js";

export class CompositionAnalyzer extends VisualLanguageAnalyzerInterface {
  name() { return "CompositionAnalyzer"; }
  version() { return "1.1.0"; }
  dependencies() { return ["nodeRegistry", "componentRegistry", "layoutRegistry", "colorRegistry"]; }

  /**
   * Determine spatial compositions (Dashboard, Single Column, Immersive, Card Grid, Landing) from elements.
   * @param {object} scanResult
   * @param {object} rules
   * @param {object} cache
   * @returns {Promise<object>} compositionStyle result.
   */
  async analyze(scanResult, rules, cache) {
    const layoutReg = scanResult.layoutRegistry || {};
    const compReg = scanResult.componentRegistry || {};
    const colorReg = scanResult.colorRegistry || {};
    const nodes = Array.from(scanResult.nodeRegistry?.values() || []);

    const gridCount = layoutReg.gridLayoutCount || 0;
    const flexCount = layoutReg.flexLayoutCount || 0;
    const components = compReg.components || [];

    const cards = components.filter(c => c.type === "Card");
    const heroes = components.filter(c => c.type === "HeroSection");
    const sidebars = components.filter(c => c.type === "Sidebar");
    const tables = nodes.filter(n => n.tag === "table");

    let score = 50;
    let dominantStyle = "Single Column Flow";
    let reasoning = "Defaulting to single column layout flow since no complex structures stand out.";

    if (sidebars.length > 0 || tables.length > 0) {
      dominantStyle = "Dashboard / Data Portal";
      score = 85;
      reasoning = `Sidebar observed with ${tables.length} tables indicating dashboard layout composition.`;
    } else if (cards.length > 5 && gridCount > 0) {
      dominantStyle = "Card Grid Portal";
      score = 80;
      reasoning = `Grid layout structure with ${cards.length} cards indicating modular card grid style.`;
    } else if (heroes.length > 0 && flexCount > 3) {
      dominantStyle = "Hero-focused Landing";
      score = 75;
      reasoning = "Presence of hero banner and flex content flow suggests hero focused landing page style.";
    } else if (colorReg.theme === "Dark" && nodes.length < 150) {
      dominantStyle = "Immersive Media Display";
      score = 70;
      reasoning = "Dark theme palette with low density indicates minimal media immersive display style.";
    }

    const evidence = [
      `Cards detected: ${cards.length}`,
      `Hero sections: ${heroes.length}`,
      `Sidebar panels: ${sidebars.length}`,
      `HTML Tables: ${tables.length}`,
      `Active theme: ${colorReg.theme || "Light"}`
    ];

    const contradictions = [];
    if (dominantStyle === "Dashboard / Data Portal" && cards.length > 10) {
      contradictions.push("Main dashboard pattern detected but card counts match card grid layout.");
    }

    return {
      compositionStyle: {
        value: dominantStyle,
        score,
        confidence: components.length > 0 ? 80 : 40,
        evidence,
        contradictions,
        reasoning,
        diagnostics: {
          cardsCount: cards.length,
          heroesCount: heroes.length,
          sidebarsCount: sidebars.length,
          tablesCount: tables.length,
          gridCount
        }
      }
    };
  }
}
