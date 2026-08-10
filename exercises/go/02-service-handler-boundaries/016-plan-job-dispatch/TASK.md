# GO-016: Plan a Job Dispatch

Target time: 30–45 minutes  
Primary focus: own every return path in a service-layer operation

## Why this matters

A handler should translate transport data, while a service operation owns business
decisions. `PlanDispatch` will later give an HTTP handler one clear contract: either a
structured dispatch plan or a domain error that can be mapped to a response.

## Supplied contract

`dispatch_service.go` already contains:

- `DispatchRequest`, the service input;
- `DispatchPlan`, the successful result;
- `StatusScheduled`;
- `ErrAttemptsExhausted` and `ErrInsufficientWorkers`.

Implement:

```go
func PlanDispatch(request DispatchRequest) (DispatchPlan, error)
```

Apply these rules in order:

1. When `Attempts >= MaxAttempts`, return an empty `DispatchPlan` and
   `ErrAttemptsExhausted`.
2. Otherwise, when `AvailableWorkers < RequiredWorkers`, return an empty `DispatchPlan`
   and `ErrInsufficientWorkers`.
3. Otherwise, return a plan containing:
   - the request's `JobID`;
   - `StatusScheduled`;
   - the required number of workers as `WorkersAssigned`;
   - available workers minus required workers as `RemainingWorkers`;
   - the request's attempts plus one as `Attempt`;
   - `nil` error.

Assume the ID is non-empty, worker counts and attempts are non-negative,
`RequiredWorkers` is positive, and `MaxAttempts` is positive.

## Your task

Work only in `dispatch_service.go`. Replace the placeholder function body without changing
the supplied types, constants, errors, or signature.

## Constraints

- Do not change or add tests.
- Use the supplied errors; do not create new ones.
- Do not mutate the request.
- Do not use loops, slices, maps, methods, pointers, interfaces, helpers, HTTP, or
  third-party packages.

## Documentation

- [A Tour of Go: multiple results](https://go.dev/tour/basics/6)
- [Go tutorial: return and handle an error](https://go.dev/doc/tutorial/handle-errors)
- [A Tour of Go: struct literals](https://go.dev/tour/moretypes/5)

## Commands

Start here:

```sh
go test ./exercises/go/02-service-handler-boundaries/016-plan-job-dispatch -v
```

Before review:

```sh
gofmt -w exercises/go/02-service-handler-boundaries/016-plan-job-dispatch
npm run check:go
```

## Done when

All checks pass and you can explain why attempts exhaustion is checked before worker
availability and why failure returns an empty plan.

When requesting review, report documentation, hints, previous-solution lookup, and outside
AI assistance.
