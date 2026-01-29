export function initials(name?: string) {
  if (!name) return "B";
  const parts = name.trim().split(/\s+/);
  if (!parts.length) return "B";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`.toUpperCase();
}

