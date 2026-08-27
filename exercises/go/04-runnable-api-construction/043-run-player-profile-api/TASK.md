# GO-043: Run a Player Profile API

Target time: 60–80 minutes  
Primary focus: compose familiar layers into one runnable Go program

## Mental model

Until now, tests created the service, handler, and router for you. A real application needs
an entry point that assembles those components:

```text
main → service → handler → Gin route
                         ↑
request → Gin router ────┘
```

`cmd/api/main.go` is the **composition root**: the outermost place that creates concrete
dependencies and connects them. Models do not know about services, services do not know
about HTTP, and handlers do not create their own services.

A generic construction sequence looks like this:

```go
dependency := NewDependency(...)
consumer := NewConsumer(dependency)
router.GET("/path", consumer.Handle)
```

For this task, reason from the constructor types rather than guessing syntax:

```text
players []models.Player
    ↓ accepted by NewPlayerService
*services.PlayerService
    ↓ accepted by NewPlayerHandler
*handlers.PlayerHandler
    ↓ GetPlayer has the handler shape Gin accepts
router.GET(path, handler.GetPlayer)
```

Each line produces the value required by the next line. This explicit construction is
dependency injection: `main` chooses and supplies dependencies instead of the handler
creating its own service.

You will write `main()` and call `router.Run(":8080")`. `Run` listens for requests and
blocks until the process stops. Tests call `newRouter` directly, so they never open a real
port.

## API contract

Implement:

```text
GET /clubs/:clubID/players/:playerID
```

| Outcome | Response |
|---|---|
| no player matches both path IDs | `404 Not Found`, `{"error":"player not found"}` |
| match | `200 OK` with the complete player |

Successful response:

```json
{
  "id": "player-3001",
  "clubId": "club-801",
  "fullName": "Marta Silva",
  "position": "midfielder",
  "shirtNumber": 8,
  "squadStatus": "active"
}
```

The constructor slice is temporary seed data, not persistence.

## What is supplied

- the status constant and not-found error;
- response DTOs and the model-to-response mapper;
- the `main.go` import block and seed data in `cmd/api/seed.go`;
- all service, handler, router, and HTTP tests.

## Your task

### 1. Model

Define `models.Player` with these exported fields and no JSON tags:

```text
ID          string
ClubID      string
FullName    string
Position    string
ShirtNumber int
SquadStatus string
```

### 2. Service

In `services/player_service.go`, define:

```go
type PlayerService struct {
    // private players slice
}

func NewPlayerService(players []models.Player) *PlayerService

func (service *PlayerService) FindPlayer(
    clubID string,
    playerID string,
) (models.Player, error)
```

Retain the constructor slice. Use one `range` loop, return the complete player only when
both IDs match, and otherwise return an empty player with `ErrPlayerNotFound` after the
loop. Do not mutate the slice.

### 3. Handler

In `handlers/player_handler.go`, define `PlayerHandler`, its constructor, and:

```go
func (handler *PlayerHandler) GetPlayer(c *gin.Context)
```

The handler reads both path parameters and calls the service once. Map
`ErrPlayerNotFound` with `errors.Is` to the documented `404` and return. On success, use
`newPlayerResponseJSON` and return `200 OK`. Keep lookup rules in the service.

### 4. Composition root

The imports are supplied because package-path recall is not being assessed. You own both
functions in `cmd/api/main.go`.

Define `newRouter(players []models.Player) *gin.Engine`:

1. construct `PlayerService` with the `players` parameter;
2. inject that service into `PlayerHandler`;
3. create a Gin engine;
4. register the exact `GET` route with `handler.GetPlayer`;
5. return the engine.

Then define `main()`:

1. call `newRouter` with `seedPlayers`;
2. start the returned engine on `:8080` with `Run`;
3. if `Run` returns an error, terminate with `log.Fatal`.

Keep the route in `main.go`; one route does not justify a separate routing package. Do not
edit the supplied seed data.

## Scope preflight

- **Transferred:** model, slice-backed service, composite lookup, sentinel error, handler,
  path parameters, and HTTP outcome mapping.
- **Demonstrated:** Gin `GET` registration in earlier test routers.
- **New and guided:** production dependency composition and running the assembled server.
- **Supplied:** imports, seed data, unfamiliar test infrastructure, and all tests. The
  tests do not reveal production router construction.
- **Deferred:** bodies, mutation, collections, persistence, middleware, configuration,
  multiple endpoints, and test authorship.

Decision: **pass**. Composition is the only major increase.

## Start here

1. Define the model.
2. Build and verify the service.
3. Build and verify the handler.
4. Wire the already-working layers in `newRouter`, then write `main`.

The likely stuck point is construction order. Follow the dependency direction: a handler
needs a service before a route can receive the handler method.

## Documentation

1. [Go: organizing a server module](https://go.dev/doc/modules/layout#server-project)
2. [Gin quickstart](https://gin-gonic.com/en/docs/quickstart/)
3. [Gin routing](https://gin-gonic.com/en/docs/routing/)
4. [Gin dependency-injection patterns](https://gin-gonic.com/en/docs/middleware/dependency-injection/)
5. [Gin testing](https://gin-gonic.com/en/docs/testing/)

## Verification

First, verify each boundary:

```sh
go test ./exercises/go/04-runnable-api-construction/043-run-player-profile-api/services -v
go test ./exercises/go/04-runnable-api-construction/043-run-player-profile-api/handlers -v
go test ./exercises/go/04-runnable-api-construction/043-run-player-profile-api/... -v
```

Then start the real server:

```sh
go run ./exercises/go/04-runnable-api-construction/043-run-player-profile-api/cmd/api
```

In Hoppscotch, send:

```text
GET http://localhost:8080/clubs/club-801/players/player-3001
```

Confirm `200` and the documented player JSON, then stop the server with `Ctrl+C`.

Before review:

```sh
gofmt -w exercises/go/04-runnable-api-construction/043-run-player-profile-api/{cmd/api,constants,handlers,models,services}/*.go
npm run check:go
```

## Completion criteria

- You authored the model, service, handler, both `main.go` functions, and route wiring.
- Unit and router tests pass.
- The real server starts and responds correctly in Hoppscotch.
- Workspace Go checks pass.

Ask for review when finished and disclose documentation, old-code, or AI help used. No
written reflection is required.
