# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo for Axicov - x402 payment protocol marketplace for AI tools on Cronos testnet.

## Commands

**Client (Next.js frontend):**
```bash
cd client && bun install && bun dev   # localhost:3000
bun run build && bun start            # production
bun run lint                          # ESLint
```

**Builder (Hono backend):**
```bash
cd builder && bun install && bun dev  # localhost:3001
bun drizzle-kit generate              # generate migrations
bun drizzle-kit migrate               # run migrations
```

**SDK:**
```bash
cd sdk && bun build ./src/index.ts --outdir ./dist --target node && tsc --emitDeclarationOnly
```

## Architecture

```
client/     → Next.js 16 + React 19, Wagmi/Viem for Cronos wallet
builder/    → Hono API, Drizzle ORM + Neon Postgres, MorphCloud Docker deploy
sdk/        → x402 payment protocol wrapper (@crypto.com/facilitator-client)
create-axicov-app/  → CLI scaffolder for new tools
```

**Key flows:**
- Wallet address = user identity (owner field in DB)
- Tool deployment: ZIP upload → Docker build on MorphCloud → HTTP service exposed
- Payment: x402 middleware verifies USDC payments before tool access

**Database (builder/src/db/schema.ts):**
- `api_keys`: owner(wallet), key, name
- `tools`: owner, name, description, apiURL, price, images
- `chats`: owner, threadId, messages JSON array

**Frontend routes:**
- `/` home, `/explore` marketplace, `/dashboard` user tools, `/chats` chat history, `/chat/[id]` thread

## Conventions

- Routes → Controllers → Utils pattern in builder
- Container names: `{userId}_{uuid8}`
- Ports start at 1000
- API keys prefixed `axi_`
- USDC pricing (6 decimals)
- `"use client"` for React client components

## Environment Variables

**Builder:**
```
DATABASE_URL=
MORPH_API_KEY=
MORPH_INSTANCE_ID=
```

**Client:**
```
NEXT_PUBLIC_REOWN_PROJECT_ID=
```
