import type { Instance } from "morphcloud";
import { readdir, stat } from "fs/promises";
import { join } from "path";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadFile(
  sftp: any,
  localPath: string,
  remotePath: string
): Promise<void> {
  const content = await Bun.file(localPath).arrayBuffer();
  return new Promise((resolve, reject) => {
    const writeStream = sftp.createWriteStream(remotePath);
    writeStream.on("close", resolve);
    writeStream.on("error", reject);
    writeStream.end(Buffer.from(content));
  });
}

async function mkdirRemote(sftp: any, remotePath: string): Promise<void> {
  // Create parent directories recursively
  const parts = remotePath.split("/").filter(Boolean);
  let currentPath = "";

  for (const part of parts) {
    currentPath += "/" + part;
    await new Promise<void>((resolve) => {
      sftp.mkdir(currentPath, (err: Error | null) => {
        // Ignore errors (dir may already exist)
        resolve();
      });
    });
  }
}

async function uploadDirRecursive(
  sftp: any,
  localDir: string,
  remoteDir: string
): Promise<void> {
  await mkdirRemote(sftp, remoteDir);

  const entries = await readdir(localDir);

  for (const entry of entries) {
    const localPath = join(localDir, entry);
    const remotePath = `${remoteDir}/${entry}`;
    const entryStat = await stat(localPath);

    if (entryStat.isDirectory()) {
      await uploadDirRecursive(sftp, localPath, remotePath);
    } else {
      await uploadFile(sftp, localPath, remotePath);
    }
  }
}

export async function transferDir(
  instance: Instance,
  localPath: string,
  remotePath: string
): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const ssh = await instance.ssh();
      const sftp = await ssh.requestSFTP();
      await uploadDirRecursive(sftp, localPath, remotePath);
      ssh.dispose();
      return;
    } catch (err) {
      lastError = err as Error;
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY * attempt);
      }
    }
  }

  throw new Error(`SFTP transfer failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}
