# GO-010: Audit Handling Fee Tests

Target time: 30–45 minutes  
Primary focus: design a test suite that would catch realistic regressions

## Scope preflight

- Guided retrieval: ordinary Go test functions, assertions, and multiple return values.
- Guided retrieval: partitions, adjacent boundaries, and named-error checks.
- Supplied: correct implementation, exact contract, and one starter test.
- New operations: none.
- Deferred: implementation changes, table-driven tests, structs, loops, HTTP, and mocks.

Decision: **pass**. Reduced test guidance is the only raised difficulty.

## Why this matters

A passing suite is only useful when it would fail after an important regression. Test
design means choosing evidence for the whole contract, not merely producing more green
tests.

A **partition** is a group of inputs governed by the same rule. A **boundary** is where the
rule changes. Strong tests cover each rule and place values close enough to a boundary to
detect an off-by-one mistake.

## Contract

`CalculateHandlingFee` receives an item count and returns `(feeCents, error)`.

| Item count | Fee | Error |
|---|---:|---|
| `0` or below | `0` | `ErrInvalidItemCount` |
| `1` through `2` | `0` | `nil` |
| `3` or more | `itemCount * 200` | `nil` |

The starter test proves one ordinary free-handling example. It does not prove the complete
contract.

## Your task

Work only in `handling_fee_test.go`. Add the smallest useful set of separate test functions
that gives convincing evidence for the entire contract.

Choose the test names, inputs, and assertions. Your combined suite should be capable of
catching these plausible regressions:

- non-positive counts are accepted or return the wrong named error;
- either behavior boundary is off by one;
- the paid fee is hard-coded for one example instead of calculated from the input.

For a named error, `errors.Is(actual, target)` returns a boolean. The test must report a
failure when that boolean is false.

## Constraints

- Do not change `handling_fee.go` or the starter test.
- Check both returned values in every added test.
- Use separate test functions; table-driven syntax is deferred.
- Use only Go's standard library.

## Documentation

- [Go tutorial: add a test](https://go.dev/doc/tutorial/add-a-test)
- [`errors.Is` reference](https://pkg.go.dev/errors#Is)

## Commands

Start here:

```sh
go test ./exercises/go/01-foundations-testing/010-audit-handling-fee-tests -v
```

Before review:

```sh
gofmt -w exercises/go/01-foundations-testing/010-audit-handling-fee-tests
npm run check:go
```

## Done when

The suite passes and you can explain what regression each learner-authored test would catch.

When requesting review, report documentation, hints, previous-solution lookup, and outside
AI assistance.
