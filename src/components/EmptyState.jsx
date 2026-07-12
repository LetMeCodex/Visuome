import Icon from "./Icon";

export default function EmptyState() {
  return (
    <section className="empty-state">
      <div className="empty-visual" aria-hidden="true"><span /><i /><Icon name="dna" size={46} /></div>
      <h2>Reveal the system beneath the surface.</h2>
      <p>Scan the active page to map its colors, type, spacing, layout, components, motion, and evidence-backed visual classification.</p>
      <div className="empty-features"><span>Computed styles</span><span>Local processing</span><span>Prompt-ready exports</span></div>
    </section>
  );
}
