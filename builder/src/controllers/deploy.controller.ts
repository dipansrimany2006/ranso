import { morphClient } from "../utils/morph/client";
import { touchTTL } from "../utils/morph/ttl";
import { transferDir } from "../utils/morph/fileTransfer";
import { getNextPort } from "../utils/morph/port";
import { extractZip, cleanup } from "../utils/temp";
import { parseExposePort } from "../utils/dockerfile";
import { parseToolMeta } from "../utils/parseToolMeta";
import { parsePrice } from "../utils/parsePrice";
import { db } from "../db";
import { tools } from "../db/schema";

interface DeployResult {
  containerId: string;
  url: string;
  port: number;
  buildOutput: string;
  status: "deployed" | "failed";
  toolId?: string;
}

export async function deploy(
  instanceId: string,
  zipFile: File,
  ownerWallet: string,
  envVars: Record<string, string> = {},
): Promise<DeployResult> {
  const id = crypto.randomUUID().slice(0, 8);
  const containerId = `${ownerWallet.slice(0, 8)}_${id}`.toLocaleLowerCase();
  let localPath = "";

  try {
    // 1. extract zip
    localPath = await extractZip(id, zipFile);

    // 2. parse tool metadata from package.json
    const toolMeta = parseToolMeta(localPath);
    const price = parsePrice(localPath);

    // 3. parse EXPOSE port from Dockerfile
    const exposePort = await parseExposePort(localPath);

    // 4. get instance and resume if paused
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
          throw new Error(
            `Instance failed to resume. Status: ${instance.status}`,
          );
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
      `cd ${remotePath} && docker build -t ${containerId} .`,
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
    const envFlags = Object.entries(envVars)
      .map(([k, v]) => `-e ${k}="${v.replace(/"/g, '\\"')}"`)
      .join(" ");
    const runResult = await instance.exec(
      `docker run -d -p ${hostPort}:${exposePort} ${envFlags} --name ${containerId} ${containerId}`,
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

    // 8.5 fetch schema from running tool
    let inputSchema = null;
    let outputSchema = null;
    let schemaPrice = null;

    // Wait for container startup
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const schemaRes = await fetch(`${url}/schema`, {
        signal: AbortSignal.timeout(5000),
      });
      if (schemaRes.ok) {
        const data = await schemaRes.json() as {
          inputSchema?: object;
          outputSchema?: object;
          price?: number;
        };
        inputSchema = data.inputSchema ?? null;
        outputSchema = data.outputSchema ?? null;
        schemaPrice = data.price ?? null;
      }
    } catch {
      // Old SDK or no schema - continue with parsed price
    }

    // 9. reset TTL
    await touchTTL(instance, 300);

    // 10. cleanup temp
    await cleanup(id);

    // 11. save tool to DB (use schemaPrice if available, else parsed price)
    const toolId = crypto.randomUUID();
    await db.insert(tools).values({
      id: toolId,
      owner: ownerWallet,
      name: toolMeta.name,
      description: toolMeta.description,
      apiURL: url,
      images: [],
      price: schemaPrice ?? price,
      inputSchema,
      outputSchema,
    });

    return {
      containerId,
      url,
      port: hostPort,
      buildOutput: buildResult.stdout || "Build successful",
      status: "deployed",
      toolId,
    };
  } catch (err) {
    // cleanup on error
    if (localPath) {
      await cleanup(id).catch(() => {});
    }
    throw err;
  }
}
