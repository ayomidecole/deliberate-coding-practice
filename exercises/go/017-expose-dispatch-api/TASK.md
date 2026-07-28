# GO-017: Expose the Dispatch Service

Target time: 35–50 minutes  
Primary focus: translate service outcomes into HTTP contracts

## Why this matters

A handler owns transport concerns; a service owns business rules. Keeping that boundary
clear prevents HTTP details from leaking into domain logic and lets another transport call
the same service later.

## Request flow

```text
POST JSON
  → Gin binds an API request
  → handler converts it to DispatchRequest
  → PlanDispatch applies business rules
  → handler maps the plan or error to HTTP
```

The route, API request/response types, JSON binding, conversions, and malformed-JSON
response are supplied in `dispatch_api.go`.

## Your task

Work only in `createDispatchPlan`. Replace the `_ = request` placeholder.

Call `dispatch.PlanDispatch(request)` and map its outcome:

| Service outcome | HTTP response |
|---|---|
| `dispatch.ErrAttemptsExhausted` | `409 Conflict` and `{"error":"attempts exhausted"}` |
| `dispatch.ErrInsufficientWorkers` | `503 Service Unavailable` and `{"error":"insufficient workers"}` |
| successful plan | `201 Created` and `newDispatchPlanJSON(plan)` |

Use `errors.Is` for both domain errors. Return immediately after writing either error
response.

## Supplied binding scaffold

`ShouldBindJSON(&body)` decodes the request body into the supplied API type. It returns an
error without automatically writing a response, so the handler controls the `400` JSON
contract. The API type has JSON tags; `toDomain` keeps transport naming separate from the
service model.

## Constraints

- Do not change the route, supplied types, conversions, or tests.
- Do not duplicate the business rules from `PlanDispatch`.
- Do not call `c.JSON` more than once on any request path.
- Do not add persistence, interfaces, middleware, validation rules, a real server, or
  third-party packages.

## Documentation

- [Gin binding guide](https://gin-gonic.com/en/docs/binding/)
- [Gin quickstart](https://gin-gonic.com/en/docs/quickstart/)
- [`Context.ShouldBindJSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.ShouldBindJSON)
- [`Context.JSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.JSON)
- [Gin testing guide](https://gin-gonic.com/en/docs/testing/) — tests are supplied

## Commands

Start here:

```sh
go test ./exercises/go/017-expose-dispatch-api -v
```

Before review:

```sh
gofmt -w exercises/go/017-expose-dispatch-api
npm run check:go
```

## Done when

All four HTTP outcomes pass and you can explain why the handler maps domain errors instead
of making the dispatch decision itself.

When requesting review, report documentation, hints, previous-solution lookup, and outside
AI assistance.
