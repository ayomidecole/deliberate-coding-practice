# GO-031: Expose a Job Admission API

Target time: 30–45 minutes  
Primary focus: independently retrieve handler sequencing

## Goal

Implement a Gin handler for a supplied job-admission service and author the successful
HTTP test.

```text
constants/   admitted and queued statuses
models/      AdmissionDecision
services/    supplied admission decision
handlers/    HTTP translation and routing
```

## Mental model

```text
request JSON → handler DTO → service call → model result → response JSON
```

The handler translates and delegates. Call `handler.service.DecideAdmission`; never call
the handler method from inside itself.

## Your task

Implement `decideAdmission` in `handlers/admission_handler.go`.

Request:

```json
{
  "jobId": "job-401",
  "requiredWorkers": 3,
  "availableWorkers": 5
}
```

Contract:

| Outcome | Response |
|---|---|
| malformed JSON | `400 Bad Request`, `{"error":"invalid request"}` |
| `services.ErrInvalidWorkerRequirement` | `422 Unprocessable Entity`, `{"error":"invalid worker requirement"}` |
| service result | `200 OK` with job ID, required workers, available workers, and status |

Use `errors.Is` for the service error and return after each error response. Build the
success response from the returned `models.AdmissionDecision`.

Then author `TestDecideAdmissionReturnsQueuedDecision` in
`handlers/admission_handler_test.go`. Send a valid request with fewer available workers
than required and assert the complete `200` response. The request helper and decoder are
supplied, but the test body is yours.

## Scope preflight

- **Guided and being retrieved:** bind, translate, delegate, map error, translate result.
- **Retrieved:** Gin APIs, DTO/model conversion, `errors.Is`, early returns, and handler
  test helpers.
- **New operations:** none.
- **Raised dimension:** less implementation scaffolding than GO-030.
- **Test ownership:** **starter plus one learner-authored success test**.
- **Deferred:** persistence, middleware, interfaces, table-driven tests, configuration,
  goroutines, and channels.

Decision: **pass**. This retrieves one guided capability with fewer branches and no new
boundary.

## Start and verification

Begin with request binding. After successful binding, call the supplied service with the
three request fields. Use the returned decision only after handling its error.

```sh
go test ./exercises/go/031-expose-job-admission-api/... -v
```

Before review:

```sh
gofmt -w exercises/go/031-expose-job-admission-api
npm run check:go
```

## Documentation

- [Gin: model binding](https://gin-gonic.com/en/docs/binding/)
- [Gin `Context.JSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.JSON)
- [Go `errors.Is`](https://pkg.go.dev/errors#Is)
- [Go `httptest`](https://pkg.go.dev/net/http/httptest)

## Completion criteria

- Every request path writes one response.
- The handler delegates the decision to the service.
- The success response uses the service result.
- Your queued-decision test asserts status and the full decoded body.
- Focused and repository-wide checks pass.

Ask for a review when finished and disclose any documentation or AI help used. No written
reflection is required.
