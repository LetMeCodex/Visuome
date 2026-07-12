import Icon from "./Icon";

export default function DebugPanel({ debug, rejectedStyles }) {
  return (
    <details className="debug-panel">
      <summary><span><Icon name="bug" size={17} /> Debug & Trust</span><Icon name="chevron" size={17} className="debug-chevron" /></summary>
      <div className="debug-content">
        <div className="debug-stats">
          <div><strong>{debug.scannedElementCount}</strong><span>Scanned</span></div>
          <div><strong>{debug.usedElementCount}</strong><span>Used</span></div>
          <div><strong>{debug.ignoredElementCount}</strong><span>Ignored</span></div>
          <div><strong>{debug.scanDurationMs}ms</strong><span>Duration</span></div>
        </div>
        {debug.confidenceWarnings.length ? <div className="debug-block warning"><h4>Confidence warnings</h4><ul>{debug.confidenceWarnings.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
        <div className="debug-block"><h4>Known scan limitations</h4><ul>{debug.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div className="debug-block"><h4>Rejected classifications</h4><ul>{rejectedStyles.map((item) => <li key={item.style}><strong>{item.style}:</strong> {item.reason}</li>)}</ul></div>
      </div>
    </details>
  );
}
