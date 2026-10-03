# GO-050: Patch a Player Registration API

Status: closed with tutor assistance after Arc 04 ended. The learner's model/service are
preserved; Codex supplied the missing handlers/router and additional HTTP regression tests.
Focused tests, vet, and `npm run check:go` pass. This is not evidence of independent
end-to-end PATCH mastery.

Target time: 80–110 minutes  
Primary focus: apply a partial update and observe it through GET

## Scenario

Build one runnable player-registration feature with two endpoints:

```text
GET   /clubs/:clubID/player-registrations/:registrationID
PATCH /clubs/:clubID/player-registrations/:registrationID
```

The service owns an in-memory slice initialized with seed data. A successful PATCH must
change the registration returned by a later GET without replacing fields that were omitted.

## PATCH mental model

A PATCH body describes changes, not a complete replacement:

```text
find the existing registration
        ↓
validate every supplied change
        ↓
copy the existing registration
        ↓
apply only supplied fields
        ↓
write the updated registration back by slice index
```

The supplied request DTO uses pointers:

```go
type patchPlayerRegistrationRequestJSON struct {
    ShirtNumber *int    `json:"shirtNumber"`
    Notes       *string `json:"notes"`
}
```

Pointer presence carries meaning:

| JSON input | Go value | Meaning |
|---|---|---|
| field omitted | `nil` | preserve the stored value |
| `"notes":""` | non-nil pointer to `""` | explicitly clear the notes |
| `"shirtNumber":0` | non-nil pointer to `0` | validate the supplied zero |

Check for `nil` before dereferencing. For example:

```go
if notes != nil {
    updated.Notes = *notes
}
```

Translate that operation to `ShirtNumber`, including its validation. Validate before
writing to the slice so a rejected PATCH cannot partially change stored state.

## Model and HTTP contract

`models.PlayerRegistration` contains:

```text
ID          string
ClubID      string
FullName    string
ShirtNumber int
Notes       string
```

The seed registration is `registration-5101` under `club-1501`.

### GET registration

```text
GET /clubs/:clubID/player-registrations/:registrationID
```

Success returns `200 OK` with the complete registration. A missing registration returns:

```text
404 Not Found
{"error":"player registration not found"}
```

### PATCH registration

```text
PATCH /clubs/:clubID/player-registrations/:registrationID
Content-Type: application/json
```

The body may contain `shirtNumber`, `notes`, or both. An empty object is a successful
no-op. A supplied shirt number must be between `1` and `99`.

| Outcome | Response |
|---|---|
| malformed JSON | `400`, `{"error":"invalid request"}` |
| registration does not exist | `404`, `{"error":"player registration not found"}` |
| supplied shirt number outside `1..99` | `422`, `{"error":"shirt number must be between 1 and 99"}` |
| unexpected service error | `500`, `{"error":"internal server error"}` |
| successful partial update | `200` with the complete updated registration |

## Your task

Work in dependency order. Request/response DTOs, errors, seed data, startup, and all tests
are supplied. You own the model, service, both handler methods, and `newRouter`.

### 1. Model

Define `models.PlayerRegistration` with the five fields above. Do not add JSON tags; the
handler DTOs own the wire format.

### 2. Service

In `services/player_registration_service.go`, define:

```go
type PlayerRegistrationService struct {
    // private registrations slice
}

func NewPlayerRegistrationService(
    registrations []models.PlayerRegistration,
) *PlayerRegistrationService

func (service *PlayerRegistrationService) FindRegistration(
    clubID string,
    registrationID string,
) (models.PlayerRegistration, error)

func (service *PlayerRegistrationService) PatchRegistration(
    clubID string,
    registrationID string,
    shirtNumber *int,
    notes *string,
) (models.PlayerRegistration, error)
```

`FindRegistration` matches both IDs or returns `ErrPlayerRegistrationNotFound`.

`PatchRegistration` must:

