# GO-021: Create Jobs Through an Injected Store

Target time: 35–50 minutes  
Primary focus: connect an HTTP handler to shared application state

## Scope preflight

- **Known:** Gin `POST` routes, JSON binding and responses, HTTP status constants,
  `errors.Is`, DTO structs, early returns, and calling store methods.
- **Demonstrated:** translating a request into a domain value and mapping a named error to
  an HTTP response.
- **New but guided:** injecting one `*JobStore` into a handler so every request uses the
  same store instance.
- **Supplied:** handler struct, store field, router wiring, route, JSON types, malformed
  request branch, and complete HTTP test infrastructure.
- **Deferred:** interfaces, GET routes, learner-authored HTTP tests, validation tags,
  databases, middleware, goroutines, channels, and locking.

Decision: **pass**. Shared dependency state is the only new operation.

## Concept

The application creates the store once and passes its pointer into the router:

```text
*JobStore
    ↓
NewRouter(store)
    ↓
JobHandler stores the same pointer
    ↓
every POST request calls handler.store.Add(...)
```

This is constructor injection: a component receives its dependency when it is created.
The supplied `JobHandler` does not create its own store and does not use a global variable.
That lets tests and future application setup choose the store while the handler focuses on
HTTP translation.

## Why it matters

Real handlers usually depend on services or persistence components. Passing dependencies
in explicitly makes ownership visible, preserves state across requests, and makes the
boundary testable. This task connects the store from GO-020 to Gin without adding an
interface or database before the concrete relationship is understood.

## Public HTTP contract

`POST /api/jobs` accepts:

```json
{
  "id": "email-digest",
  "requiredWorkers": 2
}
```

| Outcome | HTTP response |
|---|---|
| malformed JSON | `400 Bad Request` and `{"error":"invalid request"}` |
| duplicate job ID | `409 Conflict` and `{"error":"job already exists"}` |
| job added | `201 Created` and the created job JSON |

On success, the same job must be observable through the injected store. A rejected
duplicate must leave the original stored job unchanged.

Assume successfully decoded requests contain a non-empty ID and a positive
`requiredWorkers`. Field validation is out of scope.

## Your responsibility

Work only in `createJob` in `job_handler.go`. The malformed-JSON branch is complete.
Replace the placeholder after it.

Your handler must:

- convert the request DTO into `jobstore.Job`;
- call `handler.store.Add`;
- use `errors.Is` to identify `jobstore.ErrDuplicateJob`;
- return immediately after the duplicate response;
- return the supplied `jobResponseJSON` shape on success.

Read the tests before coding. One test sends two requests through the same router to prove
that the injected store keeps state between requests.

## Constraints

- Do not modify the router, supplied types, constructor wiring, route, or tests.
- Do not create another store inside the handler.
- Do not inspect or modify the store's private slice.
- Do not reproduce duplicate-detection logic in the handler.
- Do not call `c.JSON` more than once on any request path.
- Do not add interfaces, globals, validation rules, middleware, databases, files,
  goroutines, channels, mutexes, or third-party packages.

## Documentation

- [Gin: dependency injection patterns](https://gin-gonic.com/en/docs/middleware/dependency-injection/)
- [Gin: binding](https://gin-gonic.com/en/docs/binding/)
- [`Context.JSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.JSON)
- [`errors.Is`](https://pkg.go.dev/errors#Is)
- [Gin: testing](https://gin-gonic.com/en/docs/testing/) — infrastructure is supplied

## Commands

Run the focused suite before editing and while working:

```sh
go test ./exercises/go/02-service-handler-boundaries/021-create-job-api-with-store -v
```

Before requesting review:

```sh
gofmt -w exercises/go/02-service-handler-boundaries/021-create-job-api-with-store
npm run check:go
```

## Acceptance criteria

- Malformed JSON follows the supplied `400` contract.
- A successful request adds exactly one job to the injected store and returns `201`.
- A second request with the same ID returns `409`.
- Duplicate rejection preserves the original job and store count.
- Focused and repository-wide checks pass.

## When you are done

Ask for a code review. No written reflection is required.
