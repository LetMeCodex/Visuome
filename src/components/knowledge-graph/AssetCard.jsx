import React from "react";
import Card from "../ui/Card.jsx";

export function AssetCard({ path = "/assets/logo.svg", type = "image/svg+xml" }) {
  return (
    <Card className="border-l-4 border-l-rose-500">
      <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Asset Node</span>
      <h4 className="text-xs font-bold text-white mt-1 truncate">{path}</h4>
      <span className="text-[10px] text-[#a9b1d6] mt-1 block">Type: <strong>{type}</strong></span>
    </Card>
  );
}
export default AssetCard;
