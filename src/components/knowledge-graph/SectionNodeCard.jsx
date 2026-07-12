import React from "react";
import Card from "../ui/Card.jsx";

export function SectionNodeCard({ type = "Header", selector = "header" }) {
  return (
    <Card className="border-l-4 border-l-amber-500">
      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Section Node</span>
      <h4 className="text-sm font-bold text-white mt-1">{type} Layout</h4>
      <p className="text-xs font-mono text-[#a9b1d6] mt-1.5">{selector}</p>
    </Card>
  );
}
export default SectionNodeCard;
