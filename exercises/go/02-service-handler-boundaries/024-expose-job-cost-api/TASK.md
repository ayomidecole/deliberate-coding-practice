# GO-024: Expose Job Cost Estimates

Target time: 35–50 minutes  
Primary focus: integrate a Gin handler with a store-backed service

## Goal

Expose GO-023's cost estimate through HTTP while preserving component ownership:

- the handler owns JSON and HTTP;
- `EstimateJobCost` owns lookup and cost decisions;
- `JobStore` owns stored jobs.

## Mental model

```text
POST JSON
    ↓
Gin handler binds job ID, rate, and budget
    ↓
jobcost.EstimateJobCost
    ↓
missing job → 404 JSON
estimate    → 200 JSON
```

`ShouldBindJSON` returns a binding error for the handler to map. It does not write this
exercise's custom error response automatically.

## Your task

Work only in `estimateJobCost` in `job_cost_handler.go`. Replace its placeholder body and
add the standard `errors` import needed by `errors.Is`.

You are not creating or changing the store, service, router, request type, response type,
or tests. Your entire handler has three stages:

```text
1. Bind the request JSON.
   binding fails → write 400 JSON and return

2. Call jobcost.EstimateJobCost with handler.store and the three body fields.
   job is missing → write 404 JSON and return

3. Convert the successful estimate with newJobCostResponse.
   write 200 JSON
```

Apply this complete HTTP contract:

| Outcome | Response |
|---|---|
| malformed JSON | `400 Bad Request` and `{"error":"invalid request"}` |
| `jobstore.ErrJobNotFound` | `404 Not Found` and `{"error":"job not found"}` |
| successful estimate | `200 OK` and `newJobCostResponse(estimate)` |

For stage 1, declare a `jobCostRequestJSON` variable and pass its address to
`c.ShouldBindJSON`.

For stage 2, pass these values to the service in signature order:

- `handler.store`
- `body.JobID`
- `body.CostPerWorkerCents`
- `body.BudgetCents`

Identify the missing-job error with `errors.Is`. Return immediately after either error
response. Do not calculate cost or budget status in the handler.

Assume every successfully decoded request contains non-negative costs and budgets.
Validation rules are out of scope.

## Scope preflight

- **Demonstrated:** Gin `POST`, JSON binding and responses, early returns, DTOs,
  `errors.Is`, injected store state, and HTTP status mapping.
- **Retrieved:** GO-023's store-backed service contract.
- **Guided and being retrieved:** composing the handler, service, and store without moving
  responsibilities between them.
- **New operations:** none.
- **Supplied:** router, handler/store wiring, JSON types, response conversion, and all
  HTTP tests.
- **Deferred:** test authorship, mutation, interfaces, validation, middleware, databases,
  goroutines, and channels.

Decision: **pass**. Integration is the only raised difficulty dimension.

## Start and verification

Read `job_cost_handler.go` and its tests, then run:

```sh
go test ./exercises/go/02-service-handler-boundaries/024-expose-job-cost-api -v
```

Implement and test one stage at a time in the order shown under **Your task**.

Before requesting review:

```sh
gofmt -w exercises/go/02-service-handler-boundaries/024-expose-job-cost-api
npm run check:go
```

## Documentation

- [Gin: binding](https://gin-gonic.com/en/docs/binding/)
- [`Context.ShouldBindJSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.ShouldBindJSON)
- [`Context.JSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.JSON)
- [Gin: testing](https://gin-gonic.com/en/docs/testing/) — tests are supplied
- [`errors.Is`](https://pkg.go.dev/errors#Is)

## Completion criteria

- All three HTTP outcomes follow the documented status and JSON contracts.
- The injected store is the service's data source.
- No cost or budget rule is duplicated in the handler.
- Every response path writes JSON once.
- Focused and repository-wide checks pass.

Ask for a code review when finished. No written reflection is required.
