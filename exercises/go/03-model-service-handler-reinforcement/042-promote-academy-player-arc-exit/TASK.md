# GO-042: Promote an Academy Player — Arc 03 Exit

Target time: 60–80 minutes  
Primary focus: independently reconstruct a familiar model → service → handler slice

## API contract

Implement this stateless endpoint:

```text
PUT /clubs/:clubID/first-team/players/:playerID
```

| Outcome | Response |
|---|---|
| no academy player matches both path IDs | `404 Not Found`, `{"error":"academy player not found"}` |
| matching player is not eligible | `409 Conflict`, `{"error":"player not eligible for promotion"}` |
| matching player is eligible | `200 OK` with `squadStatus: "first_team"` |

Successful response:

```json
{
  "id": "player-2007",
  "clubId": "club-706",
  "fullName": "Mafalda Pinto",
  "position": "midfielder",
  "developmentStatus": "eligible",
  "squadStatus": "first_team"
}
```

Persistence is outside this arc. Return a promoted copy and leave the constructor-supplied
slice unchanged.

## What is supplied

- meaningful constants and sentinel errors;
- handler response DTOs and the model-to-response mapper;
- the Gin route and HTTP test harness;
- complete service and handler tests.

## Your task

You own the model, service, and handler declarations and behavior. Unlike recent tasks,
their implementation files contain only package declarations.

### 1. Model

In `models/academy_player.go`, define `AcademyPlayer` with exported fields and no JSON tags:

```text
ID                string
ClubID            string
FullName          string
Position          string
DevelopmentStatus string
SquadStatus       string
```

### 2. Service

In `services/academy_service.go`, define:

```go
type AcademyService struct {
    // private players slice
}

func NewAcademyService(players []models.AcademyPlayer) *AcademyService

func (service *AcademyService) PromoteToFirstTeam(
    clubID string,
    playerID string,
) (models.AcademyPlayer, error)
```

The constructor retains `players`. The method uses one `range` loop and treats a player as
found only when both IDs match. For the matched player:

- if `DevelopmentStatus` is not `constants.DevelopmentStatusEligible`, return an empty
  model and `ErrPlayerNotEligible`;
- otherwise change the copied player's `SquadStatus` to
  `constants.SquadStatusFirstTeam`, then return the copy and `nil`.

Only after the whole loop may it return an empty model and
`ErrAcademyPlayerNotFound`.

### 3. Handler

In `handlers/academy_handler.go`, define:

```go
type AcademyHandler struct {
    // private service pointer
}

func NewAcademyHandler(service *services.AcademyService) *AcademyHandler

func (handler *AcademyHandler) PromoteToFirstTeam(c *gin.Context)
```

The handler must:

1. read `clubID` and `playerID` from the path;
2. call the service once;
3. map `ErrAcademyPlayerNotFound` to the documented `404`, then return;
4. map `ErrPlayerNotEligible` to the documented `409`, then return;
5. use `newAcademyPlayerResponseJSON` for the `200 OK` response.

Use `errors.Is`. Business lookup and eligibility decisions belong only in the service.

## Scope preflight

- **Known/retrieved:** model translation, constructor-owned slices, method receivers,
  composite lookup, copied updates, sentinel errors, `errors.Is`, Gin `PUT`, path
  parameters, DTO mapping, and early returns.
- **New operations:** none.
- **Raised dimension:** implementation scaffolding is reduced; you reconstruct each target
  declaration and its imports.
- **Held constant:** the one-loop, two-error, one-success behavior from GO-041; routine
  constants, response types, routing, and tests are supplied.

Decision: **pass** as the Arc 03 exit assessment. It tests independent layered recall
without adding another protocol, persistence, collection behavior, or test authorship.

## Start here

Your first three edits are:

1. define `models.AcademyPlayer`;
2. add the service imports, state, and constructor;
3. implement the familiar service decision flow before starting the handler.

The likely friction is reconstructing declarations and imports, not discovering new
behavior. Use compiler messages and the supplied tests as feedback.

## Documentation

1. [A Tour of Go: methods](https://go.dev/tour/methods/1)
2. [Go `errors.Is`](https://pkg.go.dev/errors#Is)
3. [Gin routing](https://gin-gonic.com/en/docs/routing/)
4. [Gin path parameters](https://gin-gonic.com/en/docs/routing/param-in-path/)

## Verification

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/042-promote-academy-player-arc-exit/services -v
go test ./exercises/go/03-model-service-handler-reinforcement/042-promote-academy-player-arc-exit/... -v
gofmt -w exercises/go/03-model-service-handler-reinforcement/042-promote-academy-player-arc-exit/{constants,handlers,models,services}/*.go
npm run check:go
```

## Completion criteria

- You reconstructed the model, service, and handler from the contract.
- Both business failures cross the service boundary and map to the correct HTTP response.
- Success returns a modified copy without changing the source slice.
- Focused and workspace-wide checks pass.

Ask for review when finished and disclose documentation, old-code, or AI help used. No
written reflection is required.
