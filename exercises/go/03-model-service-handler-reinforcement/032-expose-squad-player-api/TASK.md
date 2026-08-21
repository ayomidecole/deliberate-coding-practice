# GO-032: Expose the Add-Squad-Player API

Target time: 40–55 minutes  
Primary focus: retrieve the Gin handler boundary

## Goal

Connect the supplied GO-031 model and service to this endpoint:

```text
POST /teams/:teamID/squad/players
```

```text
route → handler reads path and JSON → SquadService.AddPlayer → handler writes JSON
```

- The router selects `SquadHandler.AddPlayer`.
- The handler owns HTTP input/output translation.
- The supplied service owns squad-number and position rules.
- The supplied model owns the returned player shape.

Do not add business rules to the handler or change the service.

## HTTP contract

The `teamID` comes from the URL. The remaining input comes from JSON:

```json
{
  "playerId": "player-202",
  "name": "Sofia Martins",
  "position": "midfielder",
  "squadNumber": 8
}
```

| Outcome | Response |
|---|---|
| malformed JSON | `400 Bad Request`, `{"error":"invalid request"}` |
| `services.ErrInvalidSquadNumber` | `422 Unprocessable Entity`, `{"error":"invalid squad number"}` |
| `services.ErrInvalidPosition` | `422 Unprocessable Entity`, `{"error":"invalid position"}` |
| success | `201 Created` with all five fields from the returned `SquadPlayer` |

Use `errors.Is` for the two service errors. Return immediately after every error response.
Build the success response from the service result, not directly from the request.

## Your task

### 1. Implement the handler

Replace the placeholder in `handlers/squad_handler.go`:

1. Bind the body into the supplied `addPlayerRequestJSON` DTO.
2. Read `teamID` with `c.Param("teamID")`.
3. Call `handler.service.AddPlayer` with the path value and body fields.
4. Translate both named service errors according to the contract.
5. Return the service result as `squadPlayerResponseJSON` with `201 Created`.

You will need the standard-library `errors` import for `errors.Is`.

### 2. Own one HTTP test

Add `TestAddPlayerRejectsUnsupportedPosition` to `handlers/squad_handler_test.go`.
Use the supplied router and request helpers. Send valid JSON with an unsupported position,
then assert `422 Unprocessable Entity` and `"invalid position"`.

## Scope preflight

- **Demonstrated:** Gin routes, `c.Param`, `ShouldBindJSON`, DTOs, `c.JSON`, status codes,
  `errors.Is`, service calls, early returns, and HTTP tests.
- **Guided retrieval:** coordinating path data, body data, service delegation, and error
  translation inside one handler.
- **New operations:** none.
- **Raised dimension:** reconnect the handler boundary after GO-031.
- **Test ownership:** supplied HTTP infrastructure plus one learner-authored error case.
- **Deferred:** persistence, interfaces, GET, PUT, middleware, table-driven tests,
  goroutines, and channels.

Decision: **pass**. One familiar implementation boundary is raised, with no new harness
authorship or business logic.

## Start and likely stuck point

Your first three edits are identifiable from previous work:

1. Declare a request DTO variable and bind JSON into its address.
2. Read the route parameter separately from the body.
3. Call the service before writing any success response.

The likely stuck point is deciding where each value comes from: `teamID` comes from the
path; the other four values come from the request DTO. The service result supplies every
success-response field.

## Documentation

Use these current official references:

1. [Gin: parameters in path](https://gin-gonic.com/en/docs/routing/param-in-path/) — how
   `:teamID` becomes `c.Param("teamID")`.
2. [Gin: model binding and validation](https://gin-gonic.com/en/docs/binding/binding-and-validation/) — why `ShouldBindJSON` returns an error for the handler to translate.
3. [Gin `Context` API](https://pkg.go.dev/github.com/gin-gonic/gin#Context) — reference
   for `Param`, `ShouldBindJSON`, and `JSON`.
4. [Go `errors.Is`](https://pkg.go.dev/errors#Is) — matching the named service errors.
5. [Go `net/http` status codes](https://pkg.go.dev/net/http#pkg-constants) — `400`, `422`,
   and `201` constants.
6. [Go `httptest`](https://pkg.go.dev/net/http/httptest) — supplied test infrastructure;
   use it as reference, not something to rebuild here.

The contract above is your primary guide. The docs explain the individual operations.

## Verification

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/032-expose-squad-player-api/... -v
gofmt -w exercises/go/03-model-service-handler-reinforcement/032-expose-squad-player-api
npm run check:go
```

## Completion criteria

- Malformed JSON returns exactly one `400` response.
- Both service errors return their documented `422` responses.
- Success returns `201` using the service result, including the URL's `teamID`.
- Your unsupported-position HTTP test passes.
- Focused and workspace-wide checks pass.

Ask for review when finished and disclose any documentation or AI help used. No written
reflection is required.
