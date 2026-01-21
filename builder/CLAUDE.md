# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install        # install deps
bun run dev        # run with hot reload on localhost:3000
```

## Architecture

Docker-to-MorphCloud deployment API. Accepts ZIP files with Dockerfiles, builds images on remote VM, runs containers.

```
src/
├── index.ts              # Hono app, mounts routes
├── routes/               # HTTP endpoints
├── controllers/          # Business logic
└── utils/
    ├── morph/            # MorphCloud SDK wrappers (client, SFTP, TTL, port)
    ├── temp.ts           # ZIP extraction to .tmp/
    ├── dockerfile.ts     # Parse EXPOSE port
    └── user.ts           # User ID lookup (TODO: implement DB)
```

## Deploy Flow

1. Extract ZIP → `.tmp/{id}/`
2. Parse Dockerfile EXPOSE port
3. Resume instance if paused (polls 60s)
4. SFTP transfer with 3 retries
5. `docker build` on instance
6. `docker run -p {hostPort}:{exposePort}`
7. Expose via MorphCloud HTTP service
8. Reset TTL (5 min sliding)
9. Cleanup temp files

## Environment

```
MORPH_API_KEY=
MORPH_INSTANCE_ID=
```

## Conventions

- Routes call controllers, controllers use utils
- SFTP creates remote dirs recursively (ignores "already exists")
- Ports start at 1000, increment based on `docker ps`
- Container names: `{userId}_{uuid8}`
