import Icon from "./Icon";

export const SCAN_STAGES = [
  "Reading DOM",
  "Extracting CSS",
  "Detecting components",
  "Building design tokens",
  "Classifying visual style",
  "Generating prompts",
];

export default function ScanControl({ status, stageIndex, onScan, error }) {
  const scanning = status === "scanning";
  const progress = status === "success" ? 100 : scanning ? Math.max(8, Math.round(((stageIndex + 1) / SCAN_STAGES.length) * 100)) : 0;
  return (
    <section className="scan-control" aria-live="polite">
      <button type="button" className="scan-button" onClick={onScan} disabled={scanning}>
        <Icon name={scanning ? "refresh" : "scan"} size={19} className={scanning ? "animate-spin" : ""} />
        <span>{scanning ? SCAN_STAGES[stageIndex] : "Scan Current Page"}</span>
      </button>
      {(scanning || status === "success") ? (
        <div className="scan-progress">
          <div className="progress-label">
            <span><Icon name="check" size={15} /> {status === "success" ? "Scan complete" : SCAN_STAGES[stageIndex]}</span>
            <strong>{progress}%</strong>
          </div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          {scanning ? <div className="stage-dots" aria-label={`Stage ${stageIndex + 1} of ${SCAN_STAGES.length}`}>{SCAN_STAGES.map((stage, index) => <i key={stage} className={index <= stageIndex ? "active" : ""} />)}</div> : null}
        </div>
      ) : null}
      {error ? <div className="error-banner" role="alert"><Icon name="alert" size={17} /><span>{error}</span></div> : null}
    </section>
  );
}
