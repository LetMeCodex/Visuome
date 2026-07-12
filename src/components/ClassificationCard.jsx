import { Section, Metric } from "./Section";

function DotMeter({ value }) {
  const active = Math.max(1, Math.ceil(value / 2));
  return <div className="dot-meter" aria-label={`${value} out of 10`}>{[1,2,3,4,5].map((dot) => <i key={dot} className={dot <= active ? "active" : ""} />)}</div>;
}

export default function ClassificationCard({ classification }) {
  return (
    <Section icon="scan" title="Classification">
      <div className="classification-summary">
        <div className="classification-main">
          <p className="field-label">Primary visual system</p>
          <div className="primary-style-row"><h3>{classification.primaryStyle}</h3><span className="confidence-badge">{classification.confidence}%</span></div>
          <div className="confidence-track"><span style={{ width: `${classification.confidence}%` }} /></div>
          <div className="metric-stack">
            <Metric label="Category" value={classification.industryCategory} />
            <Metric label="Interface" value={classification.interfaceType} />
          </div>
        </div>
        <div className="signal-stack">
          <div><span>Mood</span><DotMeter value={classification.premiumFeel} /></div>
          <div><span>Energy</span><DotMeter value={classification.energy === "Dynamic" ? 8 : 5} /></div>
          <div><span>Complexity</span><DotMeter value={classification.visualComplexity} /></div>
        </div>
      </div>
      {classification.secondaryStyles.length ? <div className="secondary-styles">{classification.secondaryStyles.map((style) => <span key={style}>{style}</span>)}</div> : null}
      <div className="evidence-grid">
        <div>
          <h4>Evidence</h4>
          <ul>{classification.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h4>Rejected labels</h4>
          <div className="rejected-list">{classification.rejectedStyles.map((item) => <details key={item.style}><summary>{item.style}</summary><p>{item.reason}</p></details>)}</div>
        </div>
      </div>
    </Section>
  );
}
