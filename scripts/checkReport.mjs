import assert from "node:assert/strict";
import { createPreviewReport } from "../src/utils/previewData.js";
import { SAFETY_LINE } from "../src/utils/promptGenerator.js";

const report = createPreviewReport();
const requiredTopLevel = ["page", "classification", "designTokens", "layout", "components", "scorecard", "prompts", "debug"];
const requiredPrompts = ["figmaPrompt", "reactTailwindPrompt", "v0CursorLovablePrompt", "imageGenerationPrompt", "designSystemPrompt", "authorizedRecreationPrompt", "originalInspirationPrompt"];

requiredTopLevel.forEach((key) => assert.ok(report[key], `Missing report.${key}`));
requiredPrompts.forEach((key) => {
  assert.ok(report.prompts[key]?.length > 300, `${key} is not sufficiently detailed`);
  assert.ok(report.prompts[key].includes(SAFETY_LINE), `${key} is missing the ethical-use safety line`);
});
assert.ok(report.prompts.authorizedRecreationPrompt.includes("recreate the visual structure closely using the extracted design tokens, but replace protected brand assets, text, and images unless authorized"), "Authorized recreation boundary is missing");
assert.ok(report.prompts.originalInspirationPrompt.includes("Create an original interface inspired by these design principles without copying exact assets, text, logos, or protected layout"), "Original inspiration boundary is missing");
assert.ok(report.designTokens.colors.corePalette.length > 0, "No color tokens were extracted");
assert.ok(report.components.cards.length > 0, "No card system was extracted");
assert.ok(report.debug.limitations.some((item) => item.includes("No form values")), "Privacy limitation is missing");

console.log(`✓ Report schema: ${requiredTopLevel.length} top-level groups`);
console.log(`✓ Prompt safety: ${requiredPrompts.length} detailed outputs include the required boundary`);
console.log(`✓ Token extraction: ${report.designTokens.colors.corePalette.length} core colors, ${report.components.cards.length} card treatment(s)`);
