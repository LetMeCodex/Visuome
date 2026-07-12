import React, { useState } from "react";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

import ClassificationCard from "../components/ClassificationCard.jsx";
import ColorDNA from "../components/ColorDNA.jsx";
import TypographyDNA from "../components/TypographyDNA.jsx";
import LayoutDNA from "../components/LayoutDNA.jsx";
import ComponentDNA from "../components/ComponentDNA.jsx";
import MotionDNA from "../components/MotionDNA.jsx";
import Scorecard from "../components/Scorecard.jsx";
import DebugPanel from "../components/DebugPanel.jsx";

export function ScanResultsPage({ report = {}, designGenome = {}, onScan }) {
  if (!report || Object.keys(report).length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-[var(--color-text)] bg-[var(--color-bg)] select-none">
        <EmptyState message="No scan reports exist yet. Please perform a page scan to build the design system report." />
        <Button onClick={onScan} variant="primary" className="mt-4">
          Start Scan / Analyze Page
        </Button>
      </div>
    );
  }

  const [copyStatus, setCopyStatus] = useState("");
  const handleCopy = (text, message = "Copied to clipboard") => {
    navigator.clipboard.writeText(text);
    setCopyStatus(message);
    setTimeout(() => setCopyStatus(""), 2000);
  };

  return (
    <div className="scan-results-page overflow-y-auto h-full text-[var(--color-text)] select-none animate-fade-in">
      <div className="p-6 pb-2">
        <h2 className="text-xl font-bold mb-1 font-heading">Visual Design System Report</h2>
        <p className="text-xs text-[var(--color-textMuted)] font-medium">
          Comprehensive visual language, accessibility, motion curves, and technical audit details.
        </p>
      </div>

      <div className="report-stack pb-8">
        <Scorecard scorecard={report.scorecard || {}} />
        <ClassificationCard classification={report.classification || {}} />
        {report.designTokens?.colors && (
          <ColorDNA colors={report.designTokens.colors} onCopy={handleCopy} />
        )}
        {report.designTokens?.typography && (
          <TypographyDNA typography={report.designTokens.typography} onCopy={handleCopy} />
        )}
        {report.layout && report.designTokens && (
          <LayoutDNA
            layout={report.layout}
            spacing={report.designTokens.spacing || {}}
            radius={report.designTokens.radius || {}}
            onCopy={handleCopy}
          />
        )}
        {report.components && (
          <ComponentDNA components={report.components} onCopy={handleCopy} />
        )}
        {report.designTokens && (
          <MotionDNA tokens={report.designTokens} onCopy={handleCopy} />
        )}
        {report.debug && (
          <DebugPanel
            debug={report.debug}
            rejectedStyles={report.classification?.rejectedStyles || []}
          />
        )}
      </div>

      {copyStatus && (
        <div className="toast">
          <span>{copyStatus}</span>
        </div>
      )}
    </div>
  );
}

export default ScanResultsPage;
