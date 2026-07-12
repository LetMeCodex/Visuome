import { CopyButton, Metric, Section } from "./Section";

export default function LayoutDNA({ layout, spacing, radius, onCopy }) {
  return (
    <Section icon="layout" title="Layout DNA" action={<CopyButton label="Copy layout" onClick={() => onCopy(JSON.stringify({ layout, spacing, radius }, null, 2), "Layout tokens copied")} />}>
      <p className="layout-lede">{layout.structure}</p>
      <div className="layout-grid">
        <Metric label="Shell" value={layout.shell} />
        <Metric label="Navigation" value={layout.navigation} />
        <Metric label="Content flow" value={layout.contentFlow} />
        <Metric label="Grid system" value={layout.gridSystem} />
        <Metric label="Max width" value={layout.contentMaxWidth} />
        <Metric label="Alignment" value={layout.alignment} />
        <Metric label="Grid gap" value={spacing.gridGap} />
        <Metric label="Section padding" value={spacing.sectionPadding} />
        <Metric label="Card radius" value={radius.cards} />
        <Metric label="Density" value={layout.density} />
      </div>
      {layout.sections.length ? <div className="section-rhythm"><h4>Visible section rhythm</h4><div>{layout.sections.slice(0, 8).map((section) => <span key={`${section.order}-${section.label}`}><i>{section.order}</i>{section.label.slice(0, 36)}</span>)}</div></div> : null}
    </Section>
  );
}
