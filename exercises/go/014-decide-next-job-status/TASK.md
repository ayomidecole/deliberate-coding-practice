# GO-014: Decide the Next Job Status

Target time: 25–40 minutes  
Primary focus: combine struct modeling with ordered control flow

## Why this matters

Background-job systems apply transition rules to stored job state. Terminal outcomes must
remain stable, even when another rule also matches, or a successful job could later be
reported as failed.

## Contract

The status constants are supplied in `job_status.go`.

Define an exported `Job` struct with these exported fields:

- `ID`: the job identifier
- `Status`: the current status
- `Attempts`: attempts already made
- `MaxAttempts`: the attempt limit

Choose the field types from their meanings and the supplied tests.

Then implement:

```go
func NextJobStatus(job Job) string
```

Apply these rules in order:

1. A job whose status is `StatusSucceeded` or `StatusFailed` keeps that status.
2. Any other job at or above `MaxAttempts` becomes `StatusFailed`.
3. Any other job becomes `StatusRunning`.

Assume `Status` is one of the supplied constants, `Attempts` is non-negative, and
`MaxAttempts` is positive.

## Constraints

- Work only in `job_status.go`; do not change or add tests.
- Use the supplied status constants instead of repeating their string values.
- Do not mutate the received job.
- Do not use errors, loops, slices, maps, methods, pointers, interfaces, or helpers.

## Documentation

- [A Tour of Go: structs](https://go.dev/tour/moretypes/2)
- [A Tour of Go: struct fields](https://go.dev/tour/moretypes/3)
- [A Tour of Go: if statements](https://go.dev/tour/flowcontrol/5)

## Commands

Start here:

```sh
go test ./exercises/go/014-decide-next-job-status -v
```

Before review:

```sh
gofmt -w exercises/go/014-decide-next-job-status
npm run check:go
```

## Done when

All checks pass and you can explain why the terminal-status rule must run before the
attempt-limit rule.

When requesting review, report documentation, hints, previous-solution lookup, and outside
AI assistance.
