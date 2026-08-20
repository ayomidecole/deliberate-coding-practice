# GO-031: Build a Squad Readiness Model and Service

Target time: 35–50 minutes  
Primary focus: reconnect model ownership to service behavior

## Goal

Riverside Athletic needs to decide whether enough players are available to prepare a
matchday squad. Define the decision result in `models`, then implement the business rule
in `services`.

```text
constants/   supplied ready and incomplete status values
models/      shared shape of a squad-readiness result
services/    validation and readiness decision
```

There is no HTTP work in this exercise. A handler will be added only after this
model-to-service connection has been independently rebuilt.

## Mental model

```text
fixture and player counts → service applies rules → models.SquadReadiness
```

- The model defines **what data a readiness result contains**.
- The service decides **which values belong in that model**.
- The constants package supplies the allowed status vocabulary.

The model contains no calculations. The service contains no Gin or HTTP code.

## Your task

### 1. Define the model

In `models/squad_readiness.go`, define `SquadReadiness` with:

- `FixtureID string`
- `RequiredPlayers int`
- `AvailablePlayers int`
- `Status string`

### 2. Implement the service

Replace the placeholder body of `SquadReadinessService.DecideReadiness` in
`services/squad_readiness_service.go`.

| Situation | Result |
|---|---|
| `requiredPlayers <= 0` | empty result and `ErrInvalidPlayerRequirement` |
| `availablePlayers >= requiredPlayers` | complete result with `constants.StatusReady` |
| `availablePlayers < requiredPlayers` | complete result with `constants.StatusIncomplete` |

Preserve all three input values in every successful result.

### 3. Own one test

Add `TestDecideReadinessMarksSquadIncompleteWithInsufficientPlayers` to
`services/squad_readiness_service_test.go`. Use fewer available players than required and
assert the complete returned model and a nil error.

## Scope preflight

- **Demonstrated:** structs, packages, constants, service methods, errors, branches,
  full-value returns, and unit tests.
- **Guided and being retrieved:** models own shared data shapes; services own business
  decisions that produce those models.
- **New operations:** none.
- **Raised dimension:** reconstruct two connected familiar packages after a long break.
- **Test ownership:** **starter tests plus one learner-authored insufficient-player test**.
- **Deferred:** handlers, Gin, persistence, middleware, interfaces, table-driven tests,
  goroutines, and channels.

Decision: **pass**. The soccer setting changes the business problem without changing the
technical difficulty or capability target.

## Start and verification

Start with the model because the service return type depends on it. Then add the invalid
guard before deciding between the two successful statuses.

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/031-build-squad-readiness-model-service/... -v
```

Before review:

```sh
gofmt -w exercises/go/03-model-service-handler-reinforcement/031-build-squad-readiness-model-service
npm run check:go
```

## Documentation

Use now, in this order:

1. [A Tour of Go: structs](https://go.dev/tour/moretypes/2) — defining
   `SquadReadiness`.
2. [A Tour of Go: struct literals](https://go.dev/tour/moretypes/5) — constructing the
   returned result with named fields.
3. [Organizing a Go module](https://go.dev/doc/modules/layout) — folders as packages and
   importing one package from another. The names `models` and `services` are our project
   convention, not special Go keywords.
4. [A Tour of Go: methods](https://go.dev/tour/methods/1) — the service method and its
   receiver.
5. [Go: return and handle errors](https://go.dev/doc/tutorial/handle-errors) — returning
   the supplied validation error.
6. [Go `testing`](https://pkg.go.dev/testing) — reference for your insufficient-player
   test.

Gin is intentionally not used in GO-031. Its official
[routing](https://gin-gonic.com/en/docs/routing/) and
[binding](https://gin-gonic.com/en/docs/binding/bind-query-or-post/) documentation becomes
relevant when the next exercise adds the handler layer.

The contract above is the primary guidance.

## Completion criteria

- The model contains exactly the documented business fields.
- Invalid requirements return the named error and an empty model.
- Exact availability produces a ready result.
- Insufficient availability produces an incomplete result covered by your test.
- Focused and repository-wide checks pass.

Ask for a review when finished and disclose any documentation or AI help used. No written
reflection is required.