1. find the registration matching both IDs;
2. reject a non-nil shirt number outside `1..99` before mutation;
3. copy the stored registration;
4. apply only non-nil fields;
5. assign the updated value to the matching slice index;
6. return the updated registration;
7. return `ErrPlayerRegistrationNotFound` after the loop when nothing matched.

`FullName`, `ID`, and `ClubID` are not patchable and must remain unchanged.

### 3. Handler

The private DTOs and mapping helper are supplied in
`handlers/player_registration_handler.go`.

Define `PlayerRegistrationHandler`, its constructor, and:

```go
func (handler *PlayerRegistrationHandler) GetRegistration(c *gin.Context)
func (handler *PlayerRegistrationHandler) PatchRegistration(c *gin.Context)
```

`GetRegistration` reads both path parameters, calls the service once, maps not-found to
`404`, guards unexpected errors with `500`, and returns the mapped model with `200`.

`PatchRegistration` must:

1. bind the JSON request and return `400` on failure;
2. read both path parameters;
3. pass both pointer fields directly to the service;
4. map not-found to `404` and invalid shirt number to `422`;
5. guard unexpected errors with `500`;
6. return the complete mapped result with `200`.

Return immediately after every error response.

### 4. Composition root

In `cmd/api/main.go`, add:

```go
func newRouter(
    registrations []models.PlayerRegistration,
) *gin.Engine
```

Construct one service and handler, create `gin.Default()`, register the exact GET and PATCH
routes, and return the engine. The supplied `main` starts the server.

## Scope preflight

- **Known and demonstrated:** models, seeded service slices, lookup loops, index mutation,
  GET, JSON binding, error mapping, shared-service routes, and `newRouter`.
- **Guided retrieval:** familiar layers in a changed soccer feature after a break.
- **New operation:** pointer fields represent omitted versus explicitly supplied values.
- **Held constant:** one feature, two routes, supplied DTOs/tests/seed/startup, no
  persistence, no DELETE, and no test authorship.

First three edits: define the model; retain the slice in the service; implement the familiar
GET lookup. The likely stuck point is applying non-nil pointer values while preserving nil
fields. Decision: **pass**—one new operation with explicit scaffolding.

## Documentation

1. [RFC 5789: PATCH](https://www.rfc-editor.org/rfc/rfc5789)
2. [Go `encoding/json.Unmarshal`](https://pkg.go.dev/encoding/json#Unmarshal)
3. [Gin binding and validation](https://gin-gonic.com/en/docs/binding/binding-and-validation/)
4. [A Tour of Go: pointers](https://go.dev/tour/moretypes/1)
5. [A Tour of Go: range](https://go.dev/tour/moretypes/16)
6. [Go `errors.Is`](https://pkg.go.dev/errors#Is)

## Verification

```sh
go test ./exercises/go/04-runnable-api-construction/050-patch-player-registration-api/services -v
go test ./exercises/go/04-runnable-api-construction/050-patch-player-registration-api/... -v
gofmt -w exercises/go/04-runnable-api-construction/050-patch-player-registration-api/{cmd/api,handlers,models,services}/*.go
npm run check:go
```

Run the API:

```sh
go run ./exercises/go/04-runnable-api-construction/050-patch-player-registration-api/cmd/api
```

### 1. Read the seed registration

```text
GET http://localhost:8080/clubs/club-1501/player-registrations/registration-5101
```

### 2. Change only the shirt number

```text
PATCH http://localhost:8080/clubs/club-1501/player-registrations/registration-5101
```

```json
{
  "shirtNumber": 10
}
```

Repeat the GET. The shirt number must be `10`, while the original notes remain.

### 3. Explicitly clear the notes

```json
{
  "notes": ""
}
```

Repeat the GET. The notes must now be empty, while the shirt number remains `10`.

### 4. Reject an explicitly supplied zero

```json
{
  "shirtNumber": 0
}
```

Expect `422`. Repeat the GET and confirm the stored registration did not change.
