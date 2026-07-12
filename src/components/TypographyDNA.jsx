import { CopyButton, Section } from "./Section";

function TypeSample({ label, style }) {
  if (!style?.fontSize) return null;
  return (
    <div className="type-sample">
      <span>{label}</span>
      <strong style={{ fontFamily: style.fontFamily, fontSize: `min(${style.fontSize}, 28px)`, fontWeight: style.fontWeight, lineHeight: style.lineHeight }}>Aa</strong>
      <code>{style.fontSize} / {style.lineHeight} · {style.fontWeight}</code>
    </div>
  );
}

export default function TypographyDNA({ typography, onCopy }) {
  const exportData = JSON.stringify(typography, null, 2);
  return (
    <Section icon="type" title="Typography DNA" action={<CopyButton label="Copy tokens" onClick={() => onCopy(exportData, "Typography tokens copied")} />}>
      <div className="font-hero">
        <div className="font-glyph" style={{ fontFamily: typography.headingFont }}>Ag</div>
        <div><p className="field-label">Heading font</p><h3>{typography.headingFont}</h3><p className="field-label body-font-label">Body font</p><strong>{typography.bodyFont}</strong></div>
      </div>
      <p className="personality-note">{typography.personality}</p>
      <div className="type-scale">
        <TypeSample label="H1" style={typography.h1} />
        <TypeSample label="H2" style={typography.h2} />
        <TypeSample label="H3" style={typography.h3} />
        <TypeSample label="Body" style={typography.bodyText} />
        <TypeSample label="Button" style={typography.buttonText} />
      </div>
      <div className="token-lines">
        <p><span>Common sizes</span>{typography.commonSizes.slice(0, 8).map((item) => item.value).join(" · ") || "Not detected"}</p>
        <p><span>Weights</span>{typography.commonWeights.slice(0, 8).map((item) => item.value).join(" · ") || "Not detected"}</p>
        <p><span>Letter spacing</span>{typography.letterSpacing.slice(0, 6).map((item) => item.value).join(" · ") || "Normal"}</p>
      </div>
    </Section>
  );
}
