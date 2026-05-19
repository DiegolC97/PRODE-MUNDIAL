# PRODE MUNDIAL ⚽

A World Cup prediction pool built as a **Clean Architecture** monorepo.
Users submit score predictions for every match and earn points based on
a configurable scoring policy.

## Tech stack

| Concern         | Choice                                  |
| --------------- | --------------------------------------- |
| Frontend / BFF  | **Next.js 14** (App Router) + React 18  |
| Language        | **TypeScript** (strict)                 |
| Microservices   | Node.js + **Express** (3 services)      |
| Database        | **PostgreSQL 16**                       |
| Cache / pubsub  | **Redis 7** (via `ioredis`)             |
| Orchestration   | **Docker Compose**                      |
| Validation      | Zod                                     |
| Tests           | Jest + ts-jest                          |
| Lint / format   | ESLint + Prettier                       |

## Topology

```
┌─────────────────┐
│   Next.js BFF   │  http://localhost:3000
│   (web)         │
└────────┬────────┘
         │ HTTP
   ┌─────┼─────┬─────────────────┐
   ▼     ▼     ▼                 ▼
┌────────────┐ ┌──────────────────┐ ┌──────────────┐
│ matches-   │ │ predictions-     │ │ scoring-     │
│ service    │ │ service          │ │ service      │
│ :4001      │ │ :4002            │ │ :4003        │
└─────┬──────┘ └────────┬─────────┘ └──────┬───────┘
      │                 │                  │
      └─────┬───────────┴──────────────────┘
            ▼
     ┌──────────────┐      ┌──────────┐
     │ PostgreSQL   │      │  Redis   │
     │  :5432       │      │  :6379   │
     └──────────────┘      └──────────┘
```

All three microservices share the **same** clean architecture codebase
(`src/domain`, `src/application`, `src/infrastructure`). Each service is
just a different `interfaces/` entry point that wires a subset of use cases.

---

## Clean Architecture layers

The dependency rule is **absolute**: dependencies only point inward.

```
interfaces → application → domain
infrastructure → application → domain
```

### `src/domain/`
The heart of the system. Pure TypeScript, zero third-party imports.
- **entities/** — `Match`, `Prediction`, `Team`, `User` (with invariants enforced in their constructors)
- **value-objects/** — `Score`, `MatchStatus`
- **services/** — `ScoringPolicy` (pure scoring logic, configurable)
- **repositories/** — interfaces (`MatchRepository`, `PredictionRepository`, `UserRepository`) — **interfaces only, no implementations**
- **errors/** — domain-level exceptions (`EntityNotFoundError`, `BusinessRuleViolationError`)

### `src/application/`
Orchestrates the domain to fulfill use cases. Imports only from `domain/`.
- **use-cases/** — `SubmitPrediction`, `ListUpcomingMatches`, `ScoreMatchPredictions` (each is one class with an `execute(dto)` method)
- **dtos/** — input/output contracts for use cases
- **ports/** — abstractions the application needs from the outside world (`Clock`, `IdGenerator`, `CacheStore`)
- **mappers/** — domain ↔ DTO translation

### `src/infrastructure/`
All I/O lives here. Implements the interfaces defined upstream.
- **db/** — Postgres connection pool
- **repositories/** — `PgMatchRepository`, `PgPredictionRepository`, `PgUserRepository` (implement domain interfaces)
- **cache/** — `RedisCacheStore` (implements `CacheStore` port)
- **clock/**, **id/** — `SystemClock`, `UuidGenerator`
- **http/** — generic typed `ServiceClient` for inter-service calls
- **config/** — env-var access (the **only** place that reads `process.env`)
- **composition-root.ts** — wires everything into ready-to-use use case instances

### `src/interfaces/`
The thin outermost shell. Translates external input → use case call → response.
- **web/app/** — Next.js App Router (pages, API routes); also re-exported from `src/app/` so Next.js discovers them
- **services/matches-service/** — Express microservice for match listings
- **services/predictions-service/** — Express microservice for accepting predictions
- **services/scoring-service/** — Express microservice for closing out matches
- **services/shared/** — common Express bootstrap

---

## Getting started

### 1. Configure environment

```bash
cp .env.example .env
```

### 2. Install dependencies

```bash
npm install
```

### 3. Boot the whole stack with Docker

```bash
docker compose up --build
```

This brings up Postgres, Redis, the three microservices, and the Next.js BFF.
The `scripts/init.sql` schema is applied automatically on the first Postgres start.

- Web: <http://localhost:3000>
- Matches service: <http://localhost:4001/health>
- Predictions service: <http://localhost:4002/health>
- Scoring service: <http://localhost:4003/health>

### 4. Run locally without Docker (Postgres + Redis still required)

```bash
# in one terminal — keep Postgres and Redis up via Docker
docker compose up postgres redis

# apply schema
npm run db:migrate

# in separate terminals
npm run service:matches
npm run service:predictions
npm run service:scoring
npm run dev          # Next.js BFF
```

---

## Try it out

```bash
# List upcoming matches via the Next.js BFF
curl http://localhost:3000/api/matches

# List upcoming matches directly from the microservice
curl http://localhost:4001/matches/upcoming?limit=5

# Submit a prediction
curl -X POST http://localhost:3000/api/predictions \
  -H 'content-type: application/json' \
  -d '{
    "userId": "00000000-0000-0000-0000-000000000001",
    "matchId": "00000000-0000-0000-0000-000000000002",
    "predictedHome": 2,
    "predictedAway": 1
  }'

# Close out a match and score every prediction for it
curl -X POST http://localhost:4003/matches/<matchId>/score \
  -H 'content-type: application/json' \
  -d '{ "finalHome": 2, "finalAway": 1 }'
```

---

## Scripts

| Command                 | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Next.js dev server                          |
| `npm run build`         | Production build                            |
| `npm run start`         | Run the production build                    |
| `npm run lint`          | ESLint (enforces layer-boundary rules)      |
| `npm run format`        | Prettier write                              |
| `npm run type-check`    | `tsc --noEmit`                              |
| `npm test`              | Jest                                        |
| `npm run db:migrate`    | Apply `scripts/init.sql` to `DATABASE_URL`  |
| `npm run service:*`     | Run an individual microservice with ts-node |

---

## Layer-boundary enforcement

The `.eslintrc.json` `no-restricted-imports` rules **fail the lint step** if:

- `domain/` imports from `application/`, `infrastructure/`, or `interfaces/`
- `application/` imports from `infrastructure/` or `interfaces/`
- `infrastructure/` imports from `interfaces/`

In addition, every layer has a `CLAUDE.md` documenting its contract. **Do not edit
those files casually** — they are the source of truth for the architecture.

---

## Project structure

```
.
├── CLAUDE.md                     # global architecture contract
├── architecture.json             # machine-readable layer rules
├── docker-compose.yml
├── docker/
│   ├── Dockerfile.web
│   └── Dockerfile.service
├── scripts/
│   ├── init.sql
│   └── migrate.js
├── src/
│   ├── app/                      # Next.js entry — re-exports from interfaces/
│   ├── domain/                   # entities, VOs, repo interfaces, domain services
│   ├── application/              # use cases, DTOs, ports, mappers
│   ├── infrastructure/           # Postgres, Redis, repos, env, composition root
│   └── interfaces/
│       ├── web/                  # Next.js pages + API routes
│       └── services/             # Express microservices
└── tests/                        # Jest tests
```
