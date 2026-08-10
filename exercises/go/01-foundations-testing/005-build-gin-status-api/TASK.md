# GO-005: Build a Gin Status API

Target time: 25–40 minutes  
Primary focus: connect one Gin route to one JSON response

## Scope preflight

- Familiar: Go functions, maps/structs, HTTP status constants, and reading supplied tests.
- New but guided: `Engine.GET` registers a route; `Context.JSON` writes JSON.
- Supplied: Gin setup, router creation, handler signature, dependency, and all tests.
- Your meaningful decision: represent the response with `gin.H` or a small typed struct.
- Deferred: request input, validation, errors, middleware, servers, persistence, layers,
  goroutines, and channels.

Decision: **pass**. The framework APIs are explained without supplying the target solution.

## Mental model

```text
request → router matches method and path → handler runs → JSON response
```

`gin.Engine` is the router. A route registration connects three things:

```go
router.POST("/widgets", createWidget)
```

That example means: when a `POST /widgets` request arrives, run `createWidget`.

The handler receives a `*gin.Context`. Its `JSON` method accepts an HTTP status and a Go
value:

```go
c.JSON(http.StatusCreated, gin.H{"id": "widget-1"})
```

Gin serializes the value, sets the JSON content type, and writes the response.

`gin.H` is a convenient map. A struct gives the response a named, reusable shape. Either
is valid here; choose intentionally.

## Your task

Work only in `status_api.go`:

1. Register `GET /api/status` so it runs `getStatus`.
2. Implement `getStatus`.
3. Return status `200 OK` and this JSON object:

```json
{
  "service": "inventory",
  "status": "ready"
}
```

Read the supplied test before coding. It decodes JSON, so object key order does not matter.

## Constraints

- Do not change or add tests.
- Preserve the provided function names and return type.
- Do not start a real server.
- Keep routing and response construction in the provided functions.

## Documentation

- [Gin quickstart](https://gin-gonic.com/en/docs/quickstart/)
- [`Engine.GET`](https://pkg.go.dev/github.com/gin-gonic/gin#Engine.GET)
- [`Context.JSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.JSON)
- [Gin testing guide](https://gin-gonic.com/en/docs/testing/) — reference only; tests are supplied

## Commands

```sh
go test ./exercises/go/01-foundations-testing/005-build-gin-status-api -v
```

Before review:

```sh
gofmt -w exercises/go/01-foundations-testing/005-build-gin-status-api
npm run check
```

## Done when

The route returns the required status, JSON content type, and decoded body; formatting,
vetting, and all repository checks pass.

When requesting review, explain your response-representation choice and report any hints
or outside AI assistance.
