import React from "react";
import workspaceStore from "./WorkspaceStore.js";

export function NavigationRail({ activePage = "Scan", onNavigate }) {
  const state = workspaceStore.getState();
  const [collapsed, setCollapsed] = React.useState(!state.sidebarOpen);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    workspaceStore.setState({ sidebarOpen: !next });
  };

  const groups = [
    {
      title: "Analysis",
      items: [
        { name: "Scan", icon: "🔍" },
        { name: "Genome", icon: "🧬" },
        { name: "Knowledge Graph", icon: "🕸️" }
      ]
    },
    {
      title: "Create",
      items: [
        { name: "Prompt Studio", icon: "💬" },
        { name: "Genome Mixer", icon: "🎛️" },
        { name: "Custom Prompt", icon: "✏️" }
      ]
    },
    {
      title: "Archive",
      items: [
        { name: "History", icon: "🕒" },
        { name: "Vault", icon: "🔒" },
        { name: "Exports", icon: "📥" }
      ]
    },
    {
      title: "System",
      items: [
        { name: "Settings", icon: "⚙️" }
      ]
    }
  ];

  return (
    <div
      className={`navigation-rail bg-[var(--color-bgMuted)] border-r border-[var(--color-border)] p-4 flex flex-col justify-between text-[var(--color-text)] select-none transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      } shrink-0 h-full`}
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6 px-2">
          {!collapsed && (
            <div className="flex items-baseline space-x-1">
              <span className="font-heading font-black text-base tracking-tight text-[var(--color-text)] uppercase">
                visuome
              </span>
              <span className="text-[8px] font-bold tracking-widest font-mono text-[var(--color-textMuted)] uppercase">
                studio
              </span>
            </div>
          )}
          {collapsed && (
            <div className="font-heading font-black text-base text-[var(--color-text)] mx-auto uppercase">V</div>
          )}
        </div>

        {/* Sidebar Groups */}
        <div className="space-y-4">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!collapsed && (
                <div className="text-[9px] uppercase tracking-wider text-[var(--color-textMuted)] px-2.5 mb-1 font-heading font-bold opacity-60">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
                const isActive = activePage === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      workspaceStore.setActivePage(item.name);
                      if (onNavigate) onNavigate(item.name);
                    }}
                    className={`w-full flex items-center rounded-[var(--radius-sm,2px)] transition-all duration-150 group relative border-0 cursor-pointer ${
                      collapsed ? "justify-center p-2" : "px-2.5 py-1.5 space-x-2 text-left"
                    } ${
                      isActive
                        ? "bg-[var(--color-text)] text-[var(--color-bg)] font-semibold"
                        : "text-[var(--color-textMuted)] bg-transparent hover:bg-[var(--color-bgCard)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <span className="text-xs shrink-0">{item.icon}</span>
                    {!collapsed && <span className="text-[11px] font-medium tracking-wide">{item.name}</span>}
                    
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--color-bgCard)] border border-[var(--color-border)] text-[var(--color-text)] text-[9px] rounded-[var(--radius-xs,2px)] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap shadow-sm">
                        {item.name}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col pt-4">
        <button
          onClick={toggleCollapse}
          className="w-full flex items-center justify-center py-1.5 rounded-[var(--radius-sm,2px)] bg-[var(--color-bgCard)] border border-[var(--color-border)] text-[9px] font-bold uppercase tracking-wider text-[var(--color-textMuted)] hover:text-[var(--color-text)] transition-all cursor-pointer"
        >
          {collapsed ? "→" : "← Collapse"}
        </button>
      </div>
    </div>
  );
}
export default NavigationRail;
