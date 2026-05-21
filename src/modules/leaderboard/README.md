# leaderboard

Ranking aggregation and public leaderboard reads.

## Layers

- `domain/` — entities, value objects, domain services, repository interfaces
- `application/` — use cases, DTOs, ports
- `infrastructure/` — adapters that implement ports (DB, HTTP, cache, …)
- `presentation/` — route handlers, server components, controllers

The dependency rule is enforced module-locally: `presentation` and
`infrastructure` may depend on `application` and `domain`;
`application` depends only on `domain`; `domain` depends on nothing.
