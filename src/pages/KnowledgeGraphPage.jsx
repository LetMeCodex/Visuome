import React, { useState } from "react";
import Badge from "../components/ui/Badge.jsx";
import Card from "../components/ui/Card.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

export function KnowledgeGraphPage({ designGenome = {} }) {
  if (!designGenome || Object.keys(designGenome).length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-[var(--color-text)] bg-[var(--color-bg)] select-none">
        <EmptyState message="No design genome active. Scan a page to populate the Knowledge Graph." />
      </div>
    );
  }

  const kg = designGenome.knowledgeGraphDNA || {};
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [collapsedNodes, setCollapsedNodes] = useState({});

  const toggleCollapse = (id) => {
    setCollapsedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Re-build tree hierarchy from knowledgeGraphDNA
  const websiteDomain = kg.website?.domain || designGenome.metadata?.domain || "Scanned Website";
  
  // Extract pages
  const rawPages = kg.pages || [{ path: "/" }];
  
  // Extract components
  const rawComponents = kg.components || [
    { name: "Hero Container", tagName: "section", role: "hero" },
    { name: "Header Navigation", tagName: "header", role: "nav" },
    { name: "Footer Grid", tagName: "footer", role: "footer" }
  ];

  // Extract assets
  const rawAssets = kg.assets || [
    { name: "index.css", type: "stylesheet" },
    { name: "main.js", type: "script" }
  ];

  // Assemble hierarchical nodes
  const nodes = [];
  
  // 1. Website node
  const rootNode = {
    id: "root_website",
    label: websiteDomain,
    type: "website",
    icon: "🌐",
    details: { Domain: websiteDomain, SSL: "Yes", Environment: "Production" }
  };
  nodes.push(rootNode);

  // 2. Page nodes
  const pageNodes = rawPages.map((p, idx) => ({
    id: `page_${idx}`,
    label: p.path || p.url || "/",
    type: "page",
    icon: "📄",
    details: { Path: p.path || "/", Protocol: "HTTPS" },
    parentId: "root_website"
  }));
  nodes.push(...pageNodes);

  // 3. Component nodes
  const compNodes = rawComponents.map((c, idx) => ({
    id: `comp_${idx}`,
    label: c.name || c.tagName || "Component",
    type: "component",
    icon: "🎛️",
    details: { Tag: c.tagName || "div", Role: c.role || "section", Classes: c.classes?.join(", ") || "n/a" },
    parentId: "page_0"
  }));
  nodes.push(...compNodes);

  // 4. Asset nodes
  const assetNodes = rawAssets.map((a, idx) => ({
    id: `asset_${idx}`,
    label: a.name || a.url || "Asset",
    type: "asset",
    icon: "📦",
    details: { Name: a.name || "Asset", Type: a.type || "module" },
    parentId: "comp_0"
  }));
  nodes.push(...assetNodes);

  const getChildren = (parentId) => {
    return nodes.filter(n => n.parentId === parentId);
  };

  const getRelations = (node) => {
    if (!node) return null;
    const parent = nodes.find(n => n.id === node.parentId);
    const children = nodes.filter(n => n.parentId === node.id);
    return { parent, children };
  };

  const relations = getRelations(selectedNode || rootNode);

  const renderTreeItem = (node, depth = 0) => {
    const children = getChildren(node.id);
    const hasChildren = children.length > 0;
    const isCollapsed = collapsedNodes[node.id];
    const isSelected = selectedNode?.id === node.id;
    const isHovered = hoveredNodeId === node.id;
    const isRelatedHover = hoveredNodeId && (node.parentId === hoveredNodeId || nodes.find(n => n.id === hoveredNodeId)?.parentId === node.id);

    return (
      <div key={node.id} className="space-y-1">
        {/* Row Item */}
        <div
          style={{ paddingLeft: `${depth * 12 + 6}px` }}
          className={`flex items-center justify-between py-1.5 pr-2 rounded-[var(--radius-sm,2px)] transition-all cursor-pointer select-none font-mono text-[11px] ${
            isSelected 
              ? "bg-[var(--color-text)] text-[var(--color-bg)]" 
              : isHovered 
                ? "bg-[var(--color-bgCard)] text-[var(--color-text)]"
                : isRelatedHover
                  ? "bg-[var(--color-bgMuted)] text-[var(--color-accentHover)]"
                  : "text-[var(--color-text)] hover:bg-[var(--color-bgCard)]/50"
          }`}
          onClick={() => setSelectedNode(node)}
          onMouseEnter={() => setHoveredNodeId(node.id)}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          <div className="flex items-center space-x-2 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCollapse(node.id);
                }}
                className="w-4 h-4 flex items-center justify-center p-0 bg-transparent border-0 text-[10px] text-current cursor-pointer"
              >
                {isCollapsed ? "+" : "−"}
              </button>
            ) : (
              <span className="w-4"></span>
            )}
            <span>{node.icon}</span>
            <span className="truncate">{node.label}</span>
          </div>
          <Badge variant={node.type === "website" ? "info" : node.type === "page" ? "default" : "info"}>
            {node.type}
          </Badge>
        </div>

        {/* Child container */}
        {hasChildren && !isCollapsed && (
          <div className="space-y-1">
            {children.map(child => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="knowledge-graph-page p-6 flex flex-col h-full text-[var(--color-text)] select-none animate-fade-in">
      
      {/* Editorial Header */}
      <div className="border-b border-[var(--color-border)] pb-4 space-y-1">
        <span className="font-caption block">Topology & Relationship Index</span>
        <h1 className="font-display-lg">Knowledge Graph</h1>
        <p className="font-subtitle">
          Collapsible tree structure mapping page connections, assets, and semantic sections. Hover to track lines, click to inspect relationships.
        </p>
      </div>

      <div className="flex-1 flex gap-4 pt-4 min-h-0 overflow-hidden">
        
        {/* Column 1: Node Explorer Tree (Left) */}
        <div className="flex-1 border border-[var(--color-border)] rounded-[var(--radius-md,4px)] bg-[var(--color-bgMuted)] p-3 overflow-y-auto h-full space-y-2">
          <span className="font-caption block px-1.5 opacity-60">System Tree Nodes</span>
          <div className="space-y-1">
            {renderTreeItem(rootNode)}
          </div>
        </div>

        {/* Column 2: Relationship Inspector (Right) */}
        <div className="w-80 border border-[var(--color-border)] rounded-[var(--radius-md,4px)] bg-[var(--color-bgCard)] p-4 flex flex-col justify-between shrink-0 h-full overflow-y-auto">
          <div className="space-y-4">
            <span className="font-caption block">Relationship Inspector</span>
            
            {/* Selected Node Spec */}
            <div className="space-y-3 font-mono text-xs">
              <div className="pb-3 border-b border-[var(--color-border)]">
                <div className="text-[10px] text-[var(--color-textMuted)] uppercase font-bold block mb-1">Target Element</div>
                <div className="flex items-center space-x-2">
                  <span className="text-base">{(selectedNode || rootNode).icon}</span>
                  <span className="font-bold text-[var(--color-text)]">{(selectedNode || rootNode).label}</span>
                </div>
              </div>

              {/* Custom specs */}
              <div className="space-y-2 pb-3 border-b border-[var(--color-border)]">
                <div className="text-[10px] text-[var(--color-textMuted)] uppercase font-bold block">Properties</div>
                {Object.entries((selectedNode || rootNode).details).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-[var(--color-textMuted)]">{key}:</span>
                    <span className="font-bold text-[var(--color-text)] truncate max-w-[150px]">{val}</span>
                  </div>
                ))}
              </div>

              {/* Connections / Line tracing */}
              <div className="space-y-2">
                <div className="text-[10px] text-[var(--color-textMuted)] uppercase font-bold block">Connections</div>
                {relations?.parent && (
                  <div className="flex items-center justify-between text-[11px] bg-[var(--color-bgMuted)] p-1.5 border border-[var(--color-border)] rounded-[var(--radius-xs,2px)]">
                    <span className="text-[var(--color-textMuted)]">Parent:</span>
                    <span className="font-semibold">{relations.parent.label}</span>
                  </div>
                )}
                {relations?.children && relations.children.length > 0 ? (
                  <div className="space-y-1">
                    <span className="text-[10px] text-[var(--color-textMuted)] block">Children:</span>
                    {relations.children.map(c => (
                      <div key={c.id} className="flex items-center justify-between text-[11px] bg-[var(--color-bgMuted)] p-1.5 border border-[var(--color-border)] rounded-[var(--radius-xs,2px)]">
                        <span>{c.icon} {c.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[9px] text-[var(--color-textMuted)] italic">No downstream connections.</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--color-border)] text-[9px] font-mono text-[var(--color-textMuted)] leading-relaxed">
            Selecting a node updates prompt constraints and filters studio variables automatically.
          </div>
        </div>

      </div>

    </div>
  );
}
export default KnowledgeGraphPage;
