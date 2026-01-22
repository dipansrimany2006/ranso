import { createWriteStream, unlinkSync, existsSync, readFileSync } from "fs";
import { createInterface } from "readline";
import archiver from "archiver";

const BUILDER_URL = process.env.BUILDER_URL || "http://localhost:3000";

function parseEnvFile(): Record<string, string> {
  if (!existsSync(".env")) return {};
  const content = readFileSync(".env", "utf-8");
  const envVars: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && key !== "BUILDER_URL") {
      envVars[key] = rest.join("=");
    }
  }
  return envVars;
}

async function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function zipProject(): Promise<string> {
  const zipPath = "deploy.zip";
  const output = createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on("close", () => resolve(zipPath));
    archive.on("error", reject);

    archive.pipe(output);
    archive.glob("**/*", {
      ignore: ["node_modules/**", ".git/**", ".env", "*.zip", "deploy.zip"],
    });
    archive.finalize();
  });
}

async function deploy() {
  if (!existsSync("Dockerfile")) {
    console.error("Not a valid project (missing Dockerfile)");
    process.exit(1);
  }

  const apiKey = await prompt("Enter API key: ");
  if (!apiKey) {
    console.error("API key required");
    process.exit(1);
  }

  console.log("Zipping project...");
  const zipPath = await zipProject();

  console.log("Deploying...");
  const zipBuffer = readFileSync(zipPath);
  const envVars = parseEnvFile();
  const form = new FormData();
  form.append("zipFile", new Blob([zipBuffer]), "deploy.zip");
  form.append("envVars", JSON.stringify(envVars));

  const res = await fetch(`${BUILDER_URL}/deploy`, {
    method: "POST",
    headers: { "X-API-KEY": apiKey },
    body: form,
  });

  const data = await res.json();

  unlinkSync(zipPath);

  if (data.status === "deployed") {
    console.log(`\nDeployed: ${data.url}`);
  } else {
    console.error(`\nFailed: ${data.buildOutput || data.error}`);
    process.exit(1);
  }
}

deploy();
