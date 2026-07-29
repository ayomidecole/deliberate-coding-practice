# GO-022: Check a Stored Job's Capacity

Target time: 25–40 minutes  
Primary focus: turn stored data and runtime input into one service decision

## Goal

Build a small read-only service function. It should find a stored job and report whether
the currently available workers are enough to dispatch it.

This practices a practical boundary: a store owns retrieval, while a service combines the
retrieved data with current operating conditions.

## Mental model

```text
job ID + available workers
          ↓
      CheckDispatch
          ↓
  JobStore.FindByID
          ↓
missing → error
found   → complete DispatchCheck
```

`FindByID` returns a `Job` value. That copy is appropriate here because `CheckDispatch`
only reads the job; it does not update stored state.

Insufficient workers is not a lookup failure. It is a valid decision represented by
`CanDispatch: false`.

## Your task

Work only in `CheckDispatch` in `job_service.go`. Replace its placeholder body.

```go
func CheckDispatch(
	store *jobstore.JobStore,
	jobID string,
	availableWorkers int,
) (DispatchCheck, error)
```

Apply this behavior:

| Situation | Result |
|---|---|
| job ID is missing | `DispatchCheck{}` and the lookup error |
| job exists | a complete `DispatchCheck` and `nil` |

For a found job, populate:

| Field | Value |
|---|---|
| `JobID` | stored job ID |
| `RequiredWorkers` | stored job requirement |
| `AvailableWorkers` | function input |
| `CanDispatch` | `true` when available workers are at least the required workers |

Exact capacity is sufficient. Assume `availableWorkers` is non-negative and stored jobs
have valid IDs and positive worker requirements.

## Scope preflight

- **Known/demonstrated:** structs, comparisons, multiple returns, zero values, named
  errors, cross-package calls, and complete result construction.
- **Guided and being retrieved:** using a store lookup inside a service decision and
  propagating its error.
- **New operations:** none.
- **Supplied:** types, function signature, store implementation, and all tests.
- **Deferred:** mutation, constructors, interfaces, HTTP, test authorship, databases,
  goroutines, and channels.

Decision: **pass**. This is a focused retrieval and integration task.

## Start and verification

Read `job_service.go` and `job_service_test.go`, then run:

```sh
go test ./exercises/go/022-check-stored-job-capacity -v
```

Your first implementation step is to call `store.FindByID(jobID)` and handle both returned
values. Complete the result from the contract rather than copying an expected value from a
test.

Before requesting review:

```sh
gofmt -w exercises/go/022-check-stored-job-capacity
npm run check:go
```

## Documentation

- [A Tour of Go: multiple results](https://go.dev/tour/basics/6)
- [Go tutorial: return and handle an error](https://go.dev/doc/tutorial/handle-errors)
- [A Tour of Go: struct literals](https://go.dev/tour/moretypes/5)

## Completion criteria

- Missing jobs return the store's error and an empty result.
- Found jobs return every documented field.
- Insufficient and exact capacity are classified correctly.
- The store remains read-only.
- Focused and repository-wide checks pass.

Ask for a code review when finished. No written reflection is required.
