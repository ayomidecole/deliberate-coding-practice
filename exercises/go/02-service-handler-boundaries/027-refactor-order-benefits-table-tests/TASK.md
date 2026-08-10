# GO-027: Refactor Tests into a Table

Target time: 30–45 minutes  
Primary focus: first guided use of table-driven tests

## Goal

Represent several successful order-benefit examples as test data, then run the same test
procedure for every example.

This is a refactoring exercise: the behavior is intentionally carried over from GO-026 so
the table-driven harness is the only new concept.

## Mental model

A table-driven test separates two things:

```text
table rows             shared test procedure
inputs + expected data → call → check error → check result
```

- `calculateSuccessCase` describes one row.
- `cases` is a slice containing the rows.
- `for _, tc := range cases` gives the loop one row at a time as `tc`.
- `t.Run(tc.name, ...)` runs that row as a named subtest.
- Code inside `t.Run` reads the current row through `tc`.

The negative-input test remains separate because its error assertions follow a different
path. Tables are useful when cases share a procedure; they are not a requirement for every
test.

## Your task

Work only in `service/order_benefits_test.go`.

Keep the supplied invalid-input test. Complete `TestCalculateSuccessCases` by adding rows
for these five successful scenarios:

1. zero is valid;
2. a non-member is below the free-shipping threshold;
3. a non-member is exactly at the threshold;
4. a loyalty member qualifies before the discount but not afterward;
5. a loyalty member still qualifies after the discount.

For every row, provide a useful subtest name, both inputs, and the complete expected
`OrderBenefits` value.

Replace the placeholder inside `t.Run` with one shared procedure that:

1. constructs the service and calls `Calculate` using the current `tc` inputs;
2. stops that subtest if the returned error is not `nil`;
3. compares the returned value with `tc.want`.

The verbose test output should show all five subtest names.

## Scope preflight

- **Retrieved:** structs, slices, `for range`, service calls, multiple returns, error
  checks, and whole-struct comparisons.
- **Demonstrated:** the required behaviors and expected calculations in GO-026.
- **New:** organizing cases as data and executing named subtests with `t.Run`.
- **Supplied:** implementation, case schema, loop, `t.Run` wrapper, and invalid-input test.
- **Test ownership:** **starter plus learner cases** because the first unfamiliar harness
  is scaffolded while you own every row and the shared success assertions.
- **Deferred:** new behavior design, implementation edits, HTTP, mocks, parallel tests,
  and writing the table harness from scratch.

Decision: **pass**. Only harness organization is raised, and the target still requires
translating five separate examples into data plus one reusable test procedure.

## Start and verification

First add only the zero-total row. Run the suite and confirm its named subtest reaches the
placeholder. Then replace the placeholder with the shared call and assertions before
adding the other four rows.

```sh
go test ./exercises/go/02-service-handler-boundaries/027-refactor-order-benefits-table-tests/... -v
```

Before review:

```sh
gofmt -w exercises/go/02-service-handler-boundaries/027-refactor-order-benefits-table-tests
npm run check:go
```

## Documentation

- [Go Wiki: table-driven tests](https://go.dev/wiki/TableDrivenTests)
- [Go blog: subtests and `t.Run`](https://go.dev/blog/subtests)
- [`testing.T.Run`](https://pkg.go.dev/testing#T.Run)

## Completion criteria

- The supplied invalid-input test remains meaningful.
- One table contains all five successful cases.
- Every row runs as a named subtest.
- The call and success assertions exist only once inside the loop.
- No production implementation is changed.
- Focused and repository-wide checks pass.

Ask for a review when finished and disclose any documentation or AI help used. No written
reflection is required.
