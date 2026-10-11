# Arc 01: Building blocks of a Hono API

## Goal

Become comfortable building, running, testing, and changing small layered APIs yourself.
Refresh TypeScript construction before introducing Hono. This arc prepares for API-design
decisions; it does not replace the later design curriculum.

Use Go's progression as a guide: a business operation first, its HTTP adapter next,
then runnable application wiring. Do not copy Go syntax or assume framework fluency.

## Learning sequence

These are stages, not one exercise each or a fixed completion schedule. Assign only the
next scoped exercise after reviewing evidence. Start with models, not a whole API.

| Stage | Learner practice | Responsibility and verification |
|---|---|---|
| 1. Models | Write a small record type and construct values from a precise contract. | `models/` describes data shape; compiler checks establish shape, not runtime validity. Supply the type-check harness. |
| 2. Domain | Construct a valid business value and enforce one rule, then retrieve that construction in a changed example. | `domain/` owns invariants. Supply focused runtime tests initially. Explain the constructor/function syntax before requiring it. |
| 3. Services | Implement one operation using the model/domain work already practiced. | `services/` owns the use case; it has no Hono context, HTTP statuses, or listener. Test inputs and outcomes directly. |
| 4. Handlers | Translate one service outcome into a documented HTTP response. Later add a request input or failure outcome separately. | `handlers/` owns HTTP translation, not duplicate business rules. Supply initial Hono routing/test infrastructure and explain context and returned responses. |
| 5. App wiring | Create the Hono app and register an already-working handler for a method/path. | `app.ts` composes routes and dependencies. Verify requests against the app without starting a network listener. |
| 6. Server startup | Run the tested app with the supplied Node server launcher and call it with Hoppscotch. | `server.ts` owns listening. Learner owns app wiring, running, ports, and live checks; revisit startup code when configuration/lifecycle introduces meaningful decisions. |
| 7. First complete API | Connect the practiced parts into one endpoint, then change its behavior. | Verify the service, HTTP contract, and live request. This is the first full pass, not graduation from the arc. |
| 8. Runnable API fluency | Extend a working API with a distinct endpoint; later set up a small changed API from a lighter scaffold. | Practice startup, route registration, live calls, request tests, and a simple diagnosis with fading guidance. Vary the problem rather than repeat a near-identical GET. |
| 9. Basic persistence and PostgreSQL | Introduce a persistence component, then connect a local database in separate tasks. | Supply local setup and unfamiliar test infrastructure. Write/read through the API, inspect storage, and retrieve the record after restarting the API. |
| 10. Combined stored API practice | Build or extend a small API with its layers, startup, and storage together. | Check implementation, changes, tests, and diagnosis with documentation; fade guidance from evidence. Deeper transactions, indexing, and NoSQL remain later. |

Models describe shape; domain code protects valid business values; services perform an
application operation. These are responsibilities, not a requirement for duplicate classes
or pass-through functions. Introduce `constants/` only for a real shared value set, not as
an extra layer or standalone busywork exercise.

At runtime, a request flows through the app to a handler, which calls a service; the
service uses domain values/rules. Models and constants support that code rather than being
additional request-processing steps. The server starts the application; it does not own
business rules.

## How each exercise works

- The learner writes the target code, including individual layers. Reuse their working
  code when adding a boundary; use a small independent rebuild when testing transfer.
- Each API is self-contained inside its exercise folder. Copy prior work for reuse;
  do not import implementation across exercise folders. Share only project tooling.
- Combined feature work becomes the main practice after introducing the boundaries.
  Use focused exercises to address specific gaps and repeat through changed problems.
- `TASK.md` contains the problem, exact observable behavior, edit location, layer purpose,
  a focused syntax explanation when needed, official docs beside that part, and commands.
  State what to build without prescribing a familiar algorithm line by line.
  Also include the selected documentation links directly in the assignment message.
- Start with a concrete first edit. Teach unfamiliar construction with a small annotated
  example that does not solve the assigned behavior. Do not send the learner through a
  chain of unexplained imports or preimplemented feature layers.
- Scope-preflight every assignment against current evidence: required operations,
  assistance, first three edits, likely stuck point, and raised difficulty dimension.
  The arc table is not proof that prerequisites have been mastered.
- Supply tests by default at the learner's request. Learner ownership means judging
  cases, reviewing assertions, running checks, and diagnosing failures—not routine typing.
- Colocate tests: domain tests in `domain/`, service tests in `services/`, handler tests
  in `handlers/`, and app tests beside `app.ts`. No separate exercise `tests/` directory.
- Review code and execution, record help accurately, and retrieve assisted skills later.
  No mandatory post-task questions or written reflections. Confusion before a meaningful
  attempt triggers a scope/guidance audit, not more stacked hints.

No fixed exercise count. Do enough varied runnable-API repetitions to show that setup no
longer consumes the learner's attention: they can assemble the layers, run the server,
make a live request, test a response, change an endpoint, and diagnose a simple failure
with decreasing help and access to documentation. One working endpoint alone is not that
evidence. Include basic database wiring before moving into design arcs. Keep advanced
database guarantees, auth, middleware, deployment, and generic/type machinery for later.

## Official references

Each task will select the relevant section, not assign this whole reading list.

- Models: [TypeScript object types](https://www.typescriptlang.org/docs/handbook/2/objects.html).
- Domain construction: [TypeScript classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
  and [functions](https://www.typescriptlang.org/docs/handbook/2/functions.html), according to the chosen exercise pattern.
- Handlers: [Hono context and JSON responses](https://hono.dev/docs/api/context#json).
- App wiring: [Hono routing](https://hono.dev/docs/api/routing).
- Request tests: [Hono testing](https://hono.dev/docs/guides/testing).
- Startup: [Hono on Node.js](https://hono.dev/docs/getting-started/nodejs).

API-001 through [API-008](008-build-home-fixtures-api/TASK.md) are complete.
API-008 combined service, handler, and app wiring; five tests, typecheck, and live
HTTP checks passed. Filter callbacks, response objects, and exports needed guidance;
retrieve these before adding another framework operation.
[API-009](009-diagnose-away-fixtures/TASK.md) is complete: learner repaired the
callback, tutor wrote the requested regression test; five tests/typecheck/live checks passed.
[API-010](010-build-training-groups-api/TASK.md) is complete: eight tests/typecheck
passed and the live response matched. Model/domain logic was correct; response wrapping
needed guidance. Put expected JSON beside handler instructions in subsequent tasks.
[API-011](011-add-training-group-summary/TASK.md) adds a count service, summary handler, and second route. Tests and launcher are supplied.
