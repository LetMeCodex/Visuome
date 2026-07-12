import Icon from "./Icon";

export function Section({ icon, title, action, children, className = "", id }) {
  return (
    <section id={id} className={`report-section ${className}`}> 
      <div className="section-heading">
        <div className="section-title"><Icon name={icon} size={18} /><h2>{title}</h2></div>
        {action}
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}

export function CopyButton({ onClick, label = "Copy", compact = false }) {
  return (
    <button type="button" className={`copy-button ${compact ? "copy-button-compact" : ""}`} onClick={onClick} aria-label={label}>
      <Icon name="copy" size={14} />
      {compact ? null : <span>{label}</span>}
    </button>
  );
}

export function Metric({ label, value }) {
  return <div className="metric-row"><span>{label}</span><strong>{value || "Not detected"}</strong></div>;
}
