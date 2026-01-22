CREATE TABLE "api_keys" (
	"key" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chats" (
	"thread_id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"chats" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"api_url" text NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb,
	"price" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
