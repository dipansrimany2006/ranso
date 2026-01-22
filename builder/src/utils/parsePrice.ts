import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

// Searches source files for price config
// Patterns: price: 0.02, price: 0.5, PRICE = 0.02, etc.
const PRICE_PATTERNS = [
  /price:\s*([\d.]+)/i,
  /price\s*=\s*([\d.]+)/i,
  /["']price["']\s*:\s*([\d.]+)/i,
];

function searchFile(filePath: string): number | null {
  try {
    const content = readFileSync(filePath, "utf-8");
    for (const pattern of PRICE_PATTERNS) {
      const match = content.match(pattern);
      if (match && match[1]) {
        const price = parseFloat(match[1]);
        if (!isNaN(price) && price > 0) {
          return price;
        }
      }
    }
  } catch {
    // ignore read errors
  }
  return null;
}

function walkDir(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, files);
    } else if (/\.(ts|js|tsx|jsx)$/.test(entry)) {
      files.push(fullPath);
    }
  }
  return files;
}

export function parsePrice(extractedPath: string): number {
  const srcPath = join(extractedPath, "src");
  const searchPaths = [srcPath, extractedPath];

  for (const basePath of searchPaths) {
    try {
      const files = walkDir(basePath);
      for (const file of files) {
        const price = searchFile(file);
        if (price !== null) {
          return price;
        }
      }
    } catch {
      // dir doesn't exist, try next
    }
  }

  // Default price if not found
  return 0;
}
