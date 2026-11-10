import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getMonorepoRoot } from "@/lib/content";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".txt": "text/plain; charset=utf-8",
};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const slugParts = params.slug || [];
  if (slugParts.length === 0) {
    return new NextResponse("File not found", { status: 404 });
  }

  const root = getMonorepoRoot();
  const mediaBaseDir = path.join(root, "media");

  // Prevent path traversal
  const targetPath = path.resolve(mediaBaseDir, ...slugParts);
  if (!targetPath.startsWith(mediaBaseDir)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
    return new NextResponse("File not found", { status: 404 });
  }

  const ext = path.extname(targetPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const fileBuffer = fs.readFileSync(targetPath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}

