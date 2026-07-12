import React from "react";
import Card from "../ui/Card.jsx";

export function GenomeMetadataCard({ metadata = {} }) {
  return (
    <Card>
      <span className="text-xs text-[var(--color-textMuted)] font-semibold mb-2 block">System Configuration Stamps</span>
      <div className="grid grid-cols-2 gap-4 text-xs mt-3">
        <div>
          <span className="text-[var(--color-textMuted)] uppercase text-[9px] font-bold block">Genome Version</span>
          <p className="font-bold text-[var(--color-text)] mt-1">{metadata.version || "v1.0.0"}</p>
        </div>
        <div>
          <span className="text-[var(--color-textMuted)] uppercase text-[9px] font-bold block">Created At</span>
          <p className="font-bold text-[var(--color-text)] mt-1">{metadata.generatedAt ? new Date(metadata.generatedAt).toLocaleTimeString() : "00:00:00"}</p>
        </div>
      </div>
    </Card>
  );
}
export default GenomeMetadataCard;
