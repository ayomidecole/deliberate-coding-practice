# GO-007: Reserve Stock

Target time: 25–40 minutes  
Primary focus: implement a clear domain contract with values and errors

## Scope preflight

- Guided target: return the correct `(int, error)` pair from each control-flow path.
- Supplied: named error values, function signature, business contract, and all tests.
- Previously exposed: integer comparisons, `if`, early `return`, `nil`, and multiple returns.
- New operations: none.
- Deferred: loops, structs, interfaces, mutation, tests, HTTP, and persistence.

Decision: **pass**. This isolates function contracts and terminal control flow.

## Why this matters

Business rules should be understandable without HTTP or database code. A small domain
function gives callers an explicit success or failure contract and can later be reused by a
service, handler, command, or job.

## Mental model

The function signature is:

```go
func ReserveStock(available, requested int) (int, error)
```

Every path returns two values:

```text
success → updated stock, nil
failure → original stock, a non-nil error value
```

`ErrInvalidQuantity` and `ErrInsufficientStock` are supplied values. Return them; do not
create replacement errors. A `return` ends the function, so later calculations do not run
after a failure.

## Contract

| Condition | Remaining stock | Error |
|---|---:|---|
| `requested <= 0` | unchanged | `ErrInvalidQuantity` |
| `requested > available` | unchanged | `ErrInsufficientStock` |
| otherwise | `available - requested` | `nil` |

Assume `available` is never negative.

## Your task

Work only in `reserve_stock.go`.

Implement `ReserveStock` from scratch using the supplied signature and error values. Read
the tests first and make each return path match the contract.

## Constraints

- Do not change or add tests.
- Do not change the signature or error variables.
- Do not use loops, structs, mutation, helpers, or frameworks.
- Do not panic or create new error messages.
- Resolve the TODO before review.

## Documentation

- [Go tutorial: return and handle an error](https://go.dev/doc/tutorial/handle-errors)
- [A Tour of Go: multiple results](https://go.dev/tour/basics/6)
- [`errors` package](https://pkg.go.dev/errors) — reference for the supplied error values

## Commands

Start here:

```sh
go test ./exercises/go/007-reserve-stock -v
```

Before review:

```sh
gofmt -w exercises/go/007-reserve-stock
npm run check
```

## Done when

All success and failure contracts pass, formatting and repository checks pass, and you can
explain why failures return unchanged stock and why success returns `nil`.

When requesting review, report documentation, hints, previous-solution lookup, and outside
AI assistance.
