import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface ToolMeta {
  name: string;
  description: string | null;
}

export function parseToolMeta(extractedPath: string): ToolMeta {
  const pkgPath = join(extractedPath, "package.json");

  if (!existsSync(pkgPath)) {
    return { name: "unnamed-tool", description: null };
  }

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return {
      name: pkg.name || "unnamed-tool",
      description: pkg.description || null,
    };
  } catch {
    return { name: "unnamed-tool", description: null };
  }
}
