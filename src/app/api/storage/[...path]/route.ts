import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";

/* Possible locations where storage files may live */
const CANDIDATE_DIRS = [
  path.join(process.cwd(), "public", "storage"),   // normal / dev
  "/app/public/storage",                            // Docker absolute
];

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

/** Try to find the file in one of the candidate directories */
async function resolveFile(segments: string[]): Promise<string | null> {
  for (const base of CANDIDATE_DIRS) {
    const resolved = path.join(base, ...segments);
    // Security: prevent path traversal
    if (!resolved.startsWith(base)) continue;
    try {
      await stat(resolved);
      return resolved;
    } catch {
      // not in this directory, try next
    }
  }
  return null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const filePath = await resolveFile(segments);

  if (!filePath) {
    return NextResponse.json(
      { error: "Not found", tried: CANDIDATE_DIRS.map(d => path.join(d, ...segments)) },
      { status: 404 }
    );
  }

  try {
    const buffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Read error" }, { status: 500 });
  }
}
