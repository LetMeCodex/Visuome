import React from "react";
import Card from "../ui/Card.jsx";

export function PageNodeCard({ url = "/", title = "Index Page", depth = 1 }) {
  return (
    <Card className="border-l-4 border-l-emerald-500">
      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Page Node</span>
      <h4 className="text-sm font-bold text-white mt-1">{title}</h4>
      <div className="flex justify-between items-center text-[10px] text-[#a9b1d6] mt-2">
        <span>Route: <strong>{url}</strong></span>
        <span>Crawl Depth: <strong>{depth}</strong></span>
      </div>
    </Card>
  );
}
export default PageNodeCard;
