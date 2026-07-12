import { Section } from "./Section";
import Icon from "./Icon";

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function Vault({ report, scans, onSave, onDelete, onClear, onCopy }) {
  return (
    <Section id="vault" icon="database" title="Vault" action={scans.length ? <button type="button" className="text-action danger" onClick={onClear}>Clear all</button> : null}>
      <div className="vault-intro">
        <div><h3>Local scan vault</h3><p>Keep reports and their generated prompts on this device.</p></div>
        <button type="button" className="save-scan" onClick={onSave} disabled={!report}><Icon name="save" size={16} /> Save current scan</button>
      </div>
      {scans.length ? (
        <div className="vault-list">{scans.map((scan) => (
          <article key={scan.id} className="vault-item">
            <div className="vault-favicon">{scan.favicon ? <img src={scan.favicon} alt="" /> : <Icon name="globe" size={18} />}</div>
            <div className="vault-meta"><h4>{scan.pageTitle || scan.domain}</h4><p>{scan.domain} · {formatDate(scan.scannedAt)}</p><span>{scan.primaryStyle} · {scan.confidence}%</span></div>
            <div className="palette-preview" aria-label="Saved palette">{scan.palettePreview?.map((color) => <i key={color} style={{ background: color }} />)}</div>
            <button type="button" className="icon-action" onClick={() => onCopy(scan.prompts?.originalInspirationPrompt || "", "Saved prompt copied")} aria-label={`Copy original inspiration prompt for ${scan.domain}`}><Icon name="copy" size={15} /></button>
            <button type="button" className="icon-action danger" onClick={() => onDelete(scan.id)} aria-label={`Delete saved scan for ${scan.domain}`}><Icon name="trash" size={15} /></button>
          </article>
        ))}</div>
      ) : <div className="vault-empty"><Icon name="database" size={24} /><p>No saved scans yet. Complete a scan, then keep it here for comparison or reuse.</p></div>}
    </Section>
  );
}
