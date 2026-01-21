import { readFile } from "fs/promises";
import { join } from "path";

export async function parseExposePort(dirPath: string): Promise<number> {
  const dockerfilePath = join(dirPath, "Dockerfile");
  const content = await readFile(dockerfilePath, "utf-8");

  const match = content.match(/^EXPOSE\s+(\d+)/m);

  if (!match) {
    throw new Error("No EXPOSE directive found in Dockerfile");
  }

  return parseInt(match[1], 10);
}
