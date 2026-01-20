import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import type { InferRouteHandler } from "@remix-run/fetch-router";

import { routes } from "../routes.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "..", "dist");
const publicAssetsDir = path.join(publicDir, "assets");

// MIME type mapping
const mimeTypes: Record<string, string> = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".html": "text/html",
  ".txt": "text/plain",
};

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return mimeTypes[ext] || "application/octet-stream";
}

export const assets: InferRouteHandler<typeof routes.assets> = async ({
  params,
}) => {
  return serveFile(path.join(publicAssetsDir, params.path));
};

function serveFile(filename: string): Response {
  try {
    // Check if file exists
    if (!fs.existsSync(filename)) {
      return new Response("Not found", { status: 404 });
    }

    // Read file as buffer
    const buffer = fs.readFileSync(filename);
    const mimeType = getMimeType(filename);

    return new Response(buffer, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        "Content-Type": mimeType,
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    if (isNoEntityError(error)) {
      return new Response("Not found", { status: 404 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}

function isNoEntityError(
  error: unknown
): error is NodeJS.ErrnoException & { code: "ENOENT" } {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
