import { morphClient } from "../utils/morph/client";
import { touchTTL } from "../utils/morph/ttl";
import { transferDir } from "../utils/morph/fileTransfer";
import { getNextPort } from "../utils/morph/port";
import { extractZip, cleanup } from "../utils/temp";
import { getUserId } from "../utils/user";
import { parseExposePort } from "../utils/dockerfile";

interface DeployResult {
  containerId: string;
  url: string;
  port: number;
  buildOutput: string;
  status: "deployed" | "failed";
}

export async function deploy(
  instanceId: string,
  zipFile: File,
  apiKey?: string
): Promise<DeployResult> {
  const userId = getUserId(apiKey);
  const id = crypto.randomUUID().slice(0, 8);
  const containerId = `${userId}_${id}`;
  let localPath = "";

  try {
    // 1. extract zip
    localPath = await extractZip(id, zipFile);

    // 2. parse EXPOSE port from Dockerfile
    const exposePort = await parseExposePort(localPath);

    // 3. get instance and resume if paused
    let instance = await morphClient.instances.get({ instanceId });

    const status = instance.status?.toLowerCase();
    if (status === "paused" || status === "pausing" || status === "stopped") {
      await instance.resume();
      // wait for instance to be ready
      for (let i = 0; i < 60; i++) {
        instance = await morphClient.instances.get({ instanceId });
        const newStatus = instance.status?.toLowerCase();
        if (newStatus === "running" || newStatus === "ready") {
          break;
        }
        if (i === 59) {
          throw new Error(`Instance failed to resume. Status: ${instance.status}`);
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    // 4. transfer files
    const remotePath = `/app/${containerId}`;
    await transferDir(instance, localPath, remotePath);

    // 5. get next available host port
    const hostPort = await getNextPort(instance);

    // 6. docker build
    const buildResult = await instance.exec(
      `cd ${remotePath} && docker build -t ${containerId} .`
    );

    if (buildResult.exit_code !== 0) {
      return {
        containerId,
        url: "",
        port: 0,
        buildOutput: buildResult.stderr || buildResult.stdout || "Build failed",
        status: "failed",
      };
    }

    // 7. docker run
    const runResult = await instance.exec(
      `docker run -d -p ${hostPort}:${exposePort} --name ${containerId} ${containerId}`
    );

    if (runResult.exit_code !== 0) {
      return {
        containerId,
        url: "",
        port: hostPort,
        buildOutput: `Build OK. Run failed: ${runResult.stderr}`,
        status: "failed",
      };
    }

    // 8. expose HTTP service
    const { url } = await instance.exposeHttpService(containerId, hostPort);

    // 9. reset TTL
    await touchTTL(instance, 300);

    // 10. cleanup temp
    await cleanup(id);

    return {
      containerId,
      url,
      port: hostPort,
      buildOutput: buildResult.stdout || "Build successful",
      status: "deployed",
    };
  } catch (err) {
    // cleanup on error
    if (localPath) {
      await cleanup(id).catch(() => {});
    }
    throw err;
  }
}
