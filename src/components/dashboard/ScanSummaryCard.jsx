import React from "react";
import Card from "../ui/Card.jsx";

export function ScanSummaryCard({ duration = 2070 }) {
  return (
    <Card className="flex flex-col justify-between h-full bg-gradient-to-br from-[#14151f] to-[#1e2030] border-[#2f3147] hover:border-[#4f46e5]/40 transition-all duration-300">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-[#565f89] uppercase tracking-wider">Scan Duration</span>
          <span className="text-[10px] text-indigo-400 font-mono">100% Local</span>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight mt-1">{(duration / 1000).toFixed(2)}s</h3>
      </div>
      <div className="mt-4 flex items-center justify-between text-[9px] text-[#565f89]">
        <span>Discovery Pipeline speed</span>
        <span className="text-emerald-400 font-semibold">⚡ Fast</span>
      </div>
    </Card>
  );
}
export default ScanSummaryCard;
