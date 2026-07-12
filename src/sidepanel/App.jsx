import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import AppShell from "../experience/AppShell.jsx";
import { buildReport, canScanUrl } from "../utils/scannerUtils";
import { PromptStudioEngine } from "../core/prompt-studio/PromptStudioEngine.js";
import { PromptHistoryEngine } from "../core/prompt-history/PromptHistoryEngine.js";
import { clearSavedScans, deleteSavedScan, getSavedScans, saveScan } from "../utils/storage";
import { createPreviewReport } from "../utils/previewData";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

function friendlyScanError(error) {
  const message = String(error?.message || error || "");
  if (/NOT_ENOUGH_VISIBLE_DATA|Not enough visible/i.test(message)) return "Not enough visible design data found. Try scrolling to a populated area and scan again.";
  if (/Cannot access|chrome:\/\/|Web Store|restricted|permission|Cannot read properties/i.test(message)) return "This page cannot be scanned due to browser restrictions. Try scanning a normal public webpage.";
  if (/Receiving end does not exist|Could not establish connection/i.test(message)) return "The scanner could not connect to this tab. Reload the page and try again.";
  if (/No active tab/i.test(message)) return "No active tab was found. Open a normal public webpage and try again.";
  return "Scan failed, reload the page and try again.";
}

async function requestPageScan(tabId) {
  try {
    return await chrome.tabs.sendMessage(tabId, { type: "VISUOME_SCAN" });
  } catch (firstError) {
    if (!/Receiving end does not exist|Could not establish connection/i.test(String(firstError?.message))) throw firstError;
    await chrome.scripting.executeScript({ target: { tabId }, files: ["contentScript.js"] });
    await wait(60);
    return chrome.tabs.sendMessage(tabId, { type: "VISUOME_SCAN" });
  }
}

export default function App() {
  const [status, setStatus] = useState("idle");
  const [stageIndex, setStageIndex] = useState(0);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [scans, setScans] = useState([]);
  const stageTimer = useRef(null);
  const noticeTimer = useRef(null);

  const showNotice = useCallback((message) => {
    setNotice(message);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 2400);
  }, []);

  useEffect(() => {
    let active = true;
    getSavedScans().then((saved) => {
      if (active) {
        setScans(saved);
        if (saved && saved.length > 0) {
          setReport(saved[0].fullReport || saved[0]);
          setStatus("success");
        }
      }
    }).catch((storageError) => showNotice(storageError.message));
    if (new URLSearchParams(location.search).has("preview")) {
      const preview = createPreviewReport();
      const promptEngine = new PromptStudioEngine();
      promptEngine.buildRegistry(preview.designGenome, "markdown").then((promptRegistry) => {
        if (active) {
          preview.prompts = promptRegistry;
          setReport(preview);
          setStatus("success");
        }
      }).catch((err) => {
        console.error("Preview prompts compile failed", err);
        if (active) {
          setReport(preview);
          setStatus("success");
        }
      });
    }
    return () => {
      active = false;
      clearInterval(stageTimer.current);
      clearTimeout(noticeTimer.current);
    };
  }, [showNotice]);

  const runScan = useCallback(async () => {
    clearInterval(stageTimer.current);
    setError("");
    setStatus("scanning");
    setStageIndex(0);
    stageTimer.current = setInterval(() => setStageIndex((current) => Math.min(current + 1, 4)), 520);
    try {
      if (typeof chrome === "undefined" || !chrome.tabs?.query) throw new Error("No active tab. Load the built extension in Chrome.");
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error("No active tab");
      if (!canScanUrl(tab.url)) throw new Error("restricted page");
      const response = await requestPageScan(tab.id);
      if (!response?.ok) throw new Error(response?.error || "SCAN_FAILED");
      clearInterval(stageTimer.current);
      setStageIndex(4);
      await wait(120);
      console.log("PROMPTS RECEIVED FROM BG/TAB:", response.data?.promptRegistry);
      const nextReport = buildReport(response.data);
      console.log("PROMPTS PARSED via buildReport:", nextReport.prompts);
      
      try {
        const promptEngine = new PromptStudioEngine();
        const promptRegistry = await promptEngine.buildRegistry(nextReport.designGenome, "markdown");
        if (promptRegistry && promptRegistry.masterPrompt) {
          nextReport.prompts = promptRegistry;
          console.log("PROMPTS COMPILED via PromptStudioEngine:", promptRegistry);
        } else {
          console.warn("PromptStudioEngine returned empty or invalid registry. Keeping existing/fallback prompts.");
        }

        // Save history node
        const historyNode = {
          version: `v1.${Date.now().toString().slice(-3)}`,
          timestamp: new Date().toISOString(),
          promptText: nextReport.prompts?.masterPrompt || "",
          changelog: `Visual scan completed for ${nextReport.page.domain}`
        };
        PromptHistoryEngine.save(nextReport.designGenome?.metadata?.genomeId || "default", historyNode);
      } catch (err) {
        console.error("Failed to execute prompt/history builders:", err);
      }

      setStageIndex(5);
      await wait(160);
      startTransition(() => {
        setReport(nextReport);
        setStatus("success");
      });
      showNotice(`Decoded ${nextReport.page.domain}`);
    } catch (scanError) {
      clearInterval(stageTimer.current);
      setStatus("error");
      setError(friendlyScanError(scanError));
    }
  }, [showNotice]);

  const loadSavedReport = useCallback((savedReport) => {
    startTransition(() => {
      setReport(savedReport.fullReport || savedReport);
      setStatus("success");
    });
    showNotice(`Loaded: ${savedReport.domain || savedReport.page?.domain || "Saved Scan"}`);
  }, [showNotice]);

  return (
    <AppShell
      report={report || {}}
      promptRegistry={report?.prompts || {}}
      designGenome={report?.designGenome || {}}
      currentUrl={report?.page?.url || "localhost"}
      onScan={runScan}
      scanStatus={status}
      scanStageIndex={stageIndex}
      scanError={error}
      onLoadScan={loadSavedReport}
      timings={report?.timings || {}}
      scans={scans}
    />
  );
}
