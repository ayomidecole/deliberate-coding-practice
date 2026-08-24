# GO-036: Update Player Availability

Target time: 50–70 minutes  
Primary focus: own the model, service, and handler for one endpoint

## API context

Implement this complete stateless API slice:

```text
PATCH /teams/:teamID/players/:playerID/availability

path + JSON → handler → service → model → handler response
```

`PATCH` communicates that one part of the player resource—availability—is changing. The
route and HTTP-test infrastructure are supplied. Persistence comes later, so this endpoint
returns the updated representation without storing it.

Layer ownership:

- `models` owns the shared internal result shape and has no JSON tags.
- `services` owns supported-availability validation and constructs the model.
- `handlers` owns request/response DTOs, HTTP translation, and service delegation. Its
  routine type scaffolding is supplied; you own the handler behavior.
- `constants` supplies the supported business vocabulary.

## Contract

Request body:

```json
{"availability":"injured"}
```

Successful response:

```json
{
  "teamId": "team-riverside",
  "playerId": "player-705",
  "availability": "injured"
}
```

| Outcome | Response |
|---|---|
| malformed JSON | `400 Bad Request`, `{"error":"invalid request"}` |
| unsupported availability | `422 Unprocessable Entity`, `{"error":"invalid availability"}` |
| success | `200 OK` with every field from the service result |

The only supported values are the three constants in
`constants/player_availability.go`.

## Your task

Work in dependency order. The model and service files contain only package declarations.
The handler's routine DTO, dependency, constructor, and method shell are supplied.

### 1. Model

In `models/player_availability.go`, define `PlayerAvailability` by translating the
successful JSON example into idiomatic exported Go fields and types. Do not add JSON tags.

### 2. Service

In `services/availability_service.go`, define:

- `ErrInvalidAvailability` as a package-level error;
- an empty `AvailabilityService` type;
- `NewAvailabilityService() *AvailabilityService`;
- `SetAvailability(teamID, playerID, availability string) (models.PlayerAvailability, error)`.

`SetAvailability` must:

1. return an empty model and `ErrInvalidAvailability` when the value does not match one of
   the supplied constants;
2. otherwise return a complete `models.PlayerAvailability` and `nil`.

### 3. Handler

Implement the supplied `UpdateAvailability` method in
`handlers/availability_handler.go`. It must:

1. bind the body and return the documented `400` response on failure;
2. call the service using both path parameters and the request availability;
3. map `services.ErrInvalidAvailability` with `errors.Is`, then return the documented
   `422` response;
4. return `200` by projecting every field from the service result into the response DTO.

Use the supplied request, response, and error DTOs; do not redefine them.

## Scope preflight

- **Demonstrated:** structs, constants, package errors, service constructors/methods,
  validation, Gin DTOs, path parameters, binding, `errors.Is`, status codes, and response
  projection.
- **New target operations:** none. The supplied router registers `PATCH`; the handler uses
  established Gin context operations.
- **Raised dimension:** authoring the model, service, and complete handler behavior together
  for the first time.
- **Difficulty controls:** one small model, one service error, one success shape, one
  endpoint, and fully supplied tests.
- **Deferred:** persistence, interfaces, middleware, query parameters, learner-authored
  tests, goroutines, and channels.

Decision: **pass**. Full-layer ownership is the only major increase.

## First three milestones

1. Define the model from the successful JSON response.
2. Implement and verify the complete service contract.
3. Implement the handler after the service package compiles.

Until a milestone is implemented, dependent tests will report undefined names. That is
expected; work from model → service → handler rather than chasing every compiler error at
once.

## Documentation

1. [A Tour of Go: structs](https://go.dev/tour/moretypes/2)
2. [A Tour of Go: methods](https://go.dev/tour/methods/1)
3. [Go: return and handle errors](https://go.dev/doc/tutorial/handle-errors)
4. [Gin routing](https://gin-gonic.com/en/docs/routing/)
5. [Gin path parameters](https://gin-gonic.com/en/docs/routing/param-in-path/)
6. [Gin binding](https://gin-gonic.com/en/docs/binding/binding-and-validation/)
7. [Gin `Context`](https://pkg.go.dev/github.com/gin-gonic/gin#Context)

## Verification

After the service milestone:

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/036-update-player-availability-api/services -v
```

After the handler milestone:

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/036-update-player-availability-api/... -v
gofmt -w exercises/go/03-model-service-handler-reinforcement/036-update-player-availability-api/{constants,handlers,models,services}/*.go
npm run check:go
```

## Completion criteria

- You authored the model, service, and complete handler behavior.
- All three availability constants are accepted; other values return the named error.
- The handler keeps HTTP translation separate from business validation.
- Success uses every field from the service result.
- Focused and workspace-wide Go checks pass.

Ask for review when finished and disclose any documentation, old-code, or AI help used.
No written reflection is required.
