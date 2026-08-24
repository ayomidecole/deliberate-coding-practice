# GO-037: Request a Match Substitution

Target time: 50–70 minutes  
Primary focus: repeat full-slice ownership with changed data flow

## API context

Implement one complete stateless endpoint:

```text
POST /matches/:matchID/substitutions

path + JSON → handler → service → model → handler response
```

The request supplies the substitution and player IDs. The service validates the business
rule and adds the initial status. Persistence comes later.

## Contract

Request body:

```json
{
  "substitutionId": "substitution-805",
  "outgoingPlayerId": "player-815",
  "incomingPlayerId": "player-816"
}
```

Successful response:

```json
{
  "id": "substitution-805",
  "matchId": "match-805",
  "outgoingPlayerId": "player-815",
  "incomingPlayerId": "player-816",
  "status": "requested"
}
```

| Outcome | Response |
|---|---|
| malformed JSON | `400 Bad Request`, `{"error":"invalid request"}` |
| outgoing and incoming IDs match | `422 Unprocessable Entity`, `{"error":"players must differ"}` |
| success | `201 Created` with every field from the service result |

## Your task

Work in dependency order. Constants, handler DTO scaffolding, route setup, and all tests
are supplied. You own the model, service, and handler behavior.

### 1. Model

In `models/substitution.go`, define `Substitution` by translating the successful response
into idiomatic exported Go fields and types. Do not add JSON tags.

### 2. Service

In `services/substitution_service.go`, define:

- `ErrSamePlayer` as a package-level error;
- an empty `SubstitutionService` type;
- `NewSubstitutionService() *SubstitutionService`;
- `RequestSubstitution(matchID, substitutionID, outgoingPlayerID, incomingPlayerID string) (models.Substitution, error)`.

The method must:

1. return an empty model and `ErrSamePlayer` when the two player IDs match;
2. otherwise return a complete model with `Status` set to
   `constants.SubstitutionStatusRequested`.

### 3. Handler

Implement the supplied `RequestSubstitution` method in
`handlers/substitution_handler.go`:

1. bind the request DTO and return the documented `400` response on failure;
2. call the service with `matchID` from the path and the three request fields;
3. translate `services.ErrSamePlayer` with `errors.Is`, then return the documented `422`
   response;
4. return `201 Created` by projecting every field from the service result.

Do not put the same-player rule in the handler. The response status comes from the service,
not from the request.

## Scope preflight

- **Demonstrated:** model translation, package errors, service construction, validation,
  handler binding/delegation, error mapping, and success projection.
- **New operations:** none.
- **Raised dimension:** three body fields and a service-derived response field.
- **Held constant:** one endpoint, one error branch, familiar POST handling, supplied DTO
  scaffolding, and fully supplied tests.
- **Deferred:** persistence, interfaces, middleware, query parameters, learner-authored
  tests, collections, goroutines, and channels.

Decision: **pass**. Data flow changes without increasing branch complexity.

## First three milestones

1. Define the model from the successful response.
2. Implement the complete service contract.
3. Implement the handler after the service package compiles.

The likely data-source mistake is mixing the layers: `matchID` comes from the path, the
three request fields come from JSON, and `status` comes from the service result.

## Documentation

1. [A Tour of Go: structs](https://go.dev/tour/moretypes/2)
2. [A Tour of Go: methods](https://go.dev/tour/methods/1)
3. [Go: return and handle errors](https://go.dev/doc/tutorial/handle-errors)
4. [Gin routing](https://gin-gonic.com/en/docs/routing/)
5. [Gin path parameters](https://gin-gonic.com/en/docs/routing/param-in-path/)
6. [Gin binding](https://gin-gonic.com/en/docs/binding/binding-and-validation/)
7. [Gin `Context`](https://pkg.go.dev/github.com/gin-gonic/gin#Context)

## Verification

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/037-request-match-substitution-api/services -v
go test ./exercises/go/03-model-service-handler-reinforcement/037-request-match-substitution-api/... -v
gofmt -w exercises/go/03-model-service-handler-reinforcement/037-request-match-substitution-api/{constants,handlers,models,services}/*.go
npm run check:go
```

## Completion criteria

- You authored the model, service, and complete handler behavior.
- The service rejects a player replacing themself and supplies the requested status.
- The handler owns HTTP translation but no substitution business rules.
- Success uses every field from the service result.
- Focused and workspace-wide Go checks pass.

Ask for review when finished and disclose any documentation, old-code, or AI help used.
No written reflection is required.
