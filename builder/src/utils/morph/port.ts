import type { Instance } from "morphcloud";

const START_PORT = 1000;

export async function getNextPort(instance: Instance): Promise<number> {
  const result = await instance.exec(
    "docker ps --format '{{.Ports}}' | grep -oE '0\\.0\\.0\\.0:[0-9]+' | cut -d: -f2 | sort -n"
  );

  const usedPorts = new Set<number>();

  if (result.stdout) {
    const lines = result.stdout.trim().split("\n");
    for (const line of lines) {
      const port = parseInt(line, 10);
      if (!isNaN(port)) {
        usedPorts.add(port);
      }
    }
  }

  let port = START_PORT;
  while (usedPorts.has(port)) {
    port++;
  }

  return port;
}
