# GO-025: Expose a Shipping Quote API

Target time: 30–45 minutes  
Primary focus: independently connect an HTTP handler to a service

## Goal

Implement the HTTP boundary for a supplied shipping-quote feature. The handler should
translate JSON into a service call and translate the service result back into HTTP.

Only the packages currently being practiced are present:

```text
service/         quote calculation
handler/         HTTP translation and routing
```

In Go, each folder is a separate package. `domain` and `persistence` are not needed for
this behavior, so they are intentionally absent. They will be introduced when their
responsibilities become part of the learning target.

## Mental model and dependency map

```text
POST JSON → handler → quote service
                ↓             ↓
          HTTP response   quote calculation
```

| Source | Supplied contract | Ownership |
|---|---|---|
| `service/quote_service.go` | `service.BuildQuote(shipmentID string, distanceMiles int, ratePerMileCents int) (service.ShippingQuote, error)` | validation and quote calculation |
| `service/quote_service.go` | `service.ErrInvalidDistance` | service-level invalid-distance contract |
| `handler/router.go` | `NewRouter(service *service.QuoteService) *gin.Engine` | handler construction and routing |
| `handler/quote_handler.go` | `handler.createQuote(c *gin.Context)` | request/response translation |

The handler already receives `*QuoteService`. It should not validate the distance or
calculate the quote itself.

## Your task

Work only in `handler/quote_handler.go`. Implement `createQuote`.

Request:

```json
{
  "shipmentId": "shipment-42",
  "distanceMiles": 120,
  "ratePerMileCents": 8
}
```

Apply this contract:

| Outcome | Response |
|---|---|
| malformed JSON | `400 Bad Request` and `{"error":"invalid request"}` |
| `service.ErrInvalidDistance` | `422 Unprocessable Entity` and `{"error":"invalid distance"}` |
| quote created | `200 OK` and all fields from the `ShippingQuote` result |

The successful response shape is:

```json
{
  "shipmentId": "shipment-42",
  "distanceMiles": 120,
  "ratePerMileCents": 8,
  "totalCostCents": 960
}
```

Use `errors.Is` to identify `service.ErrInvalidDistance`. Return immediately after either
error response. Assume every successfully decoded rate is non-negative; additional
validation is out of scope.

## Scope preflight

- **Demonstrated:** declaring and binding a request DTO, early returns, `errors.Is`, Gin
  JSON responses, constructing a response DTO, and calling across Go packages.
- **Guided in GO-024 and being retrieved independently:** call the handler's service with
  request values, capture its result and error, and preserve the service boundary.
- **New operations:** none.
- **Supplied:** both package boundaries and imports, service behavior, handler field,
  router wiring, route, DTO types, and all HTTP tests.
- **Deferred:** test authorship, composition roots, interfaces, handler validation,
  databases, middleware, configuration, goroutines, and channels.

Decision: **pass**. This reduces guidance while keeping the same integration capability;
no second difficulty dimension is raised.

## Start and verification

Read the two packages in the dependency map before editing. Begin by binding the request
into the supplied `quoteRequestJSON` type.

Run:

```sh
go test ./exercises/go/02-service-handler-boundaries/025-expose-shipping-quote-api/... -v
```

Before requesting review:

```sh
gofmt -w exercises/go/02-service-handler-boundaries/025-expose-shipping-quote-api
npm run check:go
```

## Documentation

Use these after your independent attempt if needed:

- [Gin: binding](https://gin-gonic.com/en/docs/binding/)
- [`Context.JSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.JSON)
- [`errors.Is`](https://pkg.go.dev/errors#Is)
- [A Tour of Go: multiple results](https://go.dev/tour/basics/6)
- [Go: organizing a module](https://go.dev/doc/modules/layout)

## Completion criteria

- Malformed JSON returns the documented `400` response.
- An invalid distance returns the documented `422` response.
- A valid request returns every quote field with `200`.
- The handler delegates validation and calculation to `QuoteService`.
- Every request path writes one JSON response.
- Focused and repository-wide checks pass.

Ask for a code review when finished. No written reflection is required.
