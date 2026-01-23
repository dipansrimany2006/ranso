#!/usr/bin/env node
import { execSync } from "child_process";
import { cpSync, readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import prompts from "prompts";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function getLatestVersion(pkg: string): Promise<string> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`);
    const data = await res.json();
    return data.version || "latest";
  } catch {
    return "latest";
  }
}

async function main() {
  const args = process.argv.slice(2);
  let projectName = args[0];

  console.log("\n🚀 create-axicov-app\n");
  console.log("📡 Fetching latest SDK version...");

  if (!projectName) {
    const res = await prompts({
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: "my-axicov-app",
    });
    projectName = res.projectName;
  }

  if (!projectName) {
    console.log("❌ Project name required");
    process.exit(1);
  }

  const { runtime } = await prompts({
    type: "select",
    name: "runtime",
    message: "Runtime:",
    choices: [
      { title: "Bun", value: "bun" },
      { title: "Node", value: "node" },
    ],
  });

  if (!runtime) {
    console.log("❌ Cancelled");
    process.exit(1);
  }

  const { walletAddress } = await prompts({
    type: "text",
    name: "walletAddress",
    message: "Dev wallet address (enter to skip):",
    initial: "",
  });

  const wallet = walletAddress || "0x0000000000000000000000000000000000000000";

  const { description } = await prompts({
    type: "text",
    name: "description",
    message: "Tool description:",
    initial: "",
  });

  const targetDir = join(process.cwd(), projectName);

  if (existsSync(targetDir)) {
    console.log(`❌ Directory ${projectName} already exists`);
    process.exit(1);
  }

  // Fetch latest SDK version
  const sdkVersion = await getLatestVersion("@axicov/x402-cronos-sdk");
  console.log(`   Found v${sdkVersion}\n`);

  // Copy template
  const templateDir = join(__dirname, "..", "template");
  cpSync(templateDir, targetDir, { recursive: true });

  // Update .env with wallet
  const envPath = join(targetDir, ".env.example");
  let envContent = readFileSync(envPath, "utf-8");
  envContent = envContent.replace("DEV_WALLET=", `DEV_WALLET=${wallet}`);
  writeFileSync(envPath, envContent);

  // Copy .env.example to .env
  writeFileSync(join(targetDir, ".env"), envContent);

  // Remove template package.json (we'll generate fresh)
  const pkgPath = join(targetDir, "package.json");
  if (existsSync(pkgPath)) unlinkSync(pkgPath);

  // Generate package.json with latest SDK version
  const pkg: Record<string, any> = {
    name: projectName,
    version: "0.0.1",
    description: description || "",
    type: "module",
    scripts: {
      dev: "bun run --watch src/index.ts",
      start: "bun run src/index.ts",
      deploy: "bun run scripts/deploy.ts",
    },
    dependencies: {
      "@axicov/x402-cronos-sdk": `^${sdkVersion}`,
      zod: "^3.24.0",
    },
    devDependencies: {
      "@types/node": "^22.0.0",
      typescript: "^5.0.0",
      archiver: "^7.0.0",
      "@types/archiver": "^6.0.0",
    },
  };
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  // Update Dockerfile based on runtime
  const dockerfilePath = join(targetDir, "Dockerfile");
  let dockerfile = readFileSync(dockerfilePath, "utf-8");
  if (runtime === "node") {
    dockerfile = dockerfile
      .replace("FROM oven/bun:1", "FROM node:22-alpine")
      .replace("bun install", "npm install")
      .replace('CMD ["bun", "run", "src/index.ts"]', 'CMD ["npx", "tsx", "src/index.ts"]');
  }
  writeFileSync(dockerfilePath, dockerfile);

  // Update template package.json scripts based on runtime
  if (runtime === "node") {
    pkg.scripts = {
      dev: "npx tsx watch src/index.ts",
      start: "npx tsx src/index.ts",
      deploy: "npx tsx scripts/deploy.ts",
    };
    pkg.devDependencies = pkg.devDependencies || {};
    pkg.devDependencies.tsx = "^4.0.0";
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }

  console.log(`\n📁 Created ${projectName}/`);
  console.log("📦 Installing dependencies...\n");

  // Install deps
  const installCmd = runtime === "bun" ? "bun install" : "npm install";
  execSync(installCmd, { cwd: targetDir, stdio: "inherit" });

  console.log("\n✅ Done!\n");
  console.log(`  cd ${projectName}`);
  console.log(`  ${runtime === "bun" ? "bun run dev" : "npm run dev"}\n`);
}

main().catch(console.error);
