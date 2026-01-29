"use client";

import { ThemeTokens } from "@/shared/types/landing";

export function ThemeProvider({ theme, children }: { theme?: ThemeTokens; children: React.ReactNode }) {
  const style: React.CSSProperties = {
    ["--color-primary" as any]: theme?.primary || "15 23 42",
    ["--color-secondary" as any]: theme?.secondary || "14 116 144",
    ["--color-background" as any]: theme?.background || "248 250 252",
    ["--color-text" as any]: theme?.text || "15 23 42",
    ["--radius-theme" as any]: theme?.radius || "16px",
    ["--font-display" as any]: theme?.fontDisplay || "Fraunces",
    ["--font-body" as any]: theme?.fontBody || "Manrope",
    ["--spacing-density" as any]: theme?.spacing === "compact" ? "0.85" : "1"
  };

  return <div style={style}>{children}</div>;
}
