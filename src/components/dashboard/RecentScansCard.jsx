import React from "react";
import Card from "../ui/Card.jsx";

export function RecentScansCard({ timings = {} }) {
  const steps = Object.entries(timings);
  return (
    <Card className="bg-[#1c1d2a] border-[#2f3147] hover:border-[#4f46e5]/40 transition-all duration-300">
      <span className="text-[10px] font-bold text-[#565f89] uppercase tracking-wider mb-3 block">Discovery Pipeline Timers</span>
      {steps.length === 0 ? (
        <p className="text-xs text-[#565f89]">No steps timing captured.</p>
      ) : (
        <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1 select-none font-mono">
          {steps.map(([step, ms]) => (
            <div key={step} className="flex justify-between items-center text-[10px] border-b border-[#2f3147]/30 pb-1.5 last:border-b-0 last:pb-0">
              <span className="text-[#a9b1d6] capitalize truncate max-w-[140px]">
                {step.replace(/_/g, " ").toLowerCase()}
              </span>
              <span className="text-white font-bold bg-[#24283b] px-1.5 py-0.5 rounded border border-[#2f3147]/50">
                {ms} ms
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
export default RecentScansCard;
