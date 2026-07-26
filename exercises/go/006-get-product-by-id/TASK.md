# GO-006: Get a Product by ID

Target time: 30–45 minutes  
Primary focus: translate a path value and lookup result into an HTTP response

## Scope preflight

- Familiar: Gin route registration, JSON responses, branches, structs, and HTTP status
  constants.
- New but guided: declaring a route parameter with `:name` and reading it with
  `Context.Param`.
- Supplied: router creation, product model/catalog, lookup helper, and all tests.
- Your meaningful work: connect input → lookup → either a success or error response.
- Deferred: request bodies, validation, persistence, layers, middleware, and test authorship.

Decision: **pass**. This introduces one Gin input mechanism and retrieves the error-contract
work from GO-002.

## Mental model

```text
GET /api/products/keyboard
        ↓
router extracts "keyboard" from :id
        ↓
handler looks up the product
        ↓
found → 200 + product JSON
missing → 404 + error JSON
```

A colon declares a named path parameter. The name passed to `Param` must match it:

```go
router.GET("/orders/:orderID", getOrder)
orderID := c.Param("orderID")
```

`Param` returns a string. The supplied `findProduct` helper returns a product and a
`bool`: `true` means it was found.

## Your task

Work only in `product_api.go`:

1. Register `GET /api/products/:id` so it runs `getProduct`.
2. Read `id` from the path.
3. Use `findProduct`.
4. If found, return `200 OK` with the product as JSON.
5. If missing, return `404 Not Found` with:

```json
{"error": "product not found"}
```

Read both supplied tests before coding.

## Constraints

- Do not change or add tests.
- Use `http.StatusOK` and `http.StatusNotFound`, not numeric status codes.
- Preserve the provided names and data.
- Do not start a real server.
- Resolve the TODO comments before requesting review.

## Documentation

- [`Engine.GET`](https://pkg.go.dev/github.com/gin-gonic/gin#Engine.GET)
- [`Context.Param`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.Param)
- [`Context.JSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.JSON)
- [`net/http` status constants](https://pkg.go.dev/net/http#pkg-constants)

## Commands

Start here:

```sh
go test ./exercises/go/006-get-product-by-id -v
```

Before review:

```sh
gofmt -w exercises/go/006-get-product-by-id
npm run check
```

## Done when

Both paths return the required status, JSON content type, and body, and all repository
checks pass.

When requesting review, explain why the handler must return after writing the `404`, and
report any hints or outside AI assistance.
