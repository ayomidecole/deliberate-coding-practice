# GO-040: List a Team Squad

Target time: 50–70 minutes  
Primary focus: carry a collection through the model, service, and handler layers

## API contract

Implement one soccer endpoint:

```text
GET /teams/:teamID/squad-players
```

It returns every **registered** player belonging to the requested team, in the same order
they appeared in the service's constructor-supplied slice.

```json
[
  {
    "id": "player-901",
    "teamId": "team-401",
    "fullName": "Amara Okafor",
    "position": "midfielder",
    "registrationStatus": "registered"
  },
  {
    "id": "player-903",
    "teamId": "team-401",
    "fullName": "Ines Duarte",
    "position": "defender",
    "registrationStatus": "registered"
  }
]
```

If there are no matches, return `200 OK` with `[]`. An empty collection is a valid answer,
not a missing individual resource, so this endpoint has no `404` branch.

## Collection mental model

Keep three values distinct while filtering:

```text
source slice  = every player supplied to the service
current value = one player during this loop iteration
result slice  = matching players accumulated so far
```

`append` adds the current value to the result. Returning from inside the loop would stop
the search after one match, so return the completed result only after every source value
has been inspected.

The full data flow is:

```text
[]models.SquadPlayer
    → service filters
[]models.SquadPlayer
    → supplied DTO mapper
[]squadPlayerResponseJSON
    → Gin
JSON array
```

The supplied mapper creates a non-nil empty response slice so Gin emits `[]` rather than
`null` when no players match.

## Your task

Work in dependency order.

### 1. Model

`constants.RegistrationStatusRegistered` is supplied and imported where the service will
use it. In `models/squad_player.go`, define `SquadPlayer` from one JSON object in the
successful response. Use exported Go fields with no JSON tags.

### 2. Service

Complete `services/squad_service.go`:

- keep the supplied `players []models.SquadPlayer` field;
- make `NewSquadService` retain the constructor argument;
- implement `ListRegisteredPlayers(teamID string) []models.SquadPlayer`.

Inspect every supplied player with one `range` loop. Append a player only when its team ID
matches the argument and its registration status equals the registered constant. Preserve
input order, do not mutate the source slice, and return the result after the loop.

### 3. Handler

Complete `ListSquadPlayers` in `handlers/squad_handler.go`:

1. read `teamID` from the path;
2. call `ListRegisteredPlayers` once;
3. pass its result to the supplied `newSquadPlayerResponsesJSON` mapper;
4. respond with `200 OK` and that mapped collection.

The handler must not repeat the registration or team-matching rules.

## Scope preflight

- **Known:** constants, models, constructors, pointer receivers, `range`, `append`, Gin
  `GET`, path parameters, and DTO projection.
- **Demonstrated/retrieved:** collection accumulation in GO-019/020 and the complete layered
  flow in GO-039.
- **New:** one collection contract returning zero, one, or several records as a JSON array.
- **Held constant:** one route and method, no request body, query, service error, or new test
  harness; the collection DTO mapper and tests are supplied.

Decision: **pass**. This raises one data-flow dimension without adding another framework
boundary.

## Documentation

1. [A Tour of Go: range](https://go.dev/tour/moretypes/16)
2. [Go built-in `append`](https://pkg.go.dev/builtin#append)
3. [Go `encoding/json`: arrays and slices](https://pkg.go.dev/encoding/json)
4. [Gin routing](https://gin-gonic.com/en/docs/routing/)
5. [Gin path parameters](https://gin-gonic.com/en/docs/routing/param-in-path/)

## Verification

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/040-list-team-squad/services -v
go test ./exercises/go/03-model-service-handler-reinforcement/040-list-team-squad/... -v
gofmt -w exercises/go/03-model-service-handler-reinforcement/040-list-team-squad/{constants,handlers,models,services}/*.go
npm run check:go
```

## Completion criteria

- You authored the model, service constructor/filter, and handler behavior.
- All matching registered players are returned in input order.
- Other teams and non-registered players are excluded.
- No matches produce `200 OK` with `[]`.
- Focused and workspace-wide checks pass.

Ask for review when finished and disclose documentation, old-code, or AI help used. No
written reflection is required.
