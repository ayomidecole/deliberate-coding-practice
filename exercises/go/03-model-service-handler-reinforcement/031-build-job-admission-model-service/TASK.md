# GO-031: Rebuild a Job Admission Model and Service

Target time: 35–50 minutes  
Primary focus: reconnect model ownership to service behavior

## Goal

Define the result of a job-admission decision in `models`, then implement the business
decision in `services`.

```text
constants/   supplied admitted and queued status values
models/      shared shape of an admission decision
services/    validation and admission decision
```

There is no HTTP work in this exercise. A handler will be added only after this connection
is independently rebuilt.

## Mental model

```text
job inputs → service applies rules → models.AdmissionDecision
```

- The model says **what data an admission decision contains**.
- The service decides **which values belong in that model**.

The model contains no calculations. The service contains no Gin or HTTP code.

## Your task

### 1. Define the model

In `models/admission_decision.go`, define `AdmissionDecision` with:

- `JobID string`
- `RequiredWorkers int`
- `AvailableWorkers int`
- `Status string`

### 2. Implement the service

Replace the placeholder body of `AdmissionService.DecideAdmission` in
`services/admission_service.go`.

| Situation | Result |
|---|---|
| `requiredWorkers <= 0` | empty decision and `ErrInvalidWorkerRequirement` |
| `availableWorkers >= requiredWorkers` | complete decision with `constants.StatusAdmitted` |
| `availableWorkers < requiredWorkers` | complete decision with `constants.StatusQueued` |

Preserve all three input values in every successful decision.

### 3. Own one test

Add `TestDecideAdmissionQueuesJobWithInsufficientWorkers` to
`services/admission_service_test.go`. Use fewer available workers than required and assert
the complete returned model and a nil error.

## Scope preflight

- **Demonstrated:** structs, packages, constants, service methods, errors, branches,
  full-value returns, and unit tests.
- **Guided and being retrieved:** models own shared data shapes; services own business
  decisions that produce those models.
- **New operations:** none.
- **Raised dimension:** reconstruct two connected familiar packages after a long break.
- **Test ownership:** **starter plus one learner-authored queued-decision test**.
- **Deferred:** handlers, Gin, persistence, middleware, interfaces, table-driven tests,
  goroutines, and channels.

Decision: **pass**. This rebuilds layer ownership without restarting basic Go or adding a
new boundary.

## Start and verification

Start with the model because the service return type depends on it. Then add the invalid
guard before deciding between the two successful statuses.

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/031-build-job-admission-model-service/... -v
```

Before review:

```sh
gofmt -w exercises/go/03-model-service-handler-reinforcement/031-build-job-admission-model-service
npm run check:go
```

## Documentation

- [A Tour of Go: structs](https://go.dev/tour/moretypes/2)
- [A Tour of Go: methods](https://go.dev/tour/methods/1)
- [Go: return and handle errors](https://go.dev/doc/tutorial/handle-errors)
- [Go `testing`](https://pkg.go.dev/testing)

The contract above is the primary guidance.

## Completion criteria

- The model contains exactly the documented business fields.
- Invalid requirements return the named error and an empty model.
- Exact capacity is admitted.
- Insufficient capacity is queued by your test.
- Focused and repository-wide checks pass.

Ask for a review when finished and disclose any documentation or AI help used. No written
reflection is required.
