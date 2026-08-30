# GO-048: Submit a Scouting Report API

Target time: 60–85 minutes  
Primary focus: construct and run a POST request through every layer

## Scenario

Build one runnable soccer endpoint that accepts a scouting report for a player:

```text
POST JSON + clubID
        ↓
ScoutingReportHandler
        ↓
ScoutingReportService validates business rules
        ↓
ScoutingReport model
        ↓
201 JSON response
```

The handler owns HTTP translation. The service owns report rules and constructs the model.
The model represents the result. `newRouter` constructs and connects the application.

This exercise intentionally does not save the report. Durable creation belongs to the
persistence arc. The client supplies `reportId` so ID generation does not become a second
new concern.

## API contract

```text
POST /clubs/:clubID/scouting-reports
Content-Type: application/json
```

Request:

```json
{
  "reportId": "report-7201",
  "playerId": "player-3301",
  "summary": "Strong movement between defensive lines",
  "rating": 8
}
```

Success: `201 Created`

```json
{
  "id": "report-7201",
  "clubId": "club-1201",
  "playerId": "player-3301",
  "summary": "Strong movement between defensive lines",
  "rating": 8,
  "status": "submitted"
}
```

| Outcome | Response |
|---|---|
| malformed JSON | `400 Bad Request`, `{"error":"invalid request"}` |
| empty summary | `422 Unprocessable Entity`, `{"error":"summary is required"}` |
| rating outside `1..10` | `422 Unprocessable Entity`, `{"error":"rating must be between 1 and 10"}` |
| unexpected service error | `500 Internal Server Error`, `{"error":"internal server error"}` |
| success | `201 Created` with the service result |

`ShouldBindJSON` answers only “can this request be decoded?” The service answers “is this
valid scouting-report data?” Keep those two decisions in their respective layers.

## Your task

Work in dependency order. Request/response DTOs, constants, service errors, lifecycle code,
test helpers, and most tests are supplied. You own the target implementation.

### 1. Model

In `models/scouting_report.go`, define `ScoutingReport` with exported fields matching the
success JSON contract:

```text
ID       string
ClubID   string
PlayerID string
Summary  string
Rating   int
Status   string
```

Do not add JSON tags. The handler DTOs own the wire format.

### 2. Service

In `services/scouting_report_service.go`, define:

```go
type ScoutingReportService struct{}

func NewScoutingReportService() *ScoutingReportService

func (service *ScoutingReportService) CreateScoutingReport(
    clubID string,
    reportID string,
    playerID string,
    summary string,
    rating int,
) (models.ScoutingReport, error)
```

Apply the rules in this order:

1. An empty summary returns an empty model with `ErrMissingSummary`.
2. A rating below `1` or above `10` returns an empty model with `ErrInvalidRating`.
3. Otherwise return a report containing every input and
   `constants.ScoutingReportStatusSubmitted`, with a nil error.

The service does not know about Gin, JSON, or HTTP status codes.

### 3. Handler

In `handlers/scouting_report_handler.go`, define `ScoutingReportHandler`, its constructor,
and:

```go
func (handler *ScoutingReportHandler) CreateScoutingReport(c *gin.Context)
```

The handler must:

1. bind JSON into the supplied `createScoutingReportRequestJSON`;
2. return `400` immediately if binding fails;
3. read `clubID` from the path;
4. call the service once with the path value and all body fields;
5. map each named service error to its documented `422` response and return;
6. guard any other non-nil error with the documented `500` response and return;
7. map the service result with `newScoutingReportResponseJSON` and return `201`.

Do not construct the success model directly in the handler.

### 4. Application composition

In `cmd/api/main.go`, add:

```go
func newRouter() *gin.Engine
```

Inside it:

1. construct `ScoutingReportService`;
2. inject it into `ScoutingReportHandler`;
3. create one engine with `gin.Default()`;
4. register the exact POST route with the handler method;
5. return the engine.

The supplied `main` owns only server startup.

### 5. Test ownership

In `services/scouting_report_service_test.go`, add one test proving that rating `11` returns
`ErrInvalidRating` and an empty `ScoutingReport`. Follow the neighboring service tests;
the test harness is already established.

## Scope preflight

- **Known:** models, constructors, validation branches, sentinel errors, DTOs,
  `ShouldBindJSON`, path parameters, early returns, status mapping, and route registration.
- **Demonstrated:** POST handler flow, multi-outcome mapping, full layer ownership,
  `newRouter`, and focused unit tests.
- **New operations:** none. This retrieves the known POST flow in a complete runnable API.
- **Raised dimensions:** body-to-model data flow and one familiar boundary test.
- **Held constant:** one feature pair, one route, no stored mutation, no ID generation,
  no persistence, no interfaces, and no new test infrastructure.

First three edits: define the model; define the service and constructor; implement the two
validation branches. The likely stuck point is separating malformed transport input from
well-formed input rejected by business rules.

Decision: **pass**. The POST flow is the single progression from the GET-only runnable APIs.

## Documentation

1. [Gin model binding and validation](https://gin-gonic.com/en/docs/binding/binding-and-validation/)
2. [Gin routing](https://gin-gonic.com/en/docs/routing/)
3. [Gin `Context` reference](https://pkg.go.dev/github.com/gin-gonic/gin#Context)
4. [Go `errors.Is`](https://pkg.go.dev/errors#Is)
5. [Go HTTP status constants](https://pkg.go.dev/net/http#pkg-constants)
6. [Go HTTP testing](https://pkg.go.dev/net/http/httptest)
7. [RFC 9110: POST](https://www.rfc-editor.org/rfc/rfc9110.html#name-post)

## Verification

```sh
go test ./exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/services -v
go test ./exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/... -v
gofmt -w exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/{cmd/api,constants,handlers,models,services}/*.go
npm run check:go
```

Then run:

```sh
go run ./exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/cmd/api
```

Send the documented request to:

```text
POST http://localhost:8080/clubs/club-1201/scouting-reports
```

Also try malformed JSON, an empty summary, and rating `11`. Confirm `201`, `400`, `422`,
and `422`, then stop the server with `Ctrl+C`.

## Completion criteria

- You authored the model, service, handler, and complete `newRouter`.
- Transport parsing and business validation stay in separate layers.
- Every error path returns before the success path.
- Success uses the service result and returns `201`.
- Your rating-above-maximum test exists and passes.
- Focused/workspace checks and live requests pass.

Ask for review when finished and disclose documentation, old-code, or AI help used. No
written reflection is required.
