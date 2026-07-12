import React from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { PromptHistoryEngine } from "../core/prompt-history/PromptHistoryEngine.js";

export function HistoryPage({ designGenome = {} }) {
  const genomeId = designGenome?.metadata?.genomeId || "default";
  const historyRegistry = PromptHistoryEngine.getHistory(genomeId);
  const nodes = historyRegistry?.nodes || [];

  return (
    <div className="history-page p-6 space-y-6 overflow-y-auto h-full text-[var(--color-text)] select-none">
      <div>
        <h2 className="text-xl font-bold mb-1 font-heading">Prompt History</h2>
        <p className="text-xs text-[var(--color-textMuted)]">Historical version snapshots generated during page scans and recalculations.</p>
      </div>

      {nodes.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-xs text-[var(--color-textMuted)]">No version nodes saved in history for genome "{genomeId}". Perform a scan to create history.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {nodes.map((v, i) => (
            <Card key={i} className="hover:border-[var(--color-text)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-[var(--color-text)] bg-[var(--color-bgMuted)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                    {v.version}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-text)]">{designGenome?.metadata?.genomeId || "Active Genome"}</span>
                </div>
                <span className="text-[10px] text-[var(--color-textMuted)]">{new Date(v.timestamp).toLocaleString()}</span>
              </div>
              
              <p className="text-xs text-[var(--color-textMuted)] mt-1.5 leading-relaxed">{v.changelog || "Initial scan representing basic layout structure schemas."}</p>

              <div className="mt-4 flex space-x-2">
                <Button onClick={() => {
                  navigator.clipboard.writeText(v.promptText);
                  alert("Copied historical version prompt to clipboard!");
                }} variant="secondary" className="text-[10px] py-1 px-3">
                  Copy Prompt
                </Button>
                <Button onClick={() => alert(`Restoring design genome to version ${v.version}`)} variant="secondary" className="text-[10px] py-1 px-3">
                  Restore
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default HistoryPage;
