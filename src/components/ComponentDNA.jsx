import { CopyButton, Section } from "./Section";

const LABELS = {
  buttons: "Buttons",
  cards: "Cards",
  navigation: "Navigation",
  forms: "Forms & inputs",
  media: "Media",
  badges: "Badges & chips",
  tables: "Tables",
  widgets: "Widgets",
};

function ComponentCard({ item }) {
  return (
    <article className="component-card">
      <div className="component-preview" style={{ borderRadius: item.radius, background: item.background, color: item.color, border: item.border, boxShadow: item.shadow }}><span>{item.type.replace(/ card$/, "")}</span></div>
      <h4>{item.type}</h4>
      <p>{item.description}</p>
      <dl>
        <div><dt>Radius</dt><dd>{item.radius}</dd></div>
        <div><dt>Padding</dt><dd>{item.padding}</dd></div>
        <div><dt>Border</dt><dd>{item.border}</dd></div>
        <div><dt>Shadow</dt><dd>{item.shadow}</dd></div>
        <div><dt>Motion</dt><dd>{item.hoverMotion}</dd></div>
      </dl>
    </article>
  );
}

export default function ComponentDNA({ components, onCopy }) {
  const groups = Object.entries(components).filter(([, items]) => items.length);
  return (
    <Section icon="components" title="Component DNA" action={<CopyButton label="Copy components" onClick={() => onCopy(JSON.stringify(components, null, 2), "Component tokens copied")} />}>
      {groups.length ? <div className="component-groups">{groups.map(([key, items]) => (
        <div key={key} className="component-group">
          <div className="component-group-heading"><h3>{LABELS[key]}</h3><span>{items.reduce((sum, item) => sum + item.count, 0)} observed</span></div>
          <div className="component-rail">{items.map((item, index) => <ComponentCard key={`${key}-${item.type}-${index}`} item={item} />)}</div>
        </div>
      ))}</div> : <p className="muted-empty">No repeatable component family was confidently detected in this viewport.</p>}
    </Section>
  );
}
