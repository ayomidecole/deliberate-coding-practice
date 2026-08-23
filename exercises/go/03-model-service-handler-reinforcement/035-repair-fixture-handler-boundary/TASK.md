# GO-035: Implement the Fixture Handler Boundary

Target time: 35–50 minutes  
Primary focus: independently reconstruct handler-to-service data flow

## Context

This endpoint has supplied DTOs, model, service, route, and HTTP tests:

```text
POST /competitions/:competitionID/fixtures

JSON + path → handler → FixtureService.ScheduleFixture → handler response
```

The service trims surrounding venue whitespace, rejects a blank normalized venue, rejects
identical teams, and returns a complete scheduled fixture. Read it before editing the
empty `ScheduleFixture` handler.

## HTTP contract

Request body:

```json
{
  "fixtureId": "fixture-606",
  "homeTeamId": "team-riverside",
  "awayTeamId": "team-united",
  "venue": "  Riverside Ground  "
}
```

| Outcome | Response |
|---|---|
| malformed JSON | `400 Bad Request`, `{"error":"invalid request"}` |
| `services.ErrSameTeam` | `422 Unprocessable Entity`, `{"error":"teams must differ"}` |
| `services.ErrVenueRequired` | `422 Unprocessable Entity`, `{"error":"venue is required"}` |
| success | `201 Created` with every field from the returned fixture |

## Your task

Implement `ScheduleFixture` in `handlers/fixture_handler.go`:

1. Bind JSON into the supplied request DTO. Malformed JSON returns the documented `400`
   response immediately.
2. Call `handler.service.ScheduleFixture` with the path parameter and request fields.
3. Translate both named service errors with `errors.Is`, writing the documented response
   and returning immediately.
4. Construct the success DTO from the returned fixture, including its normalized venue.

All tests are supplied. Do not change the model, service, or tests.

## Scope preflight

- **Demonstrated:** Gin binding, `c.Param`, service delegation, `errors.Is`, early returns,
  status codes, DTO projection, and reading HTTP tests.
- **Retrieval target:** independently reconstructing how handlers translate HTTP while
  services own business rules and returned application data.
- **New operations:** none.
- **Raised dimension:** from-scratch construction of one familiar handler method.
- **Test ownership:** fully supplied because these HTTP assertion patterns are already
  demonstrated.
- **Deferred:** new model/service implementation, persistence, interfaces, middleware,
  table-test authorship, goroutines, and channels.

Decision: **pass**. Production-code ownership increases while the familiar test harness is
fully supplied.

## Start and likely stuck point

Your first three edits are:

1. Declare a request DTO value and bind JSON into its address.
2. Call the service with `competitionID` from the path and the four body fields.
3. Translate both service errors before writing the success response.

The likely mistake is building success output from the request. The service result is the
authoritative output because it may differ from the raw input.

## Documentation

1. [Gin binding](https://gin-gonic.com/en/docs/binding/binding-and-validation/)
2. [Gin path parameters](https://gin-gonic.com/en/docs/routing/param-in-path/)
3. [Gin `Context`](https://pkg.go.dev/github.com/gin-gonic/gin#Context)
4. [Go `errors.Is`](https://pkg.go.dev/errors#Is)
5. [Go HTTP status constants](https://pkg.go.dev/net/http#pkg-constants)

## Verification

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/035-repair-fixture-handler-boundary/... -v
gofmt -w exercises/go/03-model-service-handler-reinforcement/035-repair-fixture-handler-boundary/{constants,handlers,models,services}/*.go
npm run check:go
```

## Completion criteria

- The handler binds the request and contains no fixture business validation.
- Both service errors map to the documented HTTP responses.
- Success uses every field from the service result.
- Focused and workspace-wide Go checks pass.

Ask for review when finished and disclose any documentation, old-code, or AI help used.
No written reflection is required.
