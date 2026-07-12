import React from "react";
import Card from "../ui/Card.jsx";

export function PlatformScoreCard({ platformDNA = {} }) {
  const pagesCount = platformDNA.pages?.length || 3;
  return (
    <Card className="flex flex-col justify-between h-full bg-[#1c1d2a] border-[#2f3147] hover:border-[#4f46e5]/40 hover:translate-y-[-2px] transition-all duration-300">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-[#565f89] uppercase tracking-wider">Platform DNA</span>
          <span className="text-[10px] text-emerald-400 font-semibold">Discovery Done</span>
        </div>
        <h3 className="text-base font-bold text-white tracking-tight mt-1">{pagesCount} Pages Mapped</h3>
      </div>
      <div className="mt-4 flex items-center justify-between text-[9px] text-[#565f89]">
        <span>Sitemaps links crawled</span>
        <span className="text-white font-mono">Clean edges</span>
      </div>
    </Card>
  );
}
export default PlatformScoreCard;
