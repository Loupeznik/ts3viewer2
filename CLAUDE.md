# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TS3Viewer2 is a full-stack TeamSpeak3 server management platform with a .NET 10 REST API backend and React 19/TypeScript frontend. It supports optional TS3AudioBot integration and Firebase Cloud Messaging notifications.

## Build & Development Commands

### Backend (.NET)

```bash
# Restore and build the solution
dotnet restore src/DZarsky.TS3Viewer2.sln
dotnet build src/DZarsky.TS3Viewer2.sln -c Release

# Run the API (from repo root)
dotnet run --project src/DZarsky.TS3Viewer2.Api

# Publish for deployment
dotnet publish src/DZarsky.TS3Viewer2.Api -c Release

# Generate EF Core migration bundle
dotnet ef migrations bundle --startup-project src/DZarsky.TS3Viewer2.Api --project src/DZarsky.TS3Viewer2.Data --self-contained -r linux-x64
```

The backend uses a custom NuGet feed for the forked TeamSpeak3QueryApi package. Add it with:
```bash
dotnet nuget add source https://nuget.dzarsky.eu/v3/index.json --name nuget.dzarsky.eu
```

### Frontend (React/TypeScript)

All commands run from `src/DZarsky.TS3Viewer2.Web/`:

```bash
npm install              # Install dependencies
npm start                # Dev server (Vite 6, port 5173)
npm run build            # Production build (tsc + vite)
npm run build:prod       # Build with .env.production
npm run build:test       # Build with .env.test
npm run build:development # Build with .env.development (used by Docker Compose)
npm run types:openapi    # Regenerate OpenAPI client (requires API running on localhost:5274)
```

### Docker Compose (Local Development)

```bash
docker compose up        # Start all services (TeamSpeak, API, Web)
docker compose build     # Rebuild images
```

Services: `teamspeak` (port 9987/udp, 10011, 30033), `api` (port 20800), `web` (port 20801).

The API uses `RUN_MIGRATIONS=true` env var to auto-run EF Core migrations on startup. After first run, retrieve the `react-app` secret from the database and set it in `src/DZarsky.TS3Viewer2.Web/.env.development` as `VITE_APP_SECRET`:

```bash
docker compose cp api:/app/data/ts3viewer2.db /tmp/ts3viewer2.db
sqlite3 /tmp/ts3viewer2.db "SELECT Secret FROM Users WHERE Login='react-app';"
```

The `Security__Jwt__Key` env var must be a base64-encoded RSA JWK (RS256 algorithm — hardcoded in `TokenProvider.cs`). See README.md for generation instructions.

### CI/CD

Azure Pipelines (`azure-pipelines.yml`) triggers on `master`. Uses .NET 10.x SDK and Node.js 24.x on Windows runner. Builds API, generates EF migration bundle, builds frontend for test and production environments, publishes artifacts, and creates GitHub releases.

## Architecture

### Backend - Layered Architecture

```
Api → Core → Domain
 ↓
Data (EF Core)
```

- **Api** (`DZarsky.TS3Viewer2.Api`): ASP.NET Core controllers, JWT auth middleware, DI configuration (`Program.cs`). Controllers: Server, User, Client, Channel, File, AudioBot.
- **Core** (`DZarsky.TS3Viewer2.Core`): Business logic services for AudioBot, Files, Server, and Users.
- **Domain** (`DZarsky.TS3Viewer2.Domain`): Domain models, DTOs, and service interfaces.
- **Data** (`DZarsky.TS3Viewer2.Data`): EF Core with SQLite. DbContext, entity configurations, and migrations.

Key patterns: Dependency Injection, AutoMapper for DTO mapping, BCrypt for password hashing, JWT Bearer authentication with `UserAuthorizationPolicy` and `ServerAdminPolicy`.

### Frontend

- **Build**: Vite 6 + TypeScript 5 + Tailwind CSS v4 + Flowbite
- **API client**: Auto-generated from OpenAPI spec (`src/api/`) via `openapi-typescript-codegen`
- **Routing**: React Router v7 — main pages (`/status`, `/connect`, `/upload`, `/bot`) and admin section (`/admin/channels`, `/admin/clients`, `/admin/files`, `/admin/server`, `/admin/users`)
- **PWA**: Service worker via `vite-plugin-pwa`
- **Error tracking**: Sentry v8 (disabled in development via env vars)

### Configuration

Backend config is in `src/DZarsky.TS3Viewer2.Api/appsettings.json` — TeamSpeak server connection, AudioBot URL, JWT settings, CORS origins, Sentry, SQLite connection string.

Frontend env vars (`VITE_API_BASE_URL`, `VITE_SENTRY_DSN`, `VITE_SENTRY_ENABLED`, `VITE_TS3_HOST`, `VITE_APP_LOGIN`, `VITE_VERSION`) are in `.env.development`, `.env.production`, `.env.test`.

## Local Development Setup

A running TeamSpeak3 server is required. Use `docker compose up` for the easiest setup, or run the TeamSpeak server standalone:
```bash
docker run -d -p 9987:9987/udp -p 10011:10011 -p 30033:30033 -e TS3SERVER_LICENSE=accept teamspeak
```

Ensure `127.0.0.1`, `::1`, and `172.17.0.1` are in the server's `query_ip_allowlist.txt`. Copy server query credentials into `appsettings.json` after first run.

For Docker Compose, the `query_ip_allowlist.txt` at repo root (mounted into the container) allows all IPs (`0.0.0.0/0`) for development. The custom NuGet feed (`nuget.dzarsky.eu`) requires `--allow-insecure-connections` flag due to HTTP redirects — this is already configured in the API Dockerfile.

## Tools Directory

- `tools/fcm_notifier/`: Python Firebase Cloud Messaging notifier service
- `tools/check_version.sh`: Version checking script
- `tools/install_keep_alive_cron.sh`: Cron job to keep TS3 query connection alive
- `tools/prepare_env_deb.sh`: Debian environment setup
