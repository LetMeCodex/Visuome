import React from "react";
import Card from "../ui/Card.jsx";

export function KnowledgeGraphCard({ graphDNA = {} }) {
  const nodes = graphDNA.nodes?.length || 28;
  return (
    <Card className="flex flex-col justify-between h-full bg-[#1c1d2a] border-[#2f3147] hover:border-[#4f46e5]/40 hover:translate-y-[-2px] transition-all duration-300">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-[#565f89] uppercase tracking-wider">Knowledge Graph</span>
          <span className="text-[10px] text-emerald-400 font-semibold">Loaded</span>
        </div>
        <h3 className="text-base font-bold text-white tracking-tight mt-1">{nodes} Nodes Mapped</h3>
      </div>
      <div className="mt-4 flex items-center justify-between text-[9px] text-[#565f89]">
        <span>Topological relation edges</span>
        <span className="text-white font-mono">32 Relations</span>
      </div>
    </Card>
  );
}
export default KnowledgeGraphCard;
