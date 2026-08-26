# GO-041: Select a Matchday Player

Target time: 55–75 minutes  
Primary focus: coordinate multiple service outcomes through one handler

## API contract

Implement:

```text
PUT /teams/:teamID/matchday-squad/players/:playerID
```

This stateless exercise evaluates a proposed matchday selection. Persistence comes later.

| Outcome | Response |
|---|---|
| no player matches both path IDs | `404 Not Found`, `{"error":"player not found"}` |
| matching player is not available | `409 Conflict`, `{"error":"player unavailable"}` |
| matching player is available | `200 OK` with `selectionStatus: "selected"` |

Successful response:

```json
{
  "id": "player-1001",
  "teamId": "team-501",
  "fullName": "Marta Silva",
  "position": "midfielder",
  "availability": "available",
  "selectionStatus": "selected"
}
```

## Decision order

The service must answer these questions in order:

```text
1. Does this player belong to this team?
2. If found, is the player available?
3. If available, what successful model should be returned?
```

Do not check another team's player for availability. Do not return `player not found` from
inside the loop merely because the current element does not match; later elements still
need to be inspected.

The successful result is a modified **copy** of the matched player. The constructor-supplied
slice must remain unchanged.

## Your task

The constants, two sentinel errors, DTO mapper, route, and tests are supplied.

### 1. Model

In `models/matchday_player.go`, define `MatchdayPlayer` from the successful response. Use
exported Go fields and no JSON tags.

### 2. Service

Complete `services/matchday_service.go`:

- make `NewMatchdayService` retain its `players` argument;
- implement `SelectMatchdayPlayer(teamID, playerID string)`.

Use one `range` loop. A player is found only when both IDs match. For that player:

- return an empty model and `ErrPlayerUnavailable` if availability is not
  `constants.AvailabilityAvailable`;
- otherwise set the copied player's selection status to
  `constants.SelectionStatusSelected` and return it with `nil`.

After the loop, return an empty model and `ErrPlayerNotFound`. Do not mutate the source
slice or hard-code a player.

### 3. Handler

Complete `SelectMatchdayPlayer` in `handlers/matchday_handler.go`:

1. read both named path parameters;
2. call the service once;
3. map `ErrPlayerNotFound` to the documented `404`, then return;
4. map `ErrPlayerUnavailable` to the documented `409`, then return;
5. map the success model with `newMatchdayPlayerResponseJSON` and return `200 OK`.

Use `errors.Is` for both service errors. The handler must not reproduce lookup or
availability rules.

## Scope preflight

- **Known:** constructor-owned slices, composite lookup, copied model updates, sentinel
  errors, `errors.Is`, Gin `PUT`, path parameters, and DTO responses.
- **Demonstrated:** multiple service errors in GO-015, handler error mapping in GO-036,
  `PUT` in GO-037, and composite lookup in GO-039.
- **Raised dimension:** two business failures plus success cross the same layer boundary.
- **Held constant:** one loop and endpoint; no body, query, collection, persistence,
  unfamiliar tests, or reduced scaffolding.

Decision: **pass**. Branch coordination is the only major increase.

## Documentation

1. [Go `errors.Is`](https://pkg.go.dev/errors#Is)
2. [A Tour of Go: range](https://go.dev/tour/moretypes/16)
3. [A Tour of Go: methods](https://go.dev/tour/methods/1)
4. [Gin routing](https://gin-gonic.com/en/docs/routing/)
5. [Gin path parameters](https://gin-gonic.com/en/docs/routing/param-in-path/)

## Verification

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/041-select-matchday-player/services -v
go test ./exercises/go/03-model-service-handler-reinforcement/041-select-matchday-player/... -v
gofmt -w exercises/go/03-model-service-handler-reinforcement/041-select-matchday-player/{constants,handlers,models,services}/*.go
npm run check:go
```

## Completion criteria

- You authored the model, service constructor/decisions, and handler behavior.
- The correct error is returned only after its prerequisite decision.
- Success changes only the returned copy and preserves the source slice.
- The handler maps both service errors and stops before the success response.
- Focused and workspace-wide checks pass.

Ask for review when finished and disclose documentation, old-code, or AI help used. No
written reflection is required.
