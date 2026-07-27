# GO-009: Calculate Retry Delay

Target time: 25–40 minutes  
Primary focus: translate a reliability policy into explicit control flow

## Scope preflight

- Guided retrieval: integer comparisons, arithmetic, `if`, and early returns.
- Guided retrieval: return the correct `(int, error)` pair on every path.
- Supplied: function signature, named error, complete contract, and all tests.
- New operations: none.
- Deferred: test authorship, loops, structs, interfaces, timers, HTTP, and concurrency.

Decision: **pass**. This retrieves foundations without adding another difficulty dimension.

## Why this matters

Systems often wait between retries so they do not repeatedly hammer a failing dependency.
They also cap that delay so recovery does not become unreasonably slow. Keeping the policy
in a pure function makes it easy to understand and reuse without involving real timers or
network calls.

## Contract

`CalculateRetryDelay` receives a one-based attempt number and returns a delay in seconds.
This exercise uses a deliberately simple linear policy:

| Attempt | Delay | Error |
|---|---:|---|
| `attempt <= 0` | `0` | `ErrInvalidAttempt` |
| `1` through `3` | `attempt * 2` | `nil` |
| `4` or greater | `6` | `nil` |

Examples: attempt `1` waits `2` seconds, attempt `3` waits `6`, and later attempts remain
capped at `6`.

## Your task

Work only in `retry_delay.go`. Replace the placeholder return with an implementation of
the contract. Choose and order the branches yourself.

## Constraints

- Do not change or add tests.
- Do not change the signature or `ErrInvalidAttempt`.
- Use straightforward `if` statements and returns.
- Do not use loops, slices, maps, helpers, timers, or third-party packages.

## Documentation

- [A Tour of Go: if statements](https://go.dev/tour/flowcontrol/5)
- [Go tutorial: return and handle an error](https://go.dev/doc/tutorial/handle-errors)
- [A Tour of Go: multiple results](https://go.dev/tour/basics/6)

## Commands

Start here:

```sh
go test ./exercises/go/009-calculate-retry-delay -v
```

Before review:

```sh
gofmt -w exercises/go/009-calculate-retry-delay
npm run check:go
```

## Done when

All three input regions pass, formatting and Go checks pass, and you can explain why the
delay stays at `6` after attempt `3`.

When requesting review, report documentation, hints, previous-solution lookup, and outside
AI assistance.
