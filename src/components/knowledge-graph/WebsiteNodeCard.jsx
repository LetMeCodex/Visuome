import React from "react";
import Card from "../ui/Card.jsx";

export function WebsiteNodeCard({ origin = "localhost", pageCount = 0 }) {
  return (
    <Card className="border-l-4 border-l-indigo-500">
      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Origin Node</span>
      <h4 className="text-sm font-bold text-white mt-1">{origin}</h4>
      <p className="text-xs text-[#a9b1d6] mt-1">{pageCount} connected sub-page routes mapped.</p>
    </Card>
  );
}
export default WebsiteNodeCard;
