# GO-008: Test Shipping Fee Boundaries

Target time: 25–40 minutes  
Primary focus: choose tests that prove a behavioral contract

## Scope preflight

- Guided target: write Go tests that check both values returned by a function.
- Supplied: a correct implementation and one passing starter test.
- Previously used: `testing.T`, multiple return values, `nil`, and `errors.Is`.
- New idea, explained below: choose values on both sides of a rule boundary.
- Deferred: implementation changes, table-driven tests, HTTP, mocks, and new Go syntax.

Decision: **pass**. Test responsibility is the only raised difficulty.

## Why this matters

A green test suite only proves the examples it contains. Engineers must decide whether
those examples cover the important behaviors and failure boundaries.

For a rule that changes at a boundary, test the closest value on each side. For example,
if an age rule starts at 18, testing 17 and 18 gives stronger evidence than testing 12 and
15: the first pair proves where the behavior changes.

## Contract

`ShippingFee` receives an order subtotal in cents and returns `(fee, error)`.

| Subtotal | Fee | Error |
|---|---:|---|
| Below `0` | `0` | `ErrInvalidSubtotal` |
| `0` through `4999` | `500` | `nil` |
| `5000` or more | `0` | `nil` |

The existing test covers an ordinary paid-shipping subtotal. It does not prove the invalid
case or the transition to free shipping.

## Your task

Work only in `shipping_fee_test.go`. Add the smallest useful set of tests that proves:

- a negative subtotal follows the invalid contract;
- paid and free shipping meet at the correct boundary;
- both the returned fee and error are correct in every added case.

Choose the test names, values, structure, and assertion messages yourself. Separate test
functions or a table-driven test are both acceptable; table-driven syntax is not required.

## Constraints

- Do not change `shipping_fee.go` or the starter test.
- Use `errors.Is` when checking `ErrInvalidSubtotal`.
- Use only Go's standard library.

## Documentation

- [Go tutorial: add a test](https://go.dev/doc/tutorial/add-a-test)
- [`errors.Is` reference](https://pkg.go.dev/errors#Is)

## Commands

Start here:

```sh
go test ./exercises/go/008-test-shipping-fee -v
```

Before review:

```sh
gofmt -w exercises/go/008-test-shipping-fee
npm run check:go
```

## Done when

The suite passes and you can explain why the boundary cases provide evidence that the
starter test does not.

When requesting review, report documentation, hints, previous-solution lookup, and outside
AI assistance.
