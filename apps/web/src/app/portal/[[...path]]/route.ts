import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf"
};

function resolvePortalRoot() {
  const cwd = process.cwd();
  const direct = path.join(cwd, "public", "portal");
  const fallback = path.join(cwd, "apps", "web", "public", "portal");
  return fs
    .access(direct)
    .then(() => direct)
    .catch(() => fallback);
}

async function readFileIfExists(filePath: string) {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) return null;
    return fs.readFile(filePath);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const portalRoot = await resolvePortalRoot();
  const url = new URL(request.url);
  const relPath = url.pathname.replace(/^\/portal\/?/, "");
  const requested = relPath ? relPath.split("/").filter(Boolean) : [];
  const filePath = path.join(portalRoot, ...requested);
  const fallbackPath = path.join(portalRoot, "index.html");

  const file = requested.length ? await readFileIfExists(filePath) : null;
  const finalPath = file ? filePath : fallbackPath;
  const data = file ?? (await fs.readFile(fallbackPath));
  const ext = path.extname(finalPath).toLowerCase();
  const contentType = contentTypes[ext] || "application/octet-stream";

  return new NextResponse(data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
