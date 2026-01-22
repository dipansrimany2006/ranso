import { randomBytes, createHash } from "crypto";
import { db } from "../db";
import { apiKeys } from "../db/schema";
import { eq } from "drizzle-orm";

const adjectives = ["swift", "bright", "clever", "bold", "calm", "keen", "quick", "wise"];
const nouns = ["wolf", "hawk", "lion", "bear", "fox", "eagle", "tiger", "owl"];

function generateRandomName(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}-${noun}-${num}`;
}

function generateApiKey(): string {
  const random = randomBytes(24).toString("base64url");
  return `axi_${random}`;
}

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export async function createApiKey(walletAddress: string, name?: string) {
  const keyName = name || generateRandomName();
  const rawKey = generateApiKey();
  const hashedKey = hashKey(rawKey);

  await db.insert(apiKeys).values({
    key: hashedKey,
    owner: walletAddress,
    name: keyName,
  });

  // Return raw key only once - user must save it
  return { key: rawKey, name: keyName };
}

export async function validateApiKey(rawKey: string) {
  const hashedKey = hashKey(rawKey);
  const result = await db.select().from(apiKeys).where(eq(apiKeys.key, hashedKey)).limit(1);
  return result[0] || null;
}

export async function getApiKeysByWallet(walletAddress: string) {
  const result = await db
    .select({ name: apiKeys.name, createdAt: apiKeys.createdAt })
    .from(apiKeys)
    .where(eq(apiKeys.owner, walletAddress));
  return result;
}
