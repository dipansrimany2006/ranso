import { db } from "../db";
import { tools } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getAllTools() {
  return db
    .select({
      id: tools.id,
      name: tools.name,
      description: tools.description,
      price: tools.price,
    })
    .from(tools);
}

export async function getToolById(id: string) {
  const result = await db.select().from(tools).where(eq(tools.id, id)).limit(1);
  if (!result[0]) return null;
  return { ...result[0], images: result[0].images ?? [] };
}
