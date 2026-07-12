import React from "react";
import Card from "../ui/Card.jsx";

export function GenomeFingerprintCard({ fingerprint = "FING-99a-3b2-c11" }) {
  return (
    <Card>
      <span className="text-xs text-[var(--color-textMuted)] font-semibold mb-2 block">DNA Fingerprint Checksum</span>
      <p className="font-mono text-xs text-[var(--color-text)] bg-[var(--color-bgMuted)] p-2.5 rounded border border-[var(--color-border)] truncate select-all">
        {typeof fingerprint === "object" ? (fingerprint.sha256 || fingerprint.shortId || "") : String(fingerprint)}
      </p>
    </Card>
  );
}
export default GenomeFingerprintCard;
