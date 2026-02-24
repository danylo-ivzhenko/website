import { mkdir, writeFile, unlink, rm } from "node:fs/promises";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const STORAGE_DIR = path.join(PUBLIC_DIR, "storage");

/**
 * Ensure the base storage directories exist.
 */
export async function ensureStorageDirs() {
  await mkdir(path.join(STORAGE_DIR, "logos"), { recursive: true });
}

/**
 * Create a studio folder immediately.
 * Called when a new studio is created.
 */
export async function createStudioFolder(studioName: string) {
  const folderName = `${studioName} Studio`;
  const dirPath = path.join(STORAGE_DIR, folderName);
  await mkdir(dirPath, { recursive: true });
}

/**
 * Save a studio logo to public/storage/logos/{name}_studio.{ext}
 * Returns the URL path (relative to public).
 */
export async function saveStudioLogo(
  file: File,
  studioName: string
): Promise<string> {
  await ensureStorageDirs();

  const ext = file.name.split(".").pop() || "png";
  const safeName = studioName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  const fileName = `${safeName}_studio.${ext}`;
  const filePath = path.join(STORAGE_DIR, "logos", fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/storage/logos/${fileName}`;
}

/**
 * Save series images to public/storage/{StudioName} Studio/
 * Returns an array of URL paths.
 */
export async function saveSeriesImages(
  files: File[],
  studioName: string
): Promise<string[]> {
  const folderName = `${studioName} Studio`;
  const dirPath = path.join(STORAGE_DIR, folderName);
  await mkdir(dirPath, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() || "png";
    // Sanitize: replace spaces and special chars with underscores
    const baseName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");
    const fileName = `${baseName}_serial.${ext}`;
    const filePath = path.join(dirPath, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // No encodeURIComponent — the folder/file names are already sanitized
    urls.push(`/storage/${folderName}/${fileName}`);
  }

  return urls;
}

/**
 * Delete a file from the public directory given its URL path.
 */
export async function deleteFile(urlPath: string): Promise<void> {
  const filePath = path.join(PUBLIC_DIR, urlPath);
  try {
    await unlink(filePath);
  } catch {
    // File may already be deleted — ignore
  }
}

/**
 * Delete the entire studio folder from public/storage/{StudioName} Studio/
 */
export async function deleteStudioFolder(studioName: string): Promise<void> {
  const folderName = `${studioName} Studio`;
  const dirPath = path.join(STORAGE_DIR, folderName);
  try {
    await rm(dirPath, { recursive: true, force: true });
  } catch {
    // Folder may not exist — ignore
  }
}
