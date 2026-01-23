# Axicov

Infrastructure layer for x402-enabled agentic systems on Cronos.

## What is Axicov?

Axicov provides the infrastructure for building, deploying, and monetizing AI tools using the x402 payment protocol on Cronos testnet. It enables autonomous AI agents to pay for and consume APIs with USDC micropayments embedded directly in HTTP requests.

## Architecture

```
client/              → Next.js frontend, Cronos wallet integration via Wagmi/Viem
builder/             → Hono API backend, Drizzle ORM + Neon Postgres
sdk/                 → x402 payment protocol SDK (@axicov/x402-cronos-sdk)
create-axicov-app/   → CLI scaffolder for new tools
```

## Quick Start

### Create a new tool

```bash
npx create-axicov-app my-tool
cd my-tool
bun run dev
```

### Run the platform locally

**Client:**
```bash
cd client && bun install && bun dev   # localhost:3000
```

**Builder:**
```bash
cd builder && bun install && bun dev  # localhost:3001
```

## How It Works

1. **Developers** build AI tools using the SDK with x402 payment middleware
2. **Tools** are deployed as Docker containers on MorphCloud
3. **Users/Agents** connect their Cronos wallet and pay USDC per API request
4. **Payments** are verified at the protocol level before tool access is granted

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

## License

MIT
