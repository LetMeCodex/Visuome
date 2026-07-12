import React from "react";
import Card from "../ui/Card.jsx";

export function RelationshipCard({ source = "Page", target = "Section", type = "contains" }) {
  return (
    <Card className="border-l-4 border-l-purple-500">
      <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Relationship Edge</span>
      <div className="flex justify-between items-center text-xs mt-2 text-white">
        <span>{source}</span>
        <span className="text-[#a9b1d6] italic text-[10px] px-2 py-0.5 bg-[#24283b] rounded">
          {type}
        </span>
        <span>{target}</span>
      </div>
    </Card>
  );
}
export default RelationshipCard;
