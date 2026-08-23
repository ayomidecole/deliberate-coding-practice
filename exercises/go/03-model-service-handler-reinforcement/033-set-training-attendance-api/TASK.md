# GO-033: Set Training Attendance Through an API

Target time: 35–50 minutes  
Primary focus: retrieve the Gin handler sequence after assisted practice

## Goal

Implement the handler for:

```text
PUT /training-sessions/:sessionID/attendance/:playerID
```

The model, service, DTOs, route, and HTTP-test helpers are supplied. The endpoint returns
an attendance record but does not persist it; storage remains a later boundary.

```text
route parameters + JSON → handler → AttendanceService → HTTP response
```

The handler translates HTTP. The service owns valid attendance statuses.

## HTTP contract

Request body:

```json
{"status":"present"}
```

| Outcome | Response |
|---|---|
| malformed JSON | `400 Bad Request`, `{"error":"invalid request"}` |
| `services.ErrInvalidAttendanceStatus` | `422 Unprocessable Entity`, `{"error":"invalid attendance status"}` |
| success | `200 OK` with `sessionId`, `playerId`, and `status` from the service result |

Return immediately after each error response. Use `errors.Is` for the service error. Build
the success DTO from the returned `models.AttendanceRecord`, not directly from the route
or request.

## Your task

### 1. Implement the handler

Replace the placeholder in `handlers/attendance_handler.go`. Reconstruct the full handler
sequence from the contract rather than copying GO-032.

### 2. Own the success HTTP test

Add `TestSetAttendanceReturnsUpdatedRecord` to
`handlers/attendance_handler_test.go` using the supplied helpers.

Send `present` for a session and player of your choice. Assert `200 OK`, decode
`attendanceResponseJSON`, and compare the complete response value.

## Retrieval constraint

For the first 10–15 minutes, use this task and the official documentation without opening
an older handler or requesting implementation code. If you remain blocked after a
meaningful attempt, use a hint rather than stalling. Disclose any reference or AI help at
review so the next retrieval can be calibrated correctly.

## Scope preflight

- **Demonstrated:** Gin `PUT` routes, `c.Param`, `ShouldBindJSON`, DTOs, `c.JSON`,
  `errors.Is`, service delegation, early returns, and HTTP tests.
- **Guided retrieval:** independently reconstructing the handler sequence after GO-032 A3.
- **New operations:** none; reading two route parameters repeats a known operation.
- **Difficulty change:** fewer body fields and one business error, with less implementation
  guidance and ownership of the success test.
- **Deferred:** model/service implementation, persistence, interfaces, table-driven tests,
  middleware, goroutines, and channels.

Decision: **pass**. It keeps one familiar boundary active while varying the method,
resource, data shape, and test responsibility.

## Five-minute start gate

The first edits are identifiable:

1. Declare a `setAttendanceRequestJSON` value and bind JSON into its address.
2. Read `sessionID` and `playerID` from the path.
3. Pass those values and the bound status to the supplied service.

The likely stuck point is the success projection: use every field from the service result.

## Documentation

Use these official references:

1. [Gin routing](https://gin-gonic.com/en/docs/routing/) — `PUT` route registration.
2. [Gin path parameters](https://gin-gonic.com/en/docs/routing/param-in-path/) — reading
   both `:sessionID` and `:playerID` with `c.Param`.
3. [Gin binding](https://gin-gonic.com/en/docs/binding/binding-and-validation/) — binding
   JSON while retaining control of the error response.
4. [Gin `Context`](https://pkg.go.dev/github.com/gin-gonic/gin#Context) — `Param`,
   `ShouldBindJSON`, and `JSON` reference.
5. [Go `errors.Is`](https://pkg.go.dev/errors#Is)
6. [Go `httptest`](https://pkg.go.dev/net/http/httptest) — reference for the supplied test
   infrastructure.

## Verification

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/033-set-training-attendance-api/... -v
gofmt -w exercises/go/03-model-service-handler-reinforcement/033-set-training-attendance-api
npm run check:go
```

## Completion criteria

- Malformed JSON returns exactly one `400` response.
- Unsupported attendance status returns the documented `422` response.
- Success returns `200` using the complete service result.
- Your learner-authored success test passes.
- Focused and workspace-wide checks pass.

Ask for review when finished and disclose any documentation, old-code, or AI help used.
No written reflection is required.
