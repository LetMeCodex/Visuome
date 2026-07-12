import React from "react";
import Card from "../ui/Card.jsx";

export function GenomeStatisticsCard({ statistics = {} }) {
  return (
    <Card>
      <span className="text-xs text-[#a9b1d6] font-semibold mb-3 block">Design Genome Metrics</span>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between border-b border-[#2f3147]/30 pb-1">
          <span className="text-[#a9b1d6]">Total DNA Blocks</span>
          <span className="font-bold text-white">8 Blocks</span>
        </div>
        <div className="flex justify-between border-b border-[#2f3147]/30 pb-1">
          <span className="text-[#a9b1d6]">Completeness</span>
          <span className="font-bold text-white">{statistics.genomeCompleteness || 100}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a9b1d6]">Fusions Executed</span>
          <span className="font-bold text-white">{statistics.diagnostics?.modulesExecuted?.length || 12} stages</span>
        </div>
      </div>
    </Card>
  );
}
export default GenomeStatisticsCard;
