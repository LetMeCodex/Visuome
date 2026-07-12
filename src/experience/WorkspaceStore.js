/**
 * State store managing currently active workspaces and routing parameters.
 */
export class WorkspaceStore {
  constructor() {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem("visuome_workspace_state") || "{}");
    } catch (e) {
      console.warn("WorkspaceStore: localStorage access denied, using in-memory state.", e);
    }
    this.state = {
      activePage: saved.activePage || "Scan",
      currentScanResult: null,
      theme: saved.theme || "dark",
      sidebarOpen: saved.sidebarOpen !== undefined ? saved.sidebarOpen : true,
      lastSearch: saved.lastSearch || "",
      searchQuery: saved.lastSearch || "",
      selectedNode: null,
      contextPanelState: {},
      expandedPanels: saved.expandedPanels || [],
      openDNASections: saved.openDNASections || [],
      contextPanelWidth: saved.contextPanelWidth || 256,
      sidebarState: { collapsed: false }
    };
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    try {
      localStorage.setItem("visuome_workspace_state", JSON.stringify({
        activePage: this.state.activePage,
        theme: this.state.theme,
        sidebarOpen: this.state.sidebarOpen,
        lastSearch: this.state.searchQuery,
        expandedPanels: this.state.expandedPanels,
        openDNASections: this.state.openDNASections,
        contextPanelWidth: this.state.contextPanelWidth
      }));
    } catch (e) {
      console.warn("WorkspaceStore: Could not save state to localStorage.", e);
    }
    this.notify();
  }

  setActivePage(page) {
    this.setState({ activePage: page });
  }

  setSearchQuery(q) {
    this.setState({ searchQuery: q, lastSearch: q });
  }

  setSelectedNode(node) {
    this.setState({ selectedNode: node });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

export const workspaceStore = new WorkspaceStore();
export default workspaceStore;
