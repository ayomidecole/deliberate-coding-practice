# GO-026: Test an Order Benefits Service

Target time: 35–50 minutes  
Primary focus: design tests for interacting service rules

## Goal

Write the regression suite for a supplied order-benefits service. The implementation is
complete; your job is to decide which examples provide convincing evidence that its
contract will remain correct.

Only the currently relevant package is present:

```text
service/     supplied behavior and your tests
```

## Mental model

The rules run in sequence:

```text
order total
    ↓
loyalty discount
    ↓
final total
    ↓
free-shipping decision
```

This interaction matters: free shipping depends on the final total after any discount,
not the original total.

## Contract

`OrderBenefitsService.Calculate` returns `(OrderBenefits, error)`.

- A negative order total returns `OrderBenefits{}` and `ErrInvalidOrderTotal`.
- Zero is a valid order total.
- A non-member receives no discount.
- A loyalty member receives a 10% discount using integer cents.
- `FinalTotalCents` is the original total minus the discount.
- `FreeShipping` is true when the final total is at least `5000` cents.

## Your task

Work only in `service/order_benefits_test.go`. Write the smallest useful set of separate
test functions that proves:

- the invalid-input contract;
- an ordinary non-member order below the shipping threshold;
- the exact free-shipping boundary;
- a loyalty order whose original total qualifies but discounted total does not;
- a loyalty order whose discounted total still qualifies.

Choose the test names, concrete inputs, expected values, and assertion messages yourself.
For each case, check the error outcome and every field of the returned `OrderBenefits`.
Use `errors.Is` for `ErrInvalidOrderTotal`.

The supplied implementation must not be edited. Passing tests are necessary but not
sufficient: during review, the suite will be checked against plausible broken
implementations.

## Scope preflight

- **Demonstrated:** `testing.T`, separate Go test functions, constructors and method calls,
  multiple returns, `errors.Is`, and struct-field assertions.
- **Previously guided and being retrieved:** selecting partitions and adjacent boundary
  evidence that would catch realistic regressions.
- **New operations:** none.
- **Test ownership:** **fully learner-authored** because the Go harness and all assertion
  mechanics are established; test design is the only raised dimension.
- **Supplied:** correct service implementation, exact contract, package, and empty test
  file.
- **Deferred:** implementation changes, table-driven tests, HTTP, mocks, interfaces,
  persistence, domain packages, goroutines, and channels.

Decision: **pass**. The multi-field result deepens familiar test design without adding a
new implementation or architecture boundary.

## Start and verification

The baseline command succeeds with no tests; that is not evidence of correctness. Begin
with a negative-total test, then choose the remaining examples from the contract.

```sh
go test ./exercises/go/026-test-order-benefits-service/... -v
```

Before requesting review:

```sh
gofmt -w exercises/go/026-test-order-benefits-service
npm run check:go
```

## Documentation

- [Go tutorial: add a test](https://go.dev/doc/tutorial/add-a-test)
- [`testing` package](https://pkg.go.dev/testing)
- [`errors.Is`](https://pkg.go.dev/errors#Is)

## Completion criteria

- Every documented behavior has intentional evidence.
- Invalid input checks both the named error and zero result.
- Successful cases check `nil` errors and all result fields.
- The suite distinguishes free shipping based on final total from a calculation based on
  original total.
- Focused and repository-wide checks pass.

Ask for a code review when finished and disclose any documentation or AI help used. No
written reflection is required.
