export function initials(name: string) {
  const parts = name
    .split(' ')
    .map((p) => p.trim())
    .filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}

