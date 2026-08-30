# GO-049: Replace a Club Profile API

Target time: 80–110 minutes  
Primary focus: make a PUT replacement observable through GET

## Scenario

Build one runnable club-profile feature with two endpoints:

```text
GET /clubs/:clubID/profile  → read the current profile
PUT /clubs/:clubID/profile  → replace the complete profile
```

Both handlers use one `ClubProfileService`. The service owns an in-memory slice initialized
with seed data. After a successful PUT, a later GET must return the replacement.

This in-service state is a temporary bridge. The next arc will extract state access into a
persistence dependency instead of leaving storage responsibility in the service.

## Mental model: full replacement

PUT sends the complete new representation of the mutable profile fields. It does not merge
missing values with the old profile:

```text
locate existing profile by clubID
        ↓
construct replacement entirely from path + request body
        ↓
assign replacement at the matching slice index
        ↓
return replacement
```

When ranging over a slice, the loop value is a copy. Changing that copy does not change the
slice. Use the loop index to assign the replacement to `service.profiles[index]`.

PUT can support creation or replacement depending on an API's contract. This contract is
replacement-only: a missing club profile returns `404 Not Found`.

## Model and HTTP contract

`ClubProfile` contains:

```text
ClubID      string
Name        string
City        string
Stadium     string
FoundedYear int
```

### GET current profile

```text
GET /clubs/:clubID/profile
```

Success: `200 OK` with the profile. Missing profile:

```text
404 Not Found
{"error":"club profile not found"}
```

### PUT complete replacement

```text
PUT /clubs/:clubID/profile
Content-Type: application/json
```

Request:

```json
{
  "name": "Lisbon Athletic FC",
  "city": "Lisbon",
  "stadium": "Estadio Central",
  "foundedYear": 1912
}
```

Success: `200 OK`

```json
{
  "clubId": "club-1301",
  "name": "Lisbon Athletic FC",
  "city": "Lisbon",
  "stadium": "Estadio Central",
  "foundedYear": 1912
}
```

| Outcome | Response |
|---|---|
| malformed JSON | `400`, `{"error":"invalid request"}` |
| profile does not exist | `404`, `{"error":"club profile not found"}` |
| empty name | `422`, `{"error":"club name is required"}` |
| unexpected service error | `500`, `{"error":"internal server error"}` |
| successful replacement | `200` with the replacement |

## Your task

Work in dependency order. DTOs, errors, seed data, startup, and all tests are supplied. You
own the model, service, both handler methods, and `newRouter`.

### 1. Model

Define `models.ClubProfile` using the five fields above. Do not add JSON tags; the private
handler DTOs own the wire format.

### 2. Service

In `services/club_profile_service.go`, define:

```go
type ClubProfileService struct {
    // private profiles slice
}

func NewClubProfileService(profiles []models.ClubProfile) *ClubProfileService

func (service *ClubProfileService) FindProfile(
    clubID string,
) (models.ClubProfile, error)

func (service *ClubProfileService) ReplaceProfile(
    clubID string,
    name string,
    city string,
    stadium string,
    foundedYear int,
) (models.ClubProfile, error)
```

`FindProfile` returns the matching profile or `ErrClubProfileNotFound`.

`ReplaceProfile` must:

1. iterate with both index and profile;
2. locate the profile whose `ClubID` matches;
3. if its replacement name is empty, return an empty profile with `ErrInvalidClubName`;
4. construct a complete replacement from `clubID` and every method input;
5. assign it to the matching slice index and return it with nil;
6. return an empty profile with `ErrClubProfileNotFound` after the loop.

Do not append a second profile and do not preserve omitted old field values.

### 3. Handler

The request/response DTOs are supplied in `handlers/club_profile_handler.go` so the HTTP
contract and implementation stay visible together.

Define `ClubProfileHandler`, its constructor, and:

```go
func (handler *ClubProfileHandler) GetProfile(c *gin.Context)
func (handler *ClubProfileHandler) ReplaceProfile(c *gin.Context)
```

