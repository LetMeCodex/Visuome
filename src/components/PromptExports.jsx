import { useMemo, useState } from "react";
import { Section } from "./Section";
import Icon from "./Icon";

const TABS = [
  ["figmaPrompt", "Figma"],
  ["reactTailwindPrompt", "React / Tailwind"],
  ["v0CursorLovablePrompt", "v0 / Cursor / Lovable"],
  ["imageGenerationPrompt", "Image Gen"],
  ["designSystemPrompt", "Design System"],
  ["authorizedRecreationPrompt", "Authorized Recreation"],
  ["originalInspirationPrompt", "Original Inspiration"],
];

export default function PromptExports({ prompts, onCopy }) {
  const [active, setActive] = useState(TABS[0][0]);
  const prompt = prompts[active] || "";
  const activeLabel = useMemo(() => TABS.find(([key]) => key === active)?.[1], [active]);
  return (
    <Section id="export-lab" icon="flask" title="Export Lab">
      <div className="prompt-tabs" role="tablist" aria-label="Prompt formats">{TABS.map(([key, label]) => <button type="button" key={key} role="tab" aria-selected={active === key} onClick={() => setActive(key)}>{label}</button>)}</div>
      <div className="prompt-editor">
        <label htmlFor="generated-prompt">{activeLabel} prompt</label>
        <textarea id="generated-prompt" value={prompt} readOnly spellCheck="false" />
        <button type="button" className="prompt-copy" onClick={() => onCopy(prompt, `${activeLabel} prompt copied`)}><Icon name="copy" size={16} /> Copy prompt</button>
      </div>
      <p className="export-note"><Icon name="shield" size={15} /> Every output includes the authorization and original-inspiration safety boundary.</p>
    </Section>
  );
}
