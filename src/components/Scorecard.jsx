import { Section } from "./Section";

const LABELS = {
  visualConsistency: "Visual consistency",
  colorHarmony: "Color harmony",
  typographyStrength: "Typography",
  layoutClarity: "Layout clarity",
  componentPolish: "Components",
  motionQuality: "Motion",
  accessibilitySignal: "Accessibility",
  promptUsefulness: "Prompt usefulness",
};

export default function Scorecard({ scorecard }) {
  return (
    <Section icon="score" title="Scorecard">
      <div className="score-grid">{Object.entries(scorecard).map(([key, item]) => (
        <article key={key} className="score-item">
          <div className="score-ring" style={{ "--score": item.score }}><strong>{item.score}</strong><span>/10</span></div>
          <div><h3>{LABELS[key]}</h3><p>{item.reason}</p></div>
        </article>
      ))}</div>
    </Section>
  );
}
