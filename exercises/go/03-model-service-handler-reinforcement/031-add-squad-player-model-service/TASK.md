# GO-031: Add a Player to a Squad

Target time: 35–50 minutes  
Primary focus: reconnect model ownership to service behavior

## API context

This exercise uses one operation that could belong to a squad API:

```text
POST /teams/:teamID/squad/players
```

GO-031 builds only the model and service behind the **POST** operation:

```text
future HTTP request → future handler → SquadService.AddPlayer → models.SquadPlayer
```

The Gin handler comes after this layer is independently rebuilt. GET, PUT, and storage
are possible later operations, not a commitment that subsequent exercises will stay
inside this one squad API. Later scenarios will be chosen for the capability being
practised.

## Your task

### 1. Define the model

In `models/squad_player.go`, define `SquadPlayer` with:

- `TeamID string`
- `PlayerID string`
- `Name string`
- `Position string`
- `SquadNumber int`

The model owns the shared player shape. It contains no validation or HTTP code.

### 2. Implement the service

Replace the placeholder body of `SquadService.AddPlayer` in
`services/squad_service.go`.

Apply these rules in order:

| Situation | Result |
|---|---|
| `squadNumber` is below 1 or above 99 | empty player and `ErrInvalidSquadNumber` |
| `position` is not one of the supplied position constants | empty player and `ErrInvalidPosition` |
| inputs are valid | complete `models.SquadPlayer` and `nil` |

A valid position must exactly match one of the four constants in
`constants/player_position.go`. Preserve every input in the successful player.

### 3. Own one test

Add `TestAddPlayerRejectsUnsupportedPosition` to `services/squad_service_test.go`.
Use a valid squad number but an unsupported position, then assert the named error and an
empty player.

## Scope preflight

- **Demonstrated:** structs, constants, service methods, error variables, validation
  branches, full-value returns, and unit tests.
- **Guided retrieval:** models own shared shapes; services enforce business rules and
  produce models.
- **New operations:** none.
- **Raised dimension:** reconnect two familiar packages in an API-resource context.
- **Test ownership:** starter tests plus one learner-authored validation test.
- **Deferred:** Gin, request/response DTOs, routes, GET, PUT, storage, duplicate detection,
  interfaces, middleware, goroutines, and channels.

Decision: **pass**. The domain now points toward a real API without expanding GO-031
beyond its model/service target.

## Start and verification

Your first three edits are:

1. Define `models.SquadPlayer`.
2. Add the squad-number guard.
3. Validate the supplied position against the constants.

Run:

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/031-add-squad-player-model-service/... -v
```

Before review:

```sh
gofmt -w exercises/go/03-model-service-handler-reinforcement/031-add-squad-player-model-service
npm run check:go
```

## Documentation

1. [A Tour of Go: structs](https://go.dev/tour/moretypes/2)
2. [A Tour of Go: struct literals](https://go.dev/tour/moretypes/5)
3. [A Tour of Go: if and else](https://go.dev/tour/flowcontrol/7)
4. [A Tour of Go: switch](https://go.dev/tour/flowcontrol/9) — one possible way to check
   the supported positions.
5. [A Tour of Go: methods](https://go.dev/tour/methods/1)
6. [Go: return and handle errors](https://go.dev/doc/tutorial/handle-errors)
7. [Go `testing`](https://pkg.go.dev/testing)

The HTTP boundary is intentionally next. Gin's official
[routing documentation](https://gin-gonic.com/en/docs/routing/) becomes relevant then.

## Completion criteria

- `SquadPlayer` contains exactly the documented fields.
- Invalid squad numbers return the correct error and an empty player.
- Unsupported positions return the correct error and an empty player.
- Valid input returns a complete player.
- Your unsupported-position test and the workspace-wide checks pass.

Ask for review when finished and disclose any documentation or AI help used. No written
reflection is required.
