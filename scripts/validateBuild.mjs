import fs from 'fs';
import path from 'path';

console.log("=================================================");
console.log("VISUOME BUILD VALIDATOR");
console.log("=================================================");

let failed = false;

// 1. Version Consistency
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const manifestJson = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

console.log(`Package version: ${packageJson.version}`);
console.log(`Manifest version: ${manifestJson.version}`);

if (packageJson.version !== "0.5.1" || manifestJson.version !== "0.5.1") {
  console.error("❌ Version inconsistency: Expected version 0.5.1");
  failed = true;
} else {
  console.log("✅ Versions are consistent and correct (0.5.1).");
}

// 2. Permissions validation
const expectedPermissions = ["activeTab", "scripting", "storage", "sidePanel", "tabs"];
for (const p of expectedPermissions) {
  if (!manifestJson.permissions.includes(p)) {
    console.error(`❌ Missing required manifest permission: "${p}"`);
    failed = true;
  }
}
console.log("✅ Manifest permissions verified.");

// 3. Output directories build checks
if (!fs.existsSync('dist/manifest.json')) {
  console.error("❌ dist/manifest.json does not exist. Rebuild required!");
  failed = true;
} else {
  console.log("✅ Production build output validated.");
}

if (failed) {
  process.exit(1);
} else {
  console.log("✅ BUILD VALIDATION COMPLETED SUCCESSFULLY.");
  process.exit(0);
}
