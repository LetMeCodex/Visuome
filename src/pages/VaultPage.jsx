import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { getSavedScans, deleteSavedScan } from "../utils/storage.js";

export function VaultPage({ onLoadScan }) {
  const [activeTab, setActiveTab] = useState("All");
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScans = async () => {
    try {
      setLoading(true);
      const data = await getSavedScans();
      setScans(data || []);
    } catch (e) {
      console.error("Failed to fetch vault scans:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scan from your vault?")) return;
    try {
      await deleteSavedScan(id);
      await fetchScans();
    } catch (e) {
      alert("Failed to delete scan: " + e.message);
    }
  };

  const handleLoad = (item) => {
    if (onLoadScan) {
      onLoadScan(item);
    }
  };

  return (
    <div className="vault-page p-6 space-y-6 overflow-y-auto h-full text-[var(--color-text)] select-none">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold mb-1 font-heading">Visuome Vault</h2>
          <p className="text-xs text-[var(--color-textMuted)]">Saved design genomes, prompt blueprints, and visual style assets.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[var(--color-border)] pb-2 text-xs">
        {["All"].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-1 px-2 border-b-2 transition-all ${
              activeTab === t 
                ? "border-[var(--color-accent)] text-[var(--color-text)] font-semibold" 
                : "border-transparent text-[var(--color-textMuted)] hover:text-[var(--color-text)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-xs text-[var(--color-textMuted)]">Loading saved blueprints vault...</p>
      ) : scans.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-xs text-[var(--color-textMuted)]">No design genomes stored in vault. Click "Scan Page" inside top bar to crawl pages.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scans.map((item, idx) => (
            <Card key={idx} className="p-4 flex flex-col justify-between hover:border-[var(--color-text)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[var(--color-text)]">
                    {item.pageTitle || item.domain || "Discovered Page"}
                  </span>
                  <span className="text-[9px] text-[var(--color-textMuted)] font-mono">
                    {item.domain}
                  </span>
                </div>
                
                <p className="text-[10px] text-[var(--color-textMuted)] font-mono truncate">
                  {item.url}
                </p>
              </div>

              <div className="mt-4 flex space-x-2">
                <Button onClick={() => handleLoad(item)} variant="secondary" className="text-[10px] py-1 px-3">
                  Load
                </Button>
                <Button onClick={() => handleDelete(item.id)} variant="danger" className="text-[10px] py-1 px-3">
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default VaultPage;
