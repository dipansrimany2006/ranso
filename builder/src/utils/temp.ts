import { unlink, rm, mkdir } from "fs/promises";
import { join } from "path";
import { Glob } from "bun";

const TMP_DIR = join(import.meta.dir, "../../.tmp");

export async function extractZip(id: string, zipFile: File): Promise<string> {
  const extractPath = join(TMP_DIR, id);
  await mkdir(extractPath, { recursive: true });

  const zipBuffer = await zipFile.arrayBuffer();
  const zipBlob = new Blob([zipBuffer]);

  // Use Bun's native unzip
  const proc = Bun.spawn(["unzip", "-o", "-d", extractPath, "-"], {
    stdin: new Response(zipBlob).body,
  });

  await proc.exited;

  if (proc.exitCode !== 0) {
    throw new Error("Failed to extract zip file");
  }

  return extractPath;
}

export async function cleanup(id: string): Promise<void> {
  const extractPath = join(TMP_DIR, id);
  await rm(extractPath, { recursive: true, force: true });
}

export function getTmpPath(id: string): string {
  return join(TMP_DIR, id);
}
