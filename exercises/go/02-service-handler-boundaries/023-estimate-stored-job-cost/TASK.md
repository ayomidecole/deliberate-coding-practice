# GO-023: Estimate a Stored Job's Cost

Target time: 25–40 minutes  
Primary focus: independently retrieve a store-backed service contract

## Goal

Build a read-only service function that combines a stored job's worker requirement with
runtime pricing and budget information.

This is the independent retrieval after GO-022. The store still owns lookup, while this
service owns the cost calculation and budget decision.

## Mental model

```text
stored RequiredWorkers × runtime cost per worker
                         ↓
                   TotalCostCents
                         ↓
               compare with runtime budget
```

A missing job is a retrieval error. An estimate over budget is still a valid estimate, so
it returns `WithinBudget: false` with a `nil` error.

## Your task

Work only in `EstimateJobCost` in `job_cost_service.go`. Replace its placeholder body.

```go
func EstimateJobCost(
	store *jobstore.JobStore,
	jobID string,
	costPerWorkerCents int,
	budgetCents int,
) (CostEstimate, error)
```

Apply this behavior:

| Situation | Result |
|---|---|
| job ID is missing | `CostEstimate{}` and the lookup error |
| job exists | a complete `CostEstimate` and `nil` |

For a found job:

- `JobID` and `RequiredWorkers` come from the stored job.
- `TotalCostCents` is the stored worker requirement multiplied by
  `costPerWorkerCents`.
- `WithinBudget` is true when the total cost is less than or equal to `budgetCents`.

Assume costs and budgets are non-negative and stored jobs have valid IDs and positive
worker requirements.

## Scope preflight

- **Demonstrated:** store lookup, early error returns, struct construction, integer
  multiplication, and boundary comparisons.
- **Guided and being retrieved independently:** propagating the store error before
  constructing a service result.
- **New operations:** none.
- **Supplied:** result type, function signature, store implementation, and all tests.
- **Deferred:** mutation, constructors, interfaces, HTTP, test authorship, databases,
  goroutines, and channels.

Decision: **pass**. Reduced guidance and a different transformation provide the challenge.

## Start and verification

Read this task, `job_cost_service.go`, and `job_cost_service_test.go`, then run:

```sh
go test ./exercises/go/02-service-handler-boundaries/023-estimate-stored-job-cost -v
```

For clean retrieval evidence, do not reopen the GO-022 implementation while solving this
task. Use this contract, compiler output, and focused tests.

Before requesting review:

```sh
gofmt -w exercises/go/02-service-handler-boundaries/023-estimate-stored-job-cost
npm run check:go
```

## Documentation

- [A Tour of Go: multiple results](https://go.dev/tour/basics/6)
- [Go tutorial: return and handle an error](https://go.dev/doc/tutorial/handle-errors)
- [A Tour of Go: struct literals](https://go.dev/tour/moretypes/5)

## Completion criteria

- Missing jobs return the lookup error and an empty estimate.
- Found jobs return a complete cost estimate.
- Exact budget and over-budget estimates are classified correctly.
- The store remains read-only.
- Focused and repository-wide checks pass.

Ask for a code review when finished. No written reflection is required.
