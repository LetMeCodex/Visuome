import React from "react";
import Card from "./Card.jsx";

export function MetricCard({ title = "", value = "", trend = "", className = "" }) {
  return (
    <Card className={className}>
      <span className="text-xs text-[#a9b1d6]">{title}</span>
      <p className="text-2xl font-bold mt-1 text-white">{value}</p>
      {trend && <span className="text-[10px] text-emerald-400 mt-2 block">{trend}</span>}
    </Card>
  );
}
export default MetricCard;
