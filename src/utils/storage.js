const OLD_VAULT_KEY = "designdnaVaultV1";
const VAULT_KEY = "visuomeVaultV1";
const MAX_SAVED_SCANS = 30;

let migrationDone = false;

function hasChromeStorage() {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
}

async function migrateIfNeeded() {
  if (migrationDone) return;
  migrationDone = true; // Set early to avoid any re-entry
  try {
    if (hasChromeStorage()) {
      const oldResult = await chrome.storage.local.get(OLD_VAULT_KEY);
      if (oldResult && Array.isArray(oldResult[OLD_VAULT_KEY])) {
        const oldScans = oldResult[OLD_VAULT_KEY];
        if (oldScans.length > 0) {
          const newResult = await chrome.storage.local.get(VAULT_KEY);
          const currentScans = Array.isArray(newResult[VAULT_KEY]) ? newResult[VAULT_KEY] : [];
          const merged = [...currentScans];
          for (const scan of oldScans) {
            if (!merged.some((s) => s.url === scan.url)) {
              merged.push(scan);
            }
          }
          await chrome.storage.local.set({ [VAULT_KEY]: merged.slice(0, MAX_SAVED_SCANS) });
        }
        await chrome.storage.local.remove(OLD_VAULT_KEY);
      }
    } else {
      const oldItem = localStorage.getItem(OLD_VAULT_KEY);
      if (oldItem) {
        const oldScans = JSON.parse(oldItem);
        if (Array.isArray(oldScans) && oldScans.length > 0) {
          const currentItem = localStorage.getItem(VAULT_KEY);
          const currentScans = currentItem ? JSON.parse(currentItem) : [];
          const merged = Array.isArray(currentScans) ? [...currentScans] : [];
          for (const scan of oldScans) {
            if (!merged.some((s) => s.url === scan.url)) {
              merged.push(scan);
            }
          }
          localStorage.setItem(VAULT_KEY, JSON.stringify(merged.slice(0, MAX_SAVED_SCANS)));
        }
        localStorage.removeItem(OLD_VAULT_KEY);
      }
    }
  } catch (error) {
    console.warn("Visuome: Storage migration failed", error);
  }
}

async function readValue() {
  await migrateIfNeeded();
  if (hasChromeStorage()) {
    const result = await chrome.storage.local.get(VAULT_KEY);
    return Array.isArray(result[VAULT_KEY]) ? result[VAULT_KEY] : [];
  }
  try {
    return JSON.parse(localStorage.getItem(VAULT_KEY) || "[]");
  } catch {
    return [];
  }
}

async function writeValue(scans) {
  if (hasChromeStorage()) {
    await chrome.storage.local.set({ [VAULT_KEY]: scans });
    return;
  }
  localStorage.setItem(VAULT_KEY, JSON.stringify(scans));
}

export async function getSavedScans() {
  try {
    return await readValue();
  } catch (error) {
    throw new Error(`Unable to read the local vault: ${error.message}`);
  }
}

export async function saveScan(report) {
  if (!report?.page?.url) throw new Error("There is no completed scan to save.");
  try {
    const scans = await readValue();
    const saved = {
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      pageTitle: report.page.title,
      url: report.page.url,
      domain: report.page.domain,
      favicon: report.page.favicon,
      scannedAt: new Date().toISOString(),
      primaryStyle: report.classification.primaryStyle,
      confidence: report.classification.confidence,
      palettePreview: report.designTokens.colors.corePalette.slice(0, 5).map((token) => token.hex),
      prompts: report.prompts,
      fullReport: report,
    };
    const next = [saved, ...scans.filter((scan) => scan.url !== saved.url)].slice(0, MAX_SAVED_SCANS);
    await writeValue(next);
    return { saved, scans: next };
  } catch (error) {
    throw new Error(`Unable to save this scan locally: ${error.message}`);
  }
}

export async function deleteSavedScan(id) {
  try {
    const next = (await readValue()).filter((scan) => scan.id !== id);
    await writeValue(next);
    return next;
  } catch (error) {
    throw new Error(`Unable to delete this scan: ${error.message}`);
  }
}

export async function clearSavedScans() {
  try {
    await writeValue([]);
    return [];
  } catch (error) {
    throw new Error(`Unable to clear the vault: ${error.message}`);
  }
}
