export function stablePercent(seed: string, min: number, max: number) {
  const clampedMin = Math.min(min, max);
  const clampedMax = Math.max(min, max);
  const range = clampedMax - clampedMin + 1;
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return clampedMin + (hash % range);
}

