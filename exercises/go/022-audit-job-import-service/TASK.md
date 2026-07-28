# GO-022: Audit a Job Import Service

Target time: 35–50 minutes  
Primary focus: author a regression test and repair one service-state defect

## Scope preflight

- **Known:** ordinary Go tests, structs, slices, loops, `errors.Is`, complete expected
  values, and `JobStore` methods.
- **Demonstrated:** collection-state reasoning, one-defect debugging, and verifying both a
  returned result and stored state.
- **New operations:** none.
- **Supplied:** service types, an implementation with one isolated defect, one passing
  starter test, and a summary assertion helper.
- **Your increased responsibility:** design one regression test with less step-by-step
  assertion guidance, then make the narrow production repair.
- **Deferred:** HTTP, interfaces, databases, table-driven tests, goroutines, channels, and
  new validation rules.

Decision: **pass**. This is a retrieval task, not a novelty task.

## Concept

A service result and its persistence side effects describe one operation. A test should
detect disagreement between them.

```text
input jobs → ImportJobs → ImportSummary
                         ↘ shared JobStore state
```

If a duplicate is rejected by the store, the summary must not claim that it was added.
Processing must still continue so later new jobs can be imported.

## Why it matters

Batch operations commonly have partial success. Callers need an accurate summary, while
the database or store must contain exactly the records reported as successful. Testing
only the returned value or only the store can miss a split-brain contract where those two
observations disagree.

## Required behavior

`ImportJobs` receives an existing `*JobStore` and a slice of jobs.

- Consider every input job in order.
- A newly added job ID appears in `AddedIDs`.
- A rejected duplicate ID appears in `DuplicateIDs` and not in `AddedIDs`.
- A duplicate may already exist before the import or may have been added earlier in the
  same import.
- A duplicate does not replace the original stored job.
- Continue processing after a duplicate.
- Preserve input order within both result slices.
- `StoredCount` equals `store.Count()` after the complete import.
- Empty input returns empty ID slices and the store's current count.

Assume every job ID is non-empty and every `RequiredWorkers` value is positive.

## Your testing responsibility

Work in `job_import_test.go` first. Keep the starter test and `assertImportSummary`.

Add one regression test with this shape:

- preload one original job into the store;
- import three jobs in order: a new job, a duplicate of the preloaded ID with different
  worker data, and another new job;
- assert the complete `ImportSummary`;
- verify the preloaded job was not replaced;
- verify the later new job was stored.

Choose the IDs, worker counts, test name, and expected values yourself.

Run the focused suite after adding the test. Your test should fail against the supplied
implementation.

## Your implementation responsibility

Only after observing the failure, inspect `ImportJobs` and make the smallest readable
repair. Do not rewrite the store or change the public contract.

## Constraints

- Write the regression test before editing `job_import.go`.
- Do not change or weaken the starter test or assertion helper.
- Do not change GO-020 or its tests.
- Do not change expected values merely to match the supplied implementation.
- Do not add errors, interfaces, HTTP, maps, sorting, databases, files, goroutines,
  channels, mutexes, or third-party packages.

## Documentation

- [Go tutorial: add a test](https://go.dev/doc/tutorial/add-a-test)
- [`slices.Equal`](https://pkg.go.dev/slices#Equal) — used by the supplied helper
- [`errors.Is`](https://pkg.go.dev/errors#Is)

## Commands

Run the focused suite before editing and after each meaningful change:

```sh
go test ./exercises/go/022-audit-job-import-service -v
```

Before requesting review:

```sh
gofmt -w exercises/go/022-audit-job-import-service
npm run check:go
```

## Acceptance criteria

- The learner-authored test covers a duplicate between two new jobs.
- It checks the complete summary and both important stored-state outcomes.
- The test fails against the supplied implementation for the expected reason.
- The production repair changes only the incorrect import classification.
- Focused and repository-wide checks pass after the repair.

## When you are done

Ask for a code review. No written reflection is required.
