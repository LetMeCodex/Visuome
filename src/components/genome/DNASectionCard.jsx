import React, { useState } from "react";
import Card from "../ui/Card.jsx";

export function DNASectionCard({ title = "", data = {} }) {
  const [expanded, setExpanded] = useState(false);

  const formatValue = (val) => {
    if (Array.isArray(val)) {
      return (
        <div className="flex flex-wrap gap-1 mt-1 justify-end max-w-[200px]">
          {val.map((item, idx) => (
            <span key={idx} className="bg-[#24283b] text-[#89b4fa] text-[9px] px-1.5 py-0.5 rounded border border-[#2f3147]/50 font-mono">
              {String(item)}
            </span>
          ))}
        </div>
      );
    }
    if (typeof val === "boolean") {
      return (
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${val ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
          {val ? "TRUE" : "FALSE"}
        </span>
      );
    }
    return <span className="text-white font-mono text-[10px]">{String(val)}</span>;
  };

  return (
    <Card className="transition-all duration-300 bg-[#1c1d2a] border-[#2f3147] hover:border-[#4f46e5]/40 select-none">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div>
          <h4 className="text-xs font-bold text-white flex items-center space-x-2">
            <span>🧬</span>
            <span>{title}</span>
          </h4>
          <div className="flex items-center space-x-3 mt-1.5 text-[10px] text-[#a9b1d6]">
            <span>Confidence: <strong className="text-emerald-400">{(data.confidence * 100).toFixed(0)}%</strong></span>
            <span>Completeness: <strong>{data.completeness * 100}%</strong></span>
            <span>Evidence: <strong>{data.evidenceCount || 0} items</strong></span>
          </div>
        </div>
        <span className="text-xs text-[#565f89] transition-transform duration-200">{expanded ? "▼" : "▶"}</span>
      </div>

      {expanded && (
        <div className="mt-4 pt-3 border-t border-[#2f3147]/50 text-xs text-[#a9b1d6] space-y-3">
          {data.attributes && Object.entries(data.attributes).map(([k, v]) => (
            <div key={k} className="flex justify-between items-start">
              <span className="capitalize text-[#565f89] text-[10px] font-semibold tracking-wide">{k.replace(/([A-Z])/g, ' $1')}</span>
              {formatValue(v)}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
export default DNASectionCard;
