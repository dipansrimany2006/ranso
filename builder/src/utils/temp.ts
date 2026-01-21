import { rm, mkdir } from "fs/promises";
import { join } from "path";

const TMP_DIR = join(process.cwd(), ".tmp");

export async function extractZip(id: string, zipFile: File): Promise<string> {
  const extractPath = join(TMP_DIR, id);
  await mkdir(extractPath, { recursive: true });

  // Write zip to temp file
  const zipPath = join(TMP_DIR, `${id}.zip`);
  await Bun.write(zipPath, zipFile);

  // Extract
  const proc = Bun.spawn(["unzip", "-o", "-d", extractPath, zipPath], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const exitCode = await proc.exited;
  const stderr = await new Response(proc.stderr).text();

  // Cleanup zip file after checking exit code
  if (exitCode !== 0) {
    await rm(zipPath, { force: true });
    throw new Error(`Failed to extract zip: ${stderr}`);
  }

  await rm(zipPath, { force: true });
  return extractPath;
}

export async function cleanup(id: string): Promise<void> {
  const extractPath = join(TMP_DIR, id);
  await rm(extractPath, { recursive: true, force: true });
}

export function getTmpPath(id: string): string {
  return join(TMP_DIR, id);
}
