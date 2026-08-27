# GO-044: Run a Club Players API

Target time: 55–75 minutes  
Primary focus: retrieve runnable API composition while carrying a collection

## API contract

Implement one endpoint:

```text
GET /clubs/:clubID/players
```

It returns every player belonging to the requested club, in the same order supplied to
the service:

```json
[
  {
    "id": "player-4101",
    "clubId": "club-901",
    "fullName": "Sofia Martins",
    "position": "goalkeeper",
    "shirtNumber": 1,
    "squadStatus": "active"
  },
  {
    "id": "player-4102",
    "clubId": "club-901",
    "fullName": "Amina Yusuf",
    "position": "defender",
    "shirtNumber": 4,
    "squadStatus": "injured"
  }
]
```

No matches is a valid collection result: return `200 OK` with `[]`, not `404` or `null`.

## Mental model

This task keeps application construction stable and changes one data-flow dimension:

```text
seed []models.Player
    → PlayerService filters by club
[]models.Player
    → supplied response mapper
[]playerResponseJSON
    → Gin
JSON array
```

Keep these collection values distinct:

```text
service.players = the complete source slice
player          = one value during the current loop iteration
result          = the matching players collected so far
```

Returning inside the loop would stop after the first match. Inspect the complete source,
then return the result.

## Your task

Work in dependency order.

### 1. Model

In `models/player.go`, define `Player` from one object in the JSON contract. Use exported
Go fields without JSON tags. Status constants are supplied because declaring constants is
not being assessed.

### 2. Service

In `services/player_service.go`, define:

```go
type PlayerService struct {
    // private players slice
}

func NewPlayerService(players []models.Player) *PlayerService

func (service *PlayerService) ListPlayers(clubID string) []models.Player
```

Retain the constructor input. In `ListPlayers`, create a non-nil empty result, inspect the
source with one `range` loop, append players whose `ClubID` matches the argument, and
return the result after the loop. Preserve input order and do not mutate the source.

### 3. Handler

In `handlers/player_handler.go`, define `PlayerHandler`, its constructor, and:

```go
func (handler *PlayerHandler) ListPlayers(c *gin.Context)
```

Read `clubID` from the path, call the service once, map the result with the supplied
`newPlayerResponsesJSON`, and return `200 OK`. Filtering belongs only in the service.

### 4. Composition root

In `cmd/api/main.go`, define:

```go
func newRouter(players []models.Player) *gin.Engine
func main()
```

`newRouter` constructs the service, injects it into the handler, creates a Gin engine,
registers the exact GET route, and returns the engine. `main` passes `seedPlayers` into
`newRouter`, runs the returned engine on `:8080`, and terminates with `log.Fatal` if
`Run` returns an error.

Imports and seed data are supplied. You own both functions; use GO-043 as a reference if
needed, but type and connect the flow yourself.

The supplied imports in unfinished files will appear unused until you implement that file.
That temporary compiler feedback is expected.

## Scope preflight

- **Transferred:** model construction, slice-backed service, handler injection, Gin GET,
  path parameters, response mapping, and layered ownership.
- **Guided and now retrieved:** collection accumulation from GO-040 and application
  composition from GO-043.
- **New:** none.
- **Raised dimension:** one resource becomes an ordered zero-to-many response.
- **Held constant:** one GET route, one path parameter, no body, query, errors,
  persistence, middleware, or unfamiliar test harness.
- **Supplied:** imports, constants, seed data, response DTO mapping, and all tests.

Decision: **pass**. One data-flow dimension increases while construction stays stable.

## Start here

1. Derive the model fields from the JSON object.
2. Define the service field and constructor.
3. Implement and verify the collection filter.
4. Implement the handler.
5. Rebuild the familiar `newRouter` and `main` flow.

## Documentation

1. [A Tour of Go: range](https://go.dev/tour/moretypes/16)
2. [Go built-in `append`](https://pkg.go.dev/builtin#append)
3. [Gin path parameters](https://gin-gonic.com/en/docs/routing/param-in-path/)
4. [Gin testing](https://gin-gonic.com/en/docs/testing/)
5. [Gin `New` versus `Default`](https://gin-gonic.com/en/docs/middleware/without-middleware/)

## Verification

```sh
go test ./exercises/go/04-runnable-api-construction/044-run-club-players-api/services -v
go test ./exercises/go/04-runnable-api-construction/044-run-club-players-api/... -v
gofmt -w exercises/go/04-runnable-api-construction/044-run-club-players-api/{cmd/api,constants,handlers,models,services}/*.go
npm run check:go
```

Then run the server:

```sh
go run ./exercises/go/04-runnable-api-construction/044-run-club-players-api/cmd/api
```

In Hoppscotch, send:

```text
GET http://localhost:8080/clubs/club-901/players
```

Confirm `200 OK` with the two documented players, then stop the server with `Ctrl+C`.

## Completion criteria

- You authored the model, service, handler, `newRouter`, `main`, and route wiring.
- Matching players remain in input order; other clubs are excluded.
- No matches produce `200 OK` with `[]`.
- Unit, handler, router, and workspace Go checks pass.
- The real server responds correctly in Hoppscotch.

Ask for review when finished and disclose documentation, old-code, or AI help used. No
written reflection is required.
