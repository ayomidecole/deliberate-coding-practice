# API design with Hono

Goal: choose, implement, verify, evolve, and operate HTTP contracts that consumers can
rely on. TypeScript/Hono supports the design work. Refresh individual implementation
skills where needed before combining them; Go experience does not establish Hono fluency.

## Start

API-001 through [API-010](01-hono-foundations/010-build-training-groups-api/TASK.md)
are complete. API-010 passed eight tests/typecheck and a live response check:
model/domain logic was correct; response wrapping needed guidance. Tests were supplied.
[API-011](01-hono-foundations/011-add-training-group-summary/TASK.md) is complete:
twelve tests/typecheck/live HTTP passed. Handler/routes were correct; service needed
length-property and branch guidance. Related handlers share one resource file.
[API-012](01-hono-foundations/012-return-training-group-ids/TASK.md) is complete:
fifteen tests/typecheck and both live responses passed. Map needed targeted guidance;
handler response construction was correct without correction.
[API-013](01-hono-foundations/013-read-club-query/TASK.md) is complete: nine tests,
typecheck, and live HTTP passed. Query/service/response correct with supplied fallback.
[API-014](01-hono-foundations/014-diagnose-club-selection/TASK.md) is complete:
learner repaired the service argument without follow-up hints; nine tests/typecheck/live HTTP passed.
Dependencies and checks are isolated from the other tracks. Node 22+ is required.

## Layout and ownership

Use `<numbered-arc>/<numbered-exercise>/` beneath this folder. Create arc folders when
work begins. Use focused exercises for individual capabilities, then combine working
pieces in integration tasks. Reuse or rebuild code according to the learning target.
Keep each API's implementation inside its exercise folder; copy completed code when
needed rather than importing another exercise. Shared tooling stays at this root.

Start with [Arc 01: Building blocks of a Hono API](01-hono-foundations/README.md).
Models → domain → services → handlers → app wiring → startup → combined API practice →
basic persistence and local PostgreSQL. Introduce boundaries separately, then practice
them together in complete features with fading guidance.

Use `src/models/` for record types, `src/domain/` for business objects/invariants,
`src/services/` for application operations, `src/handlers/` for HTTP translation with
nearby private DTOs, `src/app.ts` for routes, and `src/server.ts` for startup.
Group related handlers in a resource file, such as `handlers/training-groups.ts`.
A temporary `seed.ts` contains sample records, not a layer.
Colocate tests: `models/club.typecheck.ts`, `domain/club.test.ts`,
`services/club-service.test.ts`, `handlers/club-profile.test.ts`, and `app.test.ts` beside
their corresponding source. Add layers when the task practices their responsibility;
an individual-part exercise does not need all these folders.

The learner writes feature/app implementation; routine server launchers are supplied.
The tutor explains, supplies focused docs, and
reviews code. Tests are tutor-written by default at the learner's request; the learner
owns behavior/case judgment, assertion review, execution, and diagnosis. Manual test
authorship is not a routine requirement. Supply tooling and worked examples when needed.
The eleven-arc design curriculum remains.

## Provisional curriculum

Each arc contains multiple scoped tasks. Reduce guidance based on evidence; introduce
one unfamiliar boundary at a time. Small client examples and contract tests expose the
consequences of design choices. No mandatory design essays or post-task quizzes.

1. **Building blocks and runnable Hono APIs.** Follow the introductory arc linked above.
   Practice individual layers, wire a first endpoint, then extend and independently set up
   small changed APIs with fading guidance. Move to resource-design choices only after
   running, testing, changing, and diagnosing an API are comfortable. Add a persistence
   component and basic local PostgreSQL wiring through separate checkpoints; prove a
   write survives restarting the API, then repeat in a changed feature. Broader request
   inputs and middleware enter when needed, not as prerequisites to the first runnable API.
2. **Resource modeling and boundaries.** Consumer workflows, identity, relationships,
   ownership, collections, nesting, embedding/references, business actions, and public
   versus internal representations. Implement a chosen design and exercise its client flow.
3. **Contracts and polymorphism.** Missing/null/optional fields, units/dates/precision,
   enums, runtime validation, request/response models, discriminated variants, composition
   versus inheritance, and useful interfaces. Reject invalid combinations and exercise a
   consumer. Study public variants separately from interchangeable internal behavior.
4. **HTTP semantics, errors, and state.** Safe/idempotent operations, create/replace/patch/
   delete, IDs, statuses/headers, consistent errors, state transitions, and failure atomicity.
   Build on the stored workflows introduced in Arc 01.
5. **Collections and queries.** Filtering/search, ordering, limits, offset/cursor pagination,
   tie-breaking, continuation tokens, totals, SQL/indexes, and changing data. Prove behavior
   through a client traversing results.
6. **Reliable writes and asynchronous operations.** Retries, idempotency keys, duplicates,
   concurrent/conditional updates, transactions, bulk/partial success, long-running jobs,
   polling, and webhook delivery. After relational practice, use DynamoDB Local for a bounded
   workflow: access patterns, keys/indexes, conditional writes, consistency, pagination.
   Compare API guarantees rather than maintaining two complete backends. NoSQL Workbench
   views DynamoDB; TablePlus is optional for PostgreSQL. MongoDB is not required.
7. **Security and resource protection.** Identity boundaries, resource/tenant authorization,
   sensitive fields, writable fields, request limits, rate limits, CORS/CSRF where relevant.
   Supply initial identity plumbing; verify negative access cases.
8. **Compatibility and evolution.** Structural/semantic changes, new variants/enums,
   defaults, versioning, deprecation, migration, coexistence, and consumer contract tests.
   Introduce OpenAPI when it helps describe/check contracts; Swagger UI is optional.
9. **Performance and budgets.** Measurement, queries, response size, bounded work, timeouts,
   HTTP caching/ETags, invalidation, freshness, and private/shared cache behavior. Use local
   load tests and measured problems.
10. **Observability and diagnosis.** Structured logs, request/trace correlation, sensitive
    data, OpenTelemetry, rates/errors/latency/dependencies, metric cardinality, objectives,
    dashboards, alerts. Diagnose controlled failures locally; basic logs may appear earlier.
11. **Production readiness, delivery, and operations.** Render deployment plus configuration,
    secrets, startup checks, timeouts/shutdown, health/readiness; hosted dependencies,
    least privilege, networking/TLS, migrations, backups and restore; CI/security checks,
    reproducible builds, deployment gates/environments; compatible releases, smoke tests,
    rollback and irreversible migration handling; telemetry/alerts, capacity/connections/
    costs; incident mitigation/recovery, dependency updates, secret rotation, deprecation,
    and concise operational instructions. Demonstrate design through release, observation,
    and recovery from a controlled failure.

All earlier arcs run locally, including databases and telemetry tools. Routine local
container setup is supplied where outside the target; hosted deployment and operations
belong to Arc 11. Preserve Go's separate PostgreSQL progression.
