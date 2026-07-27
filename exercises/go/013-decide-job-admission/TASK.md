# GO-013: Decide Job Admission

Target time: 25–40 minutes  
Primary focus: connect ordered control flow with learner-owned boundary tests

## Why this matters

Admission control protects a worker from accepting more jobs than it can safely process.
The policy must handle invalid inputs before making a capacity decision, and its boundary
tests must prevent accidental overloading.

## Contract

Implement:

```go
func AdmissionDecision(activeJobs, capacity int) string
```

Apply these rules in order:

1. Return `"invalid"` when `activeJobs` is negative or `capacity` is zero or negative.
2. Otherwise, return `"full"` when `activeJobs` is equal to or greater than `capacity`.
3. Otherwise, return `"accept"`.

## Your responsibility

Work in `admission.go` and `admission_test.go`.

Replace the placeholder implementation. Keep the starter test, then add separate tests
whose combined coverage includes:

- negative active jobs;
- zero capacity;
- exactly-at-capacity;
- above-capacity.

Choose the inputs, test names, and assertions yourself.

## Constraints

- Do not change the function signature or starter test.
- Return the exact strings in the contract.
- Do not use errors, structs, loops, slices, maps, methods, pointers, interfaces, helpers,
  or third-party packages.
- Use ordinary test functions rather than table-driven tests.

## Documentation

- [A Tour of Go: if statements](https://go.dev/tour/flowcontrol/5)
- [Go tutorial: add a test](https://go.dev/doc/tutorial/add-a-test)
- [`testing` package reference](https://pkg.go.dev/testing)

## Commands

Start here:

```sh
go test ./exercises/go/013-decide-job-admission -v
```

Before review:

```sh
 
npm run check:go
```

## Done when

The implementation follows the rule precedence, the learner-authored tests cover every
listed case, and all checks pass.

When requesting review, explain why invalid inputs must be checked before capacity and
report documentation, hints, previous-solution lookup, and outside AI assistance.
