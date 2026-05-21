# Modules (Modular Monolith)

This directory hosts the **modular monolith** organization of PRODE MUNDIAL.
Each module is a vertical slice of the product and owns its own four
Clean Architecture layers:

```
src/modules/<module>/
├── domain/          # entities, value objects, domain services, repository interfaces
├── application/     # use cases, DTOs, ports
├── infrastructure/  # DB / HTTP / cache adapters (implementations)
└── presentation/    # route handlers, server components, controllers
```

## Modules

| Module              | Responsibility                                                 |
| ------------------- | -------------------------------------------------------------- |
| `auth`              | Sign-up, login, sessions, password reset                       |
| `users`             | User profiles, preferences                                     |
| `matches`           | Tournament fixture, teams, match schedule                      |
| `predictions`       | User predictions for upcoming matches                          |
| `scoring`           | Scoring policy, point assignment after results are in          |
| `leaderboard`       | Ranking aggregation and public leaderboard reads               |
| `results-ingestion` | Importing official match results from external sources         |
| `notifications`     | Outbound notifications (email, push) on key user-facing events |

## Dependency rule (inside a module)

The Clean Architecture rule applies INSIDE each module exactly as it does
project-wide:

```
presentation → application → domain
infrastructure → application → domain
```

- `domain/` imports nothing outside its own module's `domain/`
- `application/` imports only its `domain/` and the `@/shared/*` ports
- `infrastructure/` implements ports declared in `domain/` or `application/`
- `presentation/` orchestrates use cases — no business logic

## Cross-module communication

Modules MUST NOT reach into another module's `domain/`, `application/`,
or `infrastructure/` directly. Cross-module collaboration goes through:

1. Published contracts in `@/shared/contracts/*` (DTOs, events), or
2. The other module's `presentation/` public API (e.g. a function exported
   from `modules/<other>/presentation/index.ts`).

This keeps modules independently refactorable and extractable into separate
services later if needed.
