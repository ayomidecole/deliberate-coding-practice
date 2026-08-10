# GO-030: Expose an Invoice Payment Preview API

Target time: 35–50 minutes  
Primary focus: transfer a familiar service use case through a Gin handler

## Goal

Implement the HTTP handler for a supplied invoice-payment service, then add one handler
test of your own.

```text
constants/   shared invoice statuses
models/      shared Invoice data
services/    supplied payment rules
handlers/    HTTP DTOs, translation, and routing
```

This endpoint previews the resulting invoice; it does not persist a payment. The request
therefore includes the current invoice snapshot. When persistence is introduced later, the
real payment endpoint can accept an invoice ID and let the service load trusted state.

## Mental model

```text
POST JSON → handler DTO → models.Invoice → PaymentService
                 ↑                              ↓
           HTTP response ← projected invoice or service error
```

The handler owns HTTP translation. It must not duplicate payment calculations or change
invoice state itself.

## Your task

Implement `previewPayment` in `handlers/payment_handler.go`.

Request body:

```json
{
  "invoiceId": "invoice-301",
  "invoiceStatus": "open",
  "balanceCents": 5000,
  "paymentCents": 2000
}
```

Apply this contract:

| Outcome | Response |
|---|---|
| malformed JSON | `400 Bad Request`, `{"error":"invalid request"}` |
| `services.ErrInvoiceAlreadyPaid` | `409 Conflict`, `{"error":"invoice already paid"}` |
| `services.ErrInvalidPayment` | `422 Unprocessable Entity`, `{"error":"invalid payment"}` |
| `services.ErrPaymentExceedsBalance` | `422 Unprocessable Entity`, `{"error":"invalid payment"}` |
| success | `200 OK` with the resulting invoice ID, status, and balance |

Use `errors.Is` for service errors and return immediately after every error response.

Then add one test in `handlers/payment_handler_test.go` proving that a payment above the
invoice balance returns the documented `422` response. Use the supplied request helper and
error-response assertion.

## Scope preflight

- **Retrieved:** Gin binding and JSON responses, DTOs, early returns, `errors.Is`, service
  delegation, model construction, and cross-package imports.
- **Retrieved test skill:** adding one case to supplied handler-test infrastructure.
- **New operations:** none.
- **Raised dimension:** transfer the familiar payment use case across an HTTP boundary.
- **Test ownership:** **starter plus one learner-authored case** for overpayment.
- **Deferred:** persistence, middleware, interfaces, configuration, background work,
  goroutines, and channels.

Decision: **pass**. Both responsibilities have prior evidence, and no new layer or test
harness is introduced.

## Start and verification

Your first three edits are identifiable:

1. Bind `paymentRequestJSON` with `ShouldBindJSON`.
2. Construct `models.Invoice` from the request fields.
3. Call `handler.service.ApplyPayment` with that invoice and `PaymentCents`.

Run:

```sh
go test ./exercises/go/02-service-handler-boundaries/030-expose-invoice-payment-api/... -v
```

Before review:

```sh
gofmt -w exercises/go/02-service-handler-boundaries/030-expose-invoice-payment-api
npm run check:go
```

## Documentation

- [Gin: model binding](https://gin-gonic.com/en/docs/binding/)
- [Gin `Context.JSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.JSON)
- [Go `errors.Is`](https://pkg.go.dev/errors#Is)
- [Go `httptest`](https://pkg.go.dev/net/http/httptest)

The contract above is the primary guidance.

## Completion criteria

- Every request path writes exactly one response.
- HTTP concerns remain in `handlers`; payment rules remain in `services`.
- The success response is built from the service result, not request assumptions.
- Your overpayment test verifies both status and error body.
- Focused and repository-wide checks pass.

Ask for a review when finished and disclose any documentation or AI help used. No written
reflection is required.
