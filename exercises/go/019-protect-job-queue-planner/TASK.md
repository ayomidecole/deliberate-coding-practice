# GO-019: Protect a Job Queue Planner

Target time: 35–50 minutes  
Primary focus: design collection-behavior tests and diagnose one early-exit defect

## Concept

Test how a function behaves across an entire collection, then use the failing test to locate
and repair one control-flow defect.

## Why it matters

Queue and scheduling code makes a sequence of decisions. One item that cannot be processed
should not necessarily block later items that can. A test covering only a successful list
can miss this kind of throughput defect.

## Scenario

`PlanQueue` scans jobs in their existing order and builds a plan for a fixed worker limit.
The supplied implementation passes its starter test, but it stops scanning the queue in one
situation where it should keep going.

## Required behavior

- Consider jobs in input order.
- Schedule a job when `RequiredWorkers` fits within the remaining worker limit.
- Skip a job that does not fit and continue considering later jobs.
- Preserve the relative order of scheduled job IDs.
- A job requiring exactly the remaining workers fits.
- `UsedWorkers` is the sum of workers assigned to scheduled jobs.
- `RemainingWorkers` is the worker limit minus `UsedWorkers`.
- Do not mutate the input slice or its jobs.

Assume the worker limit is non-negative, job IDs are unique and non-empty, and every
`RequiredWorkers` value is positive.

## Your testing responsibility

Keep the starter test and the supplied `assertQueuePlan` helper. Add these two tests in
`queue_planner_test.go`:

1. **Exact remaining capacity**
   - Use at least two jobs.
   - After an earlier job is scheduled, make the next job require exactly all remaining
     workers.
   - Expect both jobs to be scheduled and `RemainingWorkers` to be `0`.

2. **Skip and continue**
   - Use three jobs in this order: a job that fits, a job that is too large for the
     remaining capacity, and a smaller job that still fits.
   - Expect the first and third job IDs in `ScheduledIDs`.
   - Do not expect the middle job ID.
   - Calculate `UsedWorkers` and `RemainingWorkers` using only the scheduled jobs.

Choose the job IDs, worker counts, test names, and expected plans yourself. Each test must
assert the complete returned `QueuePlan` by calling the supplied helper.

## Your implementation responsibility

Do not edit `queue_planner.go` until both new tests exist.

Run the focused tests. The exact-capacity test should pass. The skip-and-continue test
should fail because the current function stops when it reaches the oversized middle job.

Use that failure to inspect the loop and the branch that handles a job that does not fit.
Make the smallest readable change needed to satisfy the required behavior, then rerun the
tests.

## Order of work

1. Run the supplied focused test suite once.
2. Add the exact-remaining-capacity test and run the suite.
3. Add the skip-and-continue test and run the suite.
4. Confirm that the second test fails for the expected reason.
5. Repair only the incorrect queue-scanning behavior.
6. Format the files and run both verification commands.

## Constraints

- Write the missing tests before editing the implementation.
- Do not change the exported types or function signature.
- Do not delete or weaken the starter test or assertion helper.
- Do not change an expected result merely to match the current implementation.
- Do not add errors, maps, sorting, HTTP, persistence, interfaces, goroutines, channels, or
  third-party packages.

## Documentation

- [Go tutorial: add a test](https://go.dev/doc/tutorial/add-a-test)
- [A Tour of Go: range](https://go.dev/tour/moretypes/16)
- [`slices.Equal`](https://pkg.go.dev/slices#Equal) — used by the supplied helper

## Commands

Run the focused suite before editing and after each meaningful change:

```sh
go test ./exercises/go/019-protect-job-queue-planner -v
```

Before requesting review:

```sh
gofmt -w exercises/go/019-protect-job-queue-planner
npm run check:go
```

## Acceptance criteria

- At least two learner-authored tests protect exact capacity and skip-then-continue
  behavior.
- Both tests assert scheduled IDs and worker totals.
- A learner-authored test fails against the supplied implementation.
- The production repair is limited to the incorrect queue-scanning behavior.
- Focused and repository-wide checks pass after the repair.

## When you are done

Ask for a code review. No written reflection is required.
