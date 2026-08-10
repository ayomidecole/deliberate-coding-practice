# GO-018: Repair the Reservation API Boundary

Target time: 35–50 minutes  
Primary focus: remove duplicated business rules from an HTTP handler

## Engineering reason

Business rules copied into transport code can drift from the service that is supposed to
own them. The result is inconsistent behavior between HTTP, background jobs, command-line
tools, and future callers.

This task practices recognizing misplaced responsibility, restoring one source of truth,
and preserving an external API contract while changing the internal design.

## Scenario

`POST /api/inventory-reservations` accepts:

```json
{"availableStock": 8, "requestedQuantity": 3}
```

The production code is separated by responsibility:

- `reservation_service.go` is the supplied **service**. It owns the reservation rules and
  exposes `ReserveStock`.
- `reservation_handler.go` is the **HTTP handler**. It binds requests and writes responses.

The handler currently makes the reservation decision itself even though those rules
already exist in the service. The two implementations have drifted.

Refactor the handler so the service owns the reservation decision and the handler only
translates between HTTP and the service contract.

## Public HTTP contract

| Outcome | HTTP response |
|---|---|
| malformed JSON | `400 Bad Request` and `{"error":"invalid request"}` |
| `ErrInvalidQuantity` | `400 Bad Request` and `{"error":"invalid quantity"}` |
| `ErrInsufficientStock` | `409 Conflict` and `{"error":"insufficient stock"}` |
| successful reservation | `201 Created` and `{"remainingStock":<value>}` |

Requesting exactly all available stock is successful and returns zero remaining stock.

## Your responsibility

Read both production files, then work only in `reserveInventory` in
`reservation_handler.go`. Do not change `reservation_service.go`.

- Remove the duplicated reservation rules from the handler.
- Delegate the decision to `ReserveStock`.
- Translate its domain errors with `errors.Is`.
- Preserve the route, request type, response types, and public HTTP contract.

The Gin router, JSON binding, DTOs, and complete HTTP test harness are supplied. Tests are
not part of your responsibility in this exercise because the difficulty increase is
reduced implementation scaffolding at the handler/service boundary.

## Constraints

- Do not modify `reservation_service.go`.
- Do not modify or add tests.
- Do not reproduce quantity or stock-comparison rules in the handler.
- Do not change the route or supplied JSON shapes.
- Do not call `c.JSON` more than once on any request path.
- Do not add middleware, persistence, interfaces, or third-party packages.

## Documentation

- [Gin quickstart](https://gin-gonic.com/en/docs/quickstart/) — routing and JSON responses
- [`errors.Is`](https://pkg.go.dev/errors#Is) — matching service errors
- [`Context.JSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.JSON) — response reference

## Commands

Run the focused tests before editing and while working:

```sh
go test ./exercises/go/02-service-handler-boundaries/018-repair-reservation-api-boundary -v
```

Before requesting review:

```sh
gofmt -w exercises/go/02-service-handler-boundaries/018-repair-reservation-api-boundary
npm run check:go
```

## Acceptance criteria

- The handler delegates every reservation decision to `inventory.ReserveStock`.
- Every service outcome maps to the specified HTTP contract.
- No reservation business rule remains duplicated in the handler.
- Focused and repository-wide checks pass.

## When you are done

Ask for a code review. No written reflection is required.
