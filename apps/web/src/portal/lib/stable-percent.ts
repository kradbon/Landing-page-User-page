export function stablePercent(seed: string, min = 70, max = 98) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const normalized = Math.abs(hash) % 1000;
  const percent = min + Math.round((normalized / 1000) * (max - min));
  return Math.max(min, Math.min(max, percent));
}

