import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  
  const [configs, setConfigs] = useState({
    autoScan: true,
    diagnostics: false,
    sameOriginOnly: true,
    telemetry: false,
    developerMode: false
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("visuome_settings");
      if (saved) {
        setConfigs({
          autoScan: true,
          diagnostics: false,
          sameOriginOnly: true,
          telemetry: false,
          developerMode: false,
          ...JSON.parse(saved)
        });
      }
    } catch (e) {
      console.warn("SettingsPage: Failed to read from localStorage.", e);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("visuome_settings", JSON.stringify(configs));
      alert("Settings saved successfully!");
    } catch (e) {
      alert("Save failed: " + e.message);
    }
  };

  const handleReset = () => {
    const defaults = {
      autoScan: true,
      diagnostics: false,
      sameOriginOnly: true,
      telemetry: false,
      developerMode: false
    };
    setConfigs(defaults);
    try {
      localStorage.setItem("visuome_settings", JSON.stringify(defaults));
      alert("Settings reset to defaults!");
    } catch (e) {
      alert("Reset failed: " + e.message);
    }
  };

  return (
    <div className="settings-page p-6 space-y-6 overflow-y-auto h-full text-[var(--color-text)] select-none">
      <div>
        <h2 className="text-xl font-bold mb-1 font-heading">Visuome Settings</h2>
        <p className="text-xs text-[var(--color-textMuted)]">Configure design system crawler variables, keyboard actions, and prompt studio options.</p>
      </div>

      <div className="flex space-x-2 border-b border-[var(--color-border)] pb-2 text-xs">
        {["General", "Scanner", "Exports", "Developer"].map(t => (
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

      <Card className="p-5 space-y-4">
        <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider block font-heading">{activeTab} Parameters</span>
        
        {activeTab === "General" && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-[var(--color-text)]">Same-Origin Links Scan</div>
                <div className="text-[10px] text-[var(--color-textMuted)] mt-0.5">Scans internal links to map pages.</div>
              </div>
              <input
                type="checkbox"
                checked={configs.sameOriginOnly}
                onChange={() => setConfigs(prev => ({ ...prev, sameOriginOnly: !prev.sameOriginOnly }))}
                className="accent-[var(--color-accent)] cursor-pointer"
              />
            </div>
            
            <div className="flex justify-between items-center border-t border-[var(--color-border)] pt-4">
              <div>
                <div className="font-semibold text-[var(--color-text)]">Usage Analytics Telemetry</div>
                <div className="text-[10px] text-[var(--color-textMuted)] mt-0.5">Send anonymous diagnostics logs to help improve Visuome.</div>
              </div>
              <input
                type="checkbox"
                checked={configs.telemetry}
                onChange={() => setConfigs(prev => ({ ...prev, telemetry: !prev.telemetry }))}
                className="accent-[var(--color-accent)] cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === "Scanner" && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-[var(--color-text)]">Auto Scan on Page Load</div>
                <div className="text-[10px] text-[var(--color-textMuted)] mt-0.5">Trigger crawl immediately on navigation.</div>
              </div>
              <input
                type="checkbox"
                checked={configs.autoScan}
                onChange={() => setConfigs(prev => ({ ...prev, autoScan: !prev.autoScan }))}
                className="accent-[var(--color-accent)] cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === "Developer" && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-[var(--color-text)]">Developer Mode</div>
                <div className="text-[10px] text-[var(--color-textMuted)] mt-0.5">Exposes visual telemetry registries, node lists, and diagnostic sidebar.</div>
              </div>
              <input
                type="checkbox"
                checked={configs.developerMode}
                onChange={() => setConfigs(prev => ({ ...prev, developerMode: !prev.developerMode }))}
                className="accent-[var(--color-accent)] cursor-pointer"
              />
            </div>
            
            <div className="flex justify-between items-center border-t border-[var(--color-border)] pt-4">
              <div>
                <div className="font-semibold text-[var(--color-text)]">Enable Diagnostics Overlay</div>
                <div className="text-[10px] text-[var(--color-textMuted)] mt-0.5">Shows Ctrl+Shift+D logs widget.</div>
              </div>
              <input
                type="checkbox"
                checked={configs.diagnostics}
                onChange={() => setConfigs(prev => ({ ...prev, diagnostics: !prev.diagnostics }))}
                className="accent-[var(--color-accent)] cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === "Exports" && (
          <div className="text-xs text-[var(--color-textMuted)] space-y-2">
            <p>Export format templates can be configured to generate custom extensions templates folders.</p>
          </div>
        )}
      </Card>
      
      <div className="flex space-x-2">
        <Button onClick={handleSave} variant="primary" className="text-xs py-2 px-4">
          Save Changes
        </Button>
        <Button onClick={handleReset} variant="secondary" className="text-xs py-2 px-4">
          Reset Settings
        </Button>
      </div>
    </div>
  );
}
export default SettingsPage;
