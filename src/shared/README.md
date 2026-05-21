# Shared

Cross-cutting code that is module-agnostic and safe to import from any module.

Suggested sub-folders (create as needed):

- `contracts/` — published DTOs and event payloads exchanged between modules
- `errors/` — base error classes used across modules
- `result/` — `Result<T, E>` and similar functional helpers
- `types/` — global utility TypeScript types
- `config/` — configuration helpers (env parsing, feature flags)

Anything placed here MUST NOT import from `src/modules/*`. Modules import
from `@/shared/*`, never the other way around.
