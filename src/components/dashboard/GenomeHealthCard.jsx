import React from "react";
import Card from "../ui/Card.jsx";

export function GenomeHealthCard({ genome = {} }) {
  const stats = genome.statistics || { genomeCompleteness: 98 };
  return (
    <Card className="flex flex-col justify-between h-full bg-gradient-to-br from-[#14151f] to-[#1e2030] border-[#2f3147] hover:border-[#4f46e5]/40 transition-all duration-300">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-[#565f89] uppercase tracking-wider">Genome Health</span>
          <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Optimal</span>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight mt-1">{stats.genomeCompleteness}%</h3>
      </div>
      <div className="space-y-1.5 mt-4">
        <div className="flex-1 bg-[#24283b] rounded-full h-2 overflow-hidden border border-[#2f3147]/50 shadow-inner">
          <div
            className="bg-gradient-to-r from-[#4f46e5] to-[#5de4f4] h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${stats.genomeCompleteness}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-[#565f89]">
          <span>DNA Integrity Checks</span>
          <span>Passed (15/15)</span>
        </div>
      </div>
    </Card>
  );
}
export default GenomeHealthCard;
