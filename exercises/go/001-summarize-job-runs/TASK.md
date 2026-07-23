# GO-001: Summarize Job Runs

Target time: 25–40 minutes  
Primary focus: structs, slices, control flow, and behavioral tests

## Concept

Summarize typed records while keeping the business calculation separate from future HTTP or persistence code.

## Why it matters

Engineers need to turn requirements into predictable behavior and tests. Go's structs, slices, control flow, and testing package are the tools for doing that here.

## Scenario

A job system needs summary information for a collection of valid job runs. Implement `SummarizeJobRuns` in `summarize_job_runs.go`.

Run the focused test command before coding to observe the intentional failure.

## Required behavior

Given a slice of job runs, return a summary containing:

- `Total`: number of runs
- `Queued`, `Running`, `Succeeded`, and `Failed`: count for each status
- `TotalDurationMS`: sum of every run's duration

Additional rules:

- An empty or `nil` slice returns `RunSummary{}`.
- Assume every status is one of the four provided constants.
- Assume every duration is non-negative.
- Input validation and error returns are out of scope for this exercise.

## Your testing responsibility

Keep the starter test and add meaningful behavioral tests whose combined coverage includes:

- one run of each status;
- a mixed collection with nonzero durations;
- all fields in the expected summary.

Separate tests, named subtests, or a table-driven test are all acceptable. Use only Go's standard `testing` package and include received and expected values in failed summary comparisons.

## Constraints

- Do not change the provided types, constants, field names, or function signature.
- Do not add validation, an `error` return, HTTP, persistence, interfaces, goroutines, or channels.
- Do not use third-party packages.
- Prefer clear control flow over a compressed solution.
- Format Go files with `gofmt`.

## Required reading

- [A Tour of Go: more types](https://go.dev/tour/moretypes/1)
- [A Tour of Go: range](https://go.dev/tour/moretypes/16)
- [Go: Add a test](https://go.dev/doc/tutorial/add-a-test)

## Acceptance criteria

- All required behavior is implemented.
- Tests cover all listed cases and observable output fields.
- Focused and repository-wide checks pass.

Before editing, and while working, run:

```sh
go test ./exercises/go/001-summarize-job-runs -v
```

Before requesting review, run:

```sh
gofmt -w exercises/go/001-summarize-job-runs
npm run check
```

## When you are done

Ask for review and include short answers:

1. What part required the most thought?
2. Which test gave you the most confidence, and why?
3. Did you use the documentation or request any hints?
