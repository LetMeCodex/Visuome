import { CopyButton, Section } from "./Section";

export default function MotionDNA({ tokens, onCopy }) {
  const motion = tokens.motion;
  return (
    <Section icon="motion" title="Motion DNA" action={<CopyButton label="Copy motion" onClick={() => onCopy(JSON.stringify(motion, null, 2), "Motion tokens copied")} />}>
      <div className="motion-summary">
        <div><span className="motion-wave" aria-hidden="true" /><p className="field-label">Motion personality</p><h3>{tokens.motionPersonality}</h3></div>
        <div className="duration-chips">{tokens.motionDurations.length ? tokens.motionDurations.map((duration) => <span key={duration}>{duration}ms</span>) : <span>Static</span>}</div>
      </div>
      {motion.length ? <div className="motion-list">{motion.slice(0, 8).map((item) => <article key={item.value}><div><strong>{item.effects.join(" + ")}</strong><span>{item.roles.join(", ")}</span></div><code>{item.transition || item.animation}</code><em>{item.usageCount}×</em></article>)}</div> : <p className="muted-empty">No explicit transition or animation was exposed in the computed resting state.</p>}
    </Section>
  );
}
