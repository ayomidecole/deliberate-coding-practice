# GO-002: Validate a Job Run Summary

Target time: 30–45 minutes  
Primary focus: changing an existing contract, Go errors, and regression tests

## Concept

Extend working code so callers receive an explicit error for invalid input without breaking valid behavior.

## Why it matters

Production code changes over time. Engineers must preserve existing behavior, define predictable failure results, and use tests to prevent partial or misleading output.

## Scenario

The job-run summarizer now receives data from an external source. Its current implementation still summarizes invalid records instead of reporting a failure.

Work in the provided implementation and test files. Run the focused test command before editing to observe the failing contract.

## Required behavior

- Preserve GO-001's summary behavior for valid job runs.
- Return `RunSummary{}` and a non-`nil` error when any duration is negative.
- Return `RunSummary{}` and a non-`nil` error when any status is not one of the four provided constants.
- Return no partial summary, even when invalid input appears after valid input.
- An empty or `nil` slice returns `RunSummary{}` and a `nil` error.
- A zero duration is valid.
- Error messages must be non-empty; their exact wording is not part of the contract.

## Your implementation responsibility

- Read the existing implementation and tests before editing.
- Keep the provided types, constants, and function signature.
- Add validation while preserving the valid summary calculation.
- Return errors as values; do not panic.

## Your testing responsibility

Keep the starter tests and add at least three meaningful behavioral tests. Your additions must collectively cover:

- an unknown status;
- invalid input after at least one valid run, returning no partial summary;
- empty input returning no error;
- a zero duration remaining valid.

Tests must check both returned values when the error contract matters. Table-driven tests are optional.

## Constraints

- Do not change exported types, constants, fields, or function parameters.
- Do not change tests merely to preserve incorrect behavior.
- Do not use `panic` or third-party packages.
- Do not add HTTP, persistence, interfaces, goroutines, or channels.
- Use the provided documentation and tutor hints; do not use outside AI-generated solution code.
- Prefer clear branches over compressed logic.

## Required reading

- [Go: Return and handle an error](https://go.dev/doc/tutorial/handle-errors)
- [Go: Add a test](https://go.dev/doc/tutorial/add-a-test)

## Reference material

- [Standard library `errors` package](https://pkg.go.dev/errors)
- [Go table-driven tests](https://go.dev/wiki/TableDrivenTests)

## Commands

Run only this task while working:

```sh
go test ./exercises/go/002-validate-job-run-summary -v
```

Before requesting review:

```sh
gofmt -w exercises/go/002-validate-job-run-summary
npm run check
```

## Acceptance criteria

- All valid and invalid behavior is implemented.
- Starter tests remain present.
- At least three meaningful tests are added and cover all listed cases.
- Formatting, vetting, and all repository tests pass.

## When you are done

Ask for review and include short answers:

1. Why does invalid input return a zero summary instead of partial results?
2. Which test proves the original valid behavior still works?
3. Which documentation or hints did you use, including any outside AI assistance?
4. Which test gave you the most confidence, and why?
