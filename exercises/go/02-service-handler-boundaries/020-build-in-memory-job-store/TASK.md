# GO-020: Build an In-Memory Job Store

Target time: 35–50 minutes  
Primary focus: methods, pointer receivers, and state ownership

## Scope preflight

- **Known:** structs, slices, `range`, `append`, `len`, branches, multiple returns, and
  sentinel errors.
- **Demonstrated:** calculating over slice state and preserving documented failure
  contracts.
- **New but guided:** defining behavior on a type with methods and using a pointer receiver
  for a component whose state must change.
- **Supplied:** models, private storage, constructor, sentinel errors, method signatures,
  and all tests.
- **Deferred:** HTTP, interfaces, databases, files, maps, test authorship, goroutines,
  channels, and locking.

Decision: **pass**. Methods and pointer-receiver state are the only new operation.

## Concept

A method is a function attached to a type. Its receiver is the value the method operates
on:

```go
type Counter struct {
	total int
}

func (counter *Counter) Increment() {
	counter.total++
}
```

Callers use `counter.Increment()`. The `*Counter` receiver means the method operates on the
caller's shared counter rather than a separate copy.

`JobStore` is a stateful component, not just a data record. `Add` must update the store
that later calls to `Count` and `FindByID` observe. All three supplied method signatures
therefore use `*JobStore`.

## Why it matters

An HTTP handler should not own stored application state. A separate store gives persistence
operations one owner and gives a future service or handler a clear dependency. This
exercise uses memory rather than a database so the component boundary is visible without
adding database APIs.

## Required behavior

Implement the three supplied methods in `job_store.go`.

### `Add`

- Add a job when its ID is not already stored.
- Return `nil` after adding it.
- If the ID already exists, return `ErrDuplicateJob`.
- A rejected duplicate must not replace the original job or change the count.

### `FindByID`

- Return the complete stored job and `nil` when the ID exists.
- Return `Job{}` and `ErrJobNotFound` when it does not exist.

### `Count`

- Return the current number of stored jobs.

Jobs must remain in insertion order inside the store. Assume IDs are non-empty and
`RequiredWorkers` is positive.

## Your responsibility

Work only in `job_store.go`. Replace the placeholder method bodies without changing the
supplied types, constructor, errors, or method signatures.

Read the tests before implementing. Decide how each method should scan, update, or read the
private `jobs` slice.

## Constraints

- Do not modify or add tests.
- Do not export the `jobs` field.
- Do not create replacement errors inside the methods.
- Do not use maps, interfaces, HTTP, a database, files, global mutable state, goroutines,
  channels, mutexes, or third-party packages.
- Do not add getters or helpers unless the required methods genuinely need them.

## Documentation

- [A Tour of Go: methods](https://go.dev/tour/methods/1)
- [A Tour of Go: pointer receivers](https://go.dev/tour/methods/4)
- [Effective Go: pointers versus values](https://go.dev/doc/effective_go#pointers_vs_values)
- [`errors.Is`](https://pkg.go.dev/errors#Is) — used by the supplied tests

## Commands

Run the focused suite before editing and while working:

```sh
go test ./exercises/go/02-service-handler-boundaries/020-build-in-memory-job-store -v
```

Before requesting review:

```sh
gofmt -w exercises/go/02-service-handler-boundaries/020-build-in-memory-job-store
npm run check:go
```

## Acceptance criteria

- New jobs can be added, counted, and found.
- Duplicate IDs return `ErrDuplicateJob` without changing stored state.
- Missing IDs return `Job{}` and `ErrJobNotFound`.
- The private slice remains the single owner of stored jobs.
- Focused and repository-wide checks pass.

## When you are done

Ask for a code review. No written reflection is required.
