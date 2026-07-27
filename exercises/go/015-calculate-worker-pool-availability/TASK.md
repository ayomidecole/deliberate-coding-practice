# GO-015: Calculate Worker-Pool Availability

Target time: 30–45 minutes  
Primary focus: model and implement a multi-reason error contract

## Why this matters

A scheduler must distinguish invalid configuration, invalid runtime data, and an
over-capacity pool. Named errors let callers react to those failures without comparing
error-message text.

## Mental model

A Go function returning `(value, error)` has one combined contract:

- failure returns the documented zero value and the appropriate error;
- success returns the calculated value and `nil`.

Package-level errors created with `errors.New` are sentinel errors. Callers and tests can
identify them with `errors.Is`.

## Your task

Work only in `worker_pool.go`.

Define these exported sentinel errors with clear messages:

- `ErrInvalidCapacity`
- `ErrInvalidActiveJobs`
- `ErrOverCapacity`

Define an exported `WorkerPool` struct with these exported fields:

- `Name`: the pool identifier
- `Capacity`: maximum supported active jobs
- `ActiveJobs`: current active jobs

Choose the field types from their meanings and the supplied tests.

Then implement:

```go
func AvailableSlots(pool WorkerPool) (int, error)
```

Apply these rules in order:

1. `Capacity <= 0` returns `0, ErrInvalidCapacity`.
2. `ActiveJobs < 0` returns `0, ErrInvalidActiveJobs`.
3. `ActiveJobs > Capacity` returns `0, ErrOverCapacity`.
4. Otherwise, return the number of available slots and `nil`.

## Constraints

- Do not change or add tests.
- Return the supplied sentinel variable for each failure; do not create a new error inside
  the function.
- Do not mutate the received pool.
- Do not use loops, slices, maps, methods, pointers, interfaces, helpers, or third-party
  packages.

## Documentation

- [Go tutorial: return and handle an error](https://go.dev/doc/tutorial/handle-errors)
- [`errors.New` reference](https://pkg.go.dev/errors#New)
- [A Tour of Go: multiple results](https://go.dev/tour/basics/6)

## Commands

Start here:

```sh
go test ./exercises/go/015-calculate-worker-pool-availability -v
```

Before review:

```sh
gofmt -w exercises/go/015-calculate-worker-pool-availability
npm run check:go
```

## Done when

All checks pass and you can explain why invalid capacity takes precedence when both
capacity and active jobs are invalid.

When requesting review, report documentation, hints, previous-solution lookup, and outside
AI assistance.
