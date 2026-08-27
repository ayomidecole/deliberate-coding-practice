# GO-045: Run a Published Match Plan API

Target time: 60–80 minutes  
Primary focus: carry multiple service outcomes through a runnable API

## API contract

Implement:

```text
GET /clubs/:clubID/match-plans/:planID
```

| Outcome | Response |
|---|---|
| no plan matches both path IDs | `404 Not Found`, `{"error":"match plan not found"}` |
| matching plan is not published | `409 Conflict`, `{"error":"match plan is not published"}` |
| matching plan is published | `200 OK` with the plan JSON |

Successful response:

```json
{
  "id": "plan-5101",
  "clubId": "club-1001",
  "opponentName": "Lisbon Athletic",
  "formation": "4-3-3",
  "status": "published"
}
```

The supplied constants and sentinel errors define the business vocabulary. `409` is used
because the matching resource exists, but its current draft state prevents this request
from succeeding.

## Data flow

```text
clubID + planID
    → handler
    → service lookup and publication rule
    → MatchPlan or sentinel error
    → handler maps 404, 409, or 200
    → router exposes the flow to HTTP
```

The order matters: determine whether a plan matches both IDs before checking its status.
Return not-found only after the complete source slice has been inspected.

## Your task

Work in dependency order.

### 1. Model

In `models/match_plan.go`, define `MatchPlan` from the successful JSON object. Use
exported Go fields without JSON tags.

### 2. Service

In `services/match_plan_service.go`, define:

```go
type MatchPlanService struct {
    // private plans slice
}

func NewMatchPlanService(plans []models.MatchPlan) *MatchPlanService

func (service *MatchPlanService) GetPublishedMatchPlan(
    clubID string,
    planID string,
) (models.MatchPlan, error)
```

Retain the constructor input and use one `range` loop. A plan is matched only when both
IDs match. For that plan:

- if `Status` is not `constants.MatchPlanStatusPublished`, return an empty model with
  `ErrMatchPlanNotPublished`;
- otherwise return the plan with `nil`.

After the loop, return an empty model with `ErrMatchPlanNotFound`. Do not mutate the
source slice.

### 3. Handler

In `handlers/match_plan_handler.go`, define `MatchPlanHandler`, its constructor, and:

```go
func (handler *MatchPlanHandler) GetMatchPlan(c *gin.Context)
```

Read both path parameters and call the service once. Use `errors.Is` to map not-found to
the documented `404` and not-published to the documented `409`; return after each error
response. On success, use the supplied `newMatchPlanResponseJSON` mapper and return
`200 OK`. Business decisions remain in the service.

### 4. Composition root

In `cmd/api/main.go`, define:

```go
func newRouter(plans []models.MatchPlan) *gin.Engine
func main()
```

Repeat the familiar flow: construct the service, inject it into the handler, create the
Gin engine, register the exact GET route with the handler **method**, and return the
engine. `main` passes `seedMatchPlans` into `newRouter`, runs the returned engine on
`:8080`, and uses `log.Fatal` if `Run` returns an error.

Imports are supplied. Their temporary unused warnings disappear as you implement each
file. Seed data, constants, sentinel errors, response mapping, and tests are also supplied.

## Scope preflight

- **Transferred:** model construction, slice lookup, composite identity, sentinel errors,
  `errors.Is`, early returns, two path parameters, handler mapping, and layered ownership.
- **Guided and retrieved again:** `newRouter` and `main` application composition.
- **New:** none.
- **Raised dimension:** the running endpoint has two business failures plus success.
- **Held constant:** one GET route, one returned model, no collection, body, query,
  mutation, persistence, middleware, or learner-authored test harness.
- **Supplied:** imports, constants, errors, seed data, response DTO mapping, and all tests.

Decision: **pass**. Outcome branching increases while the framework operations stay
stable.

## Start here

1. Derive the model from the successful JSON.
2. Define the service state and constructor.
3. Implement the three-outcome service decision flow.
4. Map those outcomes in the handler.
5. Rebuild the familiar router and server composition.

## Documentation

1. [Go `errors.Is`](https://pkg.go.dev/errors#Is)
2. [A Tour of Go: range](https://go.dev/tour/moretypes/16)
3. [Gin path parameters](https://gin-gonic.com/en/docs/routing/param-in-path/)
4. [Gin testing](https://gin-gonic.com/en/docs/testing/)
5. [RFC 9110: 409 Conflict](https://www.rfc-editor.org/rfc/rfc9110.html#name-409-conflict)

## Verification

```sh
go test ./exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/services -v
go test ./exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/... -v
gofmt -w exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/{cmd/api,constants,handlers,models,services}/*.go
npm run check:go
```

Then run:

```sh
go run ./exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/cmd/api
```

Check these in Hoppscotch:

```text
GET http://localhost:8080/clubs/club-1001/match-plans/plan-5101
GET http://localhost:8080/clubs/club-1001/match-plans/plan-5102
```

Confirm the published plan returns `200` and the draft returns `409`, then stop the server
with `Ctrl+C`.

## Completion criteria

- You authored the model, service, handler, `newRouter`, `main`, and route wiring.
- Lookup requires both IDs and checks publication only after a match.
- The two service errors map to the documented HTTP responses.
- Focused and workspace Go checks pass.
- The live server demonstrates both published and draft outcomes.

Ask for review when finished and disclose documentation, old-code, or AI help used. No
written reflection is required.
