# GO-029: Apply an Invoice Payment in a Service

Target time: 30–45 minutes  
Primary focus: service-owned business logic and ordered state transitions

## Goal

Implement the invoice-payment use case in `services/payment_service.go`.

```text
constants/   shared invoice status values
models/      the shared Invoice struct
services/    payment errors and payment rules
```

`handlers/` will return when an exercise exposes this service through Gin. `persistence/`
and `middleware/` will appear only when those responsibilities are introduced.

## Mental model

```text
invoice + payment
       ↓
PaymentService.ApplyPayment
       ↓
reject invalid attempt OR return an updated invoice value
```

`invoice` is passed by value. Changing that local value does not change the caller's
original variable. On failure, return the original invoice unchanged.

## Contract

`PaymentService.ApplyPayment(invoice, paymentCents)` returns `(models.Invoice, error)`.

Check conditions in this order:

| Situation | Result |
|---|---|
| invoice is already `constants.StatusPaid` | unchanged invoice and `ErrInvoiceAlreadyPaid` |
| payment is zero or negative | unchanged invoice and `ErrInvalidPayment` |
| payment exceeds the balance | unchanged invoice and `ErrPaymentExceedsBalance` |
| valid partial payment | reduced balance, `constants.StatusOpen`, and `nil` |
| payment exactly equals balance | zero balance, `constants.StatusPaid`, and `nil` |

Assume an open invoice begins with a positive balance. Preserve the invoice ID on every
path.

## Your task

Implement the service in `services/payment_service.go`, then add the required case in
`services/payment_service_test.go`.

1. Add the three failure guards in the contract's order.
2. Reduce the local invoice balance for a valid payment.
3. If the new balance is zero, change the local status to `constants.StatusPaid`.
4. Return the updated invoice and `nil`.
5. Add one test proving that a negative payment returns `ErrInvalidPayment` and leaves the
   invoice unchanged. The supplied test covers zero; your case completes the contract.

Use the supplied `models.Invoice`, shared status constants, and named service errors.

## Scope preflight

- **Demonstrated:** structs, exported package imports, constructors, service methods,
  named errors, early returns, arithmetic, and status comparisons.
- **Guided and being retrieved:** ordered state transitions and unchanged failure results.
- **Layer boundary:** models hold shared data, constants hold shared status values, and
  services own use cases; handlers are deferred until HTTP returns.
- **New operations:** none.
- **Raised dimension:** interaction among state, payment amount, balance, and validation
  precedence.
- **Test ownership:** **starter plus one learner-authored case**. The harness and five
  examples are supplied; the learner owns the uncovered negative-payment behavior.
- **Deferred:** handlers, additional architecture layers, table-driven tests, pointer
  mutation, goroutines, and channels.

Decision: **pass**. This increases rule interaction without adding a new boundary or test
responsibility.

## Start and verification

Begin with the already-paid guard. Then handle invalid amounts and overpayment before
changing the local invoice value.

```sh
go test ./exercises/go/02-service-handler-boundaries/029-apply-invoice-payment-service/... -v
```

Before review:

```sh
gofmt -w exercises/go/02-service-handler-boundaries/029-apply-invoice-payment-service
npm run check:go
```

## Documentation

- [A Tour of Go: methods](https://go.dev/tour/methods/1)
- [Go tutorial: return and handle errors](https://go.dev/doc/tutorial/handle-errors)

The contract above is the primary guidance; these links are references.

## Completion criteria

- Validation follows the documented precedence.
- Every failed payment returns the unchanged invoice and correct named error.
- A learner-authored test covers a negative payment amount.
- Partial payment preserves `StatusOpen` and reduces the balance.
- Exact payment sets a zero balance and `StatusPaid`.
- The caller's original invoice remains unchanged.
- Focused and repository-wide checks pass.

Ask for a review when finished and disclose any documentation or AI help used. No written
reflection is required.
