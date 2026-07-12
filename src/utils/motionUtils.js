function classifyMotion(transition, animation, transform, filter) {
  const value = `${transition} ${animation} ${transform} ${filter}`.toLowerCase();
  const effects = [];
  if (/opacity|fade/.test(value)) effects.push("fade");
  if (/scale/.test(value)) effects.push("scale");
  if (/translate|transform/.test(value)) effects.push("transform");
  if (/blur/.test(value)) effects.push("blur");
  if (/shadow/.test(value)) effects.push("elevation");
  return effects.length ? effects : ["property transition"];
}

function parseDurations(value) {
  return (value.match(/[\d.]+m?s/g) || []).map((duration) => duration.endsWith("ms") ? Number.parseFloat(duration) : Number.parseFloat(duration) * 1000);
}

export function extractMotion(elements) {
  const map = new Map();
  const durations = [];
  for (const element of elements) {
    const transition = element.styles.transition;
    const animation = element.styles.animation;
    if ((!transition || transition === "all 0s ease 0s") && (!animation || animation === "none 0s ease 0s 1 normal none running")) continue;
    const value = `${transition || ""}${animation && !animation.startsWith("none") ? `; ${animation}` : ""}`;
    if (!value.trim()) continue;
    parseDurations(value).forEach((duration) => { if (duration > 0) durations.push(duration); });
    const entry = map.get(value) || {
      value,
      transition,
      animation: animation?.startsWith("none") ? "" : animation,
      usageCount: 0,
      roles: new Set(),
      effects: classifyMotion(transition, animation, element.styles.transform, element.styles.filter),
    };
    entry.usageCount += 1;
    entry.roles.add(element.role);
    map.set(value, entry);
  }
  const motion = [...map.values()].sort((a, b) => b.usageCount - a.usageCount).slice(0, 14).map((entry) => ({ ...entry, roles: [...entry.roles].slice(0, 5) }));
  const median = durations.length ? durations.sort((a, b) => a - b)[Math.floor(durations.length / 2)] : 0;
  const personality = !motion.length ? "Mostly static with little explicit motion" : median <= 220 ? "Crisp, responsive micro-interactions" : "Measured, expressive transitions";
  return { items: motion, commonDurations: [...new Set(durations)].sort((a, b) => a - b).slice(0, 8), personality };
}
