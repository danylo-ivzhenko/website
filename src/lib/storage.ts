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
 * Uses hyphens instead of spaces for safer URLs.
 */
export async function createStudioFolder(studioName: string) {
  const folderName = `${studioName.replace(/\s+/g, "-")}-Studio`;
  const dirPath = path.join(STORAGE_DIR, folderName);
  await mkdir(dirPath, { recursive: true });
}

/**
 * Save a studio logo.
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
 * Save series images.
 */
export async function saveSeriesImages(
  files: File[],
  studioName: string
): Promise<string[]> {
  const folderName = `${studioName.replace(/\s+/g, "-")}-Studio`;
  const dirPath = path.join(STORAGE_DIR, folderName);
  await mkdir(dirPath, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() || "png";
    const baseName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");
    const fileName = `${baseName}_serial.${ext}`;
    const filePath = path.join(dirPath, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    urls.push(`/storage/${folderName}/${fileName}`);
  }

  return urls;
}

/**
 * Delete a file.
 */
export async function deleteFile(urlPath: string): Promise<void> {
  const filePath = path.join(PUBLIC_DIR, urlPath);
  try {
    await unlink(filePath);
  } catch {
    // Ignore
  }
}

/**
 * Delete the entire studio folder.
 */
export async function deleteStudioFolder(studioName: string): Promise<void> {
  const folderName = `${studioName.replace(/\s+/g, "-")}-Studio`;
  const dirPath = path.join(STORAGE_DIR, folderName);
  try {
    await rm(dirPath, { recursive: true, force: true });
  } catch {
    // Ignore
  }
}
