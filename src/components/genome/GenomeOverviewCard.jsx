import React from "react";
import Card from "../ui/Card.jsx";

export function GenomeOverviewCard({ genome = {} }) {
  const metadata = genome.metadata || {};
  return (
    <Card>
      <span className="text-xs text-[#a9b1d6] font-semibold mb-2 block">Genome Registry Overview</span>
      <div className="grid grid-cols-2 gap-4 text-xs mt-2">
        <div>
          <span className="text-[#565f89]">Genome ID</span>
          <p className="font-bold text-white mt-0.5 truncate">{metadata.genomeId || "GEN-DNA-991"}</p>
        </div>
        <div>
          <span className="text-[#565f89]">Completeness</span>
          <p className="font-bold text-white mt-0.5">{genome.statistics?.genomeCompleteness || 100}%</p>
        </div>
      </div>
    </Card>
  );
}
export default GenomeOverviewCard;
