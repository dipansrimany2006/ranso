import { pgTable, text, timestamp, real, jsonb } from "drizzle-orm/pg-core";

export const apiKeys = pgTable("api_keys", {
  key: text("key").primaryKey(), // hashed axi_xxxx
  owner: text("owner").notNull(), // wallet address
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tools = pgTable("tools", {
  id: text("id").primaryKey(), // uuid
  owner: text("owner").notNull(), // wallet address
  name: text("name").notNull(),
  description: text("description"),
  apiURL: text("api_url").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  price: real("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chats = pgTable("chats", {
  threadId: text("thread_id").primaryKey(),
  owner: text("owner").notNull(),
  chats: jsonb("chats").$type<any[]>().default([]),
});
