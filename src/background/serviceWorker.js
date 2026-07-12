const RESTRICTED_SCHEMES = ["chrome:", "chrome-extension:", "edge:", "about:", "view-source:", "devtools:"];

function isRestrictedUrl(url = "") {
  try {
    const parsed = new URL(url);
    return RESTRICTED_SCHEMES.includes(parsed.protocol) || parsed.hostname === "chromewebstore.google.com";
  } catch {
    return true;
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  } catch (error) {
    console.warn("Visuome: unable to configure side panel behavior", error);
  }
});

chrome.runtime.onStartup.addListener(async () => {
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  } catch (error) {
    console.warn("Visuome: unable to restore side panel behavior", error);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  try {
    await chrome.sidePanel.setOptions({
      tabId,
      path: "index.html",
      enabled: !isRestrictedUrl(tab.url),
    });
  } catch (error) {
    console.debug("Visuome: side panel option update skipped", error);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "VISUOME_PING") return false;
  sendResponse({ ok: true, version: chrome.runtime.getManifest().version });
  return true;
});
