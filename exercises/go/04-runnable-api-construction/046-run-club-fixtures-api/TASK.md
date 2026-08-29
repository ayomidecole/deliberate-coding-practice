# GO-046: Run a Club Fixtures API

Target time: 70–90 minutes  
Primary focus: compose collection and item retrieval in one runnable API

## API contract

Implement two related endpoints:

```text
GET /clubs/:clubID/fixtures
GET /clubs/:clubID/fixtures/:fixtureID
```

The collection endpoint returns every fixture belonging to the requested club, in source
order. No matches is a successful empty collection:

```text
200 OK
[]
```

The item endpoint returns the fixture only when both path IDs match. If it cannot find
that resource, return:

```text
404 Not Found
{"error":"fixture not found"}
```

A successful fixture uses this JSON shape:

```json
{
  "id": "fixture-6101",
  "clubId": "club-1101",
  "opponentName": "Lisbon Athletic",
  "venue": "Estadio Central",
  "kickoff": "2026-09-12T19:00:00Z",
  "status": "scheduled"
}
```

## Mental model

Both routes expose the same resource through different questions:

```text
one fixture source
    → one FixtureService
    → one FixtureHandler
    → collection method or item method
    → two routes on one Gin engine
```

`newRouter` is the composition root: it creates each shared dependency once and connects
both handler methods to the router. The handler translates HTTP input and output; the
service owns filtering and lookup.

## Your task

Work in dependency order.

### 1. Model

In `models/fixture.go`, define `Fixture` from the successful JSON object. Use exported Go
fields without JSON tags.

### 2. Service

In `services/fixture_service.go`, define:

```go
type FixtureService struct {
    // private fixtures slice
}

func NewFixtureService(fixtures []models.Fixture) *FixtureService

func (service *FixtureService) ListFixtures(clubID string) []models.Fixture

func (service *FixtureService) FindFixture(
    clubID string,
    fixtureID string,
) (models.Fixture, error)
```

Retain the constructor input. `ListFixtures` filters by `ClubID`, preserves source order,
and returns a non-nil empty slice when nothing matches. `FindFixture` requires both IDs to
match; return the matching fixture and `nil`, or an empty fixture with the supplied
`ErrFixtureNotFound`. Do not mutate the source slice.

### 3. Handler

In `handlers/fixture_handler.go`, define `FixtureHandler`, its constructor, and:

```go
func (handler *FixtureHandler) ListFixtures(c *gin.Context)
func (handler *FixtureHandler) GetFixture(c *gin.Context)
```

`ListFixtures` reads `clubID`, calls the service once, maps the result with the supplied
collection mapper, and returns `200 OK`.

`GetFixture` reads both path parameters and calls the service once. Use `errors.Is` to map
`ErrFixtureNotFound` to the documented `404`, then return. If any other error reaches the
handler, return `500 Internal Server Error`. On success, use the supplied single-fixture
mapper and return `200 OK`.

### 4. Composition root

In `cmd/api/main.go`, define:

```go
func newRouter(fixtures []models.Fixture) *gin.Engine
```

Inside it:

1. construct one `FixtureService` from `fixtures`;
2. inject that service into one `FixtureHandler`;
3. create a Gin engine;
4. register both exact GET routes with the appropriate handler methods;
5. return the engine.

`main` and seed data are supplied. Imports are supplied in the unfinished files; their
temporary unused warnings disappear as you implement them. Constants, the sentinel error,
response mapping, and all test infrastructure are also supplied.

## Scope preflight

- **Known:** derive a model from JSON; retain a slice in a service; filter with `range` and
  `append`; look up by two IDs; return a sentinel error; read path parameters; map DTOs;
  use `errors.Is`; return JSON and early-return after errors.
- **Demonstrated:** implement a collection flow, implement an item flow, construct a
  service and handler, register a GET method, return a Gin engine, and run it through the
  supplied `main`.
- **New composition demand:** register both related flows against the same service and
  handler instances. This adds no new Go or Gin operation.
- **Held constant:** GET only; no request body, query string, mutation, persistence,
  middleware, route groups, or learner-authored test harness.
- **Supplied:** routine imports, status constants, error declaration, DTO mapping, seed
  data, startup lifecycle, and all tests.

First-three-edit simulation: define the model; define the service state and constructor;
implement the collection filter. The likely stuck point is remembering that `newRouter`
registers two **method values** from one handler, not two handler structs.

Decision: **pass**. One composition dimension rises while every individual operation has
already been practiced.

## Start here

1. Define `Fixture`.
2. Build the service state and both retrieval methods.
3. Build the handler and its two methods.
4. Wire both methods into one router.
5. Run the supplied tests, then explore both routes live.

## Documentation

1. [A Tour of Go: range](https://go.dev/tour/moretypes/16)
2. [Go `append`](https://pkg.go.dev/builtin#append)
3. [Go `errors.Is`](https://pkg.go.dev/errors#Is)
4. [Gin routing](https://gin-gonic.com/en/docs/routing/)
5. [Gin path parameters](https://gin-gonic.com/en/docs/routing/param-in-path/)
6. [Gin testing](https://gin-gonic.com/en/docs/testing/)

## Verification

```sh
go test ./exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/services -v
go test ./exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/... -v
gofmt -w exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/{cmd/api,constants,handlers,models,services}/*.go
npm run check:go
```

Then run:

```sh
go run ./exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/cmd/api
```

Check these in Hoppscotch:

```text
GET http://localhost:8080/clubs/club-1101/fixtures
GET http://localhost:8080/clubs/club-1101/fixtures/fixture-6101
GET http://localhost:8080/clubs/club-1101/fixtures/missing
```

Confirm the collection and item return `200`, the missing item returns `404`, and then
stop the server with `Ctrl+C`.

## Completion criteria

- You authored the model, service, handler, and `newRouter`.
- Both routes use one shared service and handler composition.
- Collection retrieval filters by club and returns `[]` when empty.
- Item retrieval requires both IDs and maps not-found to `404`.
- Focused and workspace Go checks pass.
- The live server demonstrates collection, item, and missing-item behavior.

Ask for review when finished and disclose documentation, old-code, or AI help used. No
written reflection is required.
