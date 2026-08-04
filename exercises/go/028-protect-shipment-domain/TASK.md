# GO-028: Protect a Shipment Domain Invariant

Target time: 30–45 minutes  
Primary focus: introduce the `domain` package as the owner of business invariants

## Goal

Implement the rule that controls whether a shipment may become dispatched. The rule lives
in `domain`, while a supplied service demonstrates how application code consumes it.

Only the responsibilities used in this exercise are present:

```text
domain/      shipment state and valid transitions
service/     supplied coordination that calls the domain
```

There is no `handler` because there is no HTTP, and no `persistence` because nothing is
stored yet.

## Mental model

```text
available workers → service.Dispatch
                            ↓
                 domain.Shipment.Dispatch
                            ↓
          reject invalid transition or return dispatched copy
```

The domain package answers, “Is this state change allowed?” The service calls that rule;
it does not reimplement it.

`Shipment.Dispatch` has a **value receiver**. The receiver is a copy, so changing
`shipment.Status` inside the method changes the value being returned, not the caller's
original `Shipment` variable.

## Contract

`Shipment.Dispatch(availableWorkers)` returns `(Shipment, error)`:

| Situation | Result |
|---|---|
| status is not `StatusReady` | unchanged shipment and `ErrShipmentNotReady` |
| ready but workers are insufficient | unchanged shipment and `ErrInsufficientWorkers` |
| ready and workers are sufficient | copied shipment with `StatusDispatched` and `nil` |

Check status before worker capacity. Therefore, a non-ready shipment with too few workers
returns `ErrShipmentNotReady`.

Exact worker capacity is sufficient. Assume shipment IDs are non-empty,
`RequiredWorkers` is positive, and `availableWorkers` is non-negative.

## Your task

Work only in `domain/shipment.go`. Replace the placeholder body of `Shipment.Dispatch`.

Preserve the shipment's ID and required-worker count on every path. Failed transitions
return the unchanged shipment. Successful transitions return the updated copy.

Do not add the rule to the service—the supplied service already delegates to the domain.

## Scope preflight

- **Retrieved:** structs, status constants, named errors, comparisons, early returns,
  methods, value copies, and cross-package calls.
- **New:** assigning a stable business invariant to a `domain` package.
- **Supplied:** types, errors, service delegation, package wiring, and all tests.
- **Test ownership:** **supplied** because the domain-to-service dependency is the new
  dimension.
- **Deferred:** persistence, interfaces, HTTP, learner-authored tests, pointer mutation,
  table-driven tests, goroutines, and channels.

Decision: **pass**. The branches and state update are familiar; package ownership is the
only raised dimension.

## Start and verification

Start with the guard for a shipment whose status is not `StatusReady`. Then add the worker
guard and the successful transition.

```sh
go test ./exercises/go/028-protect-shipment-domain/... -v
```

Before review:

```sh
gofmt -w exercises/go/028-protect-shipment-domain
npm run check:go
```

## Documentation

- [A Tour of Go: methods](https://go.dev/tour/methods/1)
- [A Tour of Go: value receivers](https://go.dev/tour/methods/4)
- [Go: organizing a module](https://go.dev/doc/modules/layout)

The task's mental model and contract are the primary guidance; the links are references.

## Completion criteria

- Invalid status takes precedence over worker capacity.
- Failed transitions return the original shipment and the correct named error.
- Exact and greater capacity dispatch successfully.
- Successful dispatch preserves ID and required workers.
- The caller's original value is unchanged.
- Domain and service tests plus repository-wide checks pass.

Ask for a review when finished and disclose any documentation or AI help used. No written
reflection is required.
