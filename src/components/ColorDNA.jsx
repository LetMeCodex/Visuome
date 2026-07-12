import { CopyButton, Section } from "./Section";

const GROUPS = [
  ["Core palette", "corePalette"],
  ["Backgrounds", "backgroundPalette"],
  ["Surfaces", "surfacePalette"],
  ["Text", "textPalette"],
  ["Accents", "accentPalette"],
  ["Borders", "borderPalette"],
];

function ColorToken({ token, onCopy }) {
  return (
    <button type="button" className="color-token" onClick={() => onCopy(token.hex, `${token.hex} copied`)} aria-label={`Copy ${token.hex} ${token.role}`}>
      <span className="color-swatch" style={{ background: token.originalRgba || token.hex }} />
      <strong>{token.hex}</strong>
      <small>{token.role}</small>
      <em>{token.usagePercentage}%</em>
    </button>
  );
}

export default function ColorDNA({ colors, onCopy }) {
  return (
    <Section icon="palette" title="Color DNA" action={<CopyButton label="Copy tokens" onClick={() => onCopy(JSON.stringify(colors, null, 2), "Color tokens copied")} />}>
      <div className="color-groups">
        {GROUPS.map(([label, key]) => colors[key]?.length ? (
          <div className="color-group" key={key}>
            <h4>{label}</h4>
            <div className="color-rail">{colors[key].slice(0, 8).map((token) => <ColorToken key={`${key}-${token.hex}`} token={token} onCopy={onCopy} />)}</div>
          </div>
        ) : null)}
        {colors.gradients?.length ? <div className="color-group"><h4>Gradients</h4><div className="gradient-list">{colors.gradients.map((gradient) => <button type="button" key={gradient.value} onClick={() => onCopy(gradient.value, "Gradient copied")}><span style={{ backgroundImage: gradient.value }} /><code>{gradient.value}</code></button>)}</div></div> : null}
      </div>
    </Section>
  );
}