`GetProfile` reads `clubID`, calls `FindProfile` once, maps not-found to `404`, guards any
unexpected error with `500`, and returns the mapped profile with `200`.

`ReplaceProfile` must:

1. bind the JSON request and return `400` on failure;
2. read `clubID` from the path;
3. call `ReplaceProfile` once with every request field;
4. map not-found to `404` and invalid name to `422`;
5. guard any unexpected error with `500`;
6. return the mapped service result with `200`.

Return immediately after every error response.

### 4. Composition root

In `cmd/api/main.go`, add:

```go
func newRouter(profiles []models.ClubProfile) *gin.Engine
```

Construct one service and handler, create `gin.Default()`, register the exact GET and PUT
routes, and return the engine. The supplied `main` passes seed data and starts the server.

## Scope preflight

- **Known:** seeded slices, lookup loops, GET handlers, JSON binding, service errors,
  response mapping, two routes on one service, and `newRouter`.
- **Demonstrated:** multi-route composition, POST body flow, and full layer ownership.
- **Guided operation:** replace one slice element through its index so GET observes it.
- **New semantic demand:** PUT performs complete replacement of an existing resource.
- **Held constant:** one model/service/handler, supplied DTOs/tests/seed/startup, no
  persistence interface, no PATCH, no DELETE, and no test authorship.

First three edits: define the model; retain the slice in the service; implement
`FindProfile`. The likely stuck point is assigning the replacement to the slice rather than
the ranged value copy.

Decision: **pass**. Observable full replacement is the one raised dimension.

## Documentation

1. [RFC 9110: PUT](https://www.rfc-editor.org/rfc/rfc9110.html#name-put)
2. [Gin routing and HTTP methods](https://gin-gonic.com/en/docs/routing/)
3. [Gin model binding](https://gin-gonic.com/en/docs/binding/binding-and-validation/)
4. [A Tour of Go: range](https://go.dev/tour/moretypes/16)
5. [Go `errors.Is`](https://pkg.go.dev/errors#Is)
6. [Go HTTP status constants](https://pkg.go.dev/net/http#pkg-constants)

## Verification

```sh
go test ./exercises/go/04-runnable-api-construction/049-replace-club-profile-api/services -v
go test ./exercises/go/04-runnable-api-construction/049-replace-club-profile-api/... -v
gofmt -w exercises/go/04-runnable-api-construction/049-replace-club-profile-api/{cmd/api,handlers,models,services}/*.go
npm run check:go
```

Run the server:

```sh
go run ./exercises/go/04-runnable-api-construction/049-replace-club-profile-api/cmd/api
```

First retrieve the seed profile:

```text
GET http://localhost:8080/clubs/club-1301/profile
```

Then send:

```text
PUT http://localhost:8080/clubs/club-1301/profile
Content-Type: application/json
```

Success body (`200 OK`):

```json
{
  "name": "Lisbon Athletic FC",
  "city": "Lisbon",
  "stadium": "Estadio Central",
  "foundedYear": 1912
}
```

Empty-name body (`422 Unprocessable Entity`):

```json
{
  "name": "",
  "city": "Lisbon",
  "stadium": "Estadio Central",
  "foundedYear": 1912
}
```

Malformed body (`400 Bad Request`):

```json
{
```

Use the successful body with `/clubs/missing/profile` to confirm `404`. Finally GET
`/clubs/club-1301/profile` again and confirm it returns the replacement. Stop the server
with `Ctrl+C`.

## Completion criteria

- You authored the model, stateful service, handler methods, and complete `newRouter`.
- PUT replaces the matching slice element rather than appending or editing a loop copy.
- GET after PUT returns the replacement.
- Every error path returns before success.
- Supplied focused/workspace tests and all live requests pass.

Ask for review when finished and disclose documentation, old-code, or AI help used. No
written reflection or learner-authored test is required.
