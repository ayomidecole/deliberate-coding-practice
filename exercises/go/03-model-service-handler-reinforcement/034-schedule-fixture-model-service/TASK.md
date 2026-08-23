# GO-034: Schedule a Fixture

Target time: 40–55 minutes  
Primary focus: independently reconstruct model and service ownership

## API context

This is the model and service behind a future API operation:

```text
POST /competitions/:competitionID/fixtures

future handler → FixtureService.ScheduleFixture → models.Fixture
```

There is no Gin work in this exercise. The future handler will translate an HTTP request;
the service decides whether a fixture is valid and produces the shared model.

## Your task

### 1. Define the model

In `models/fixture.go`, define `Fixture` with these fields:

```go
ID            string
CompetitionID string
HomeTeamID    string
AwayTeamID    string
Venue         string
Status        string
```

The model owns the shared fixture shape. It contains no validation or HTTP code.

### 2. Implement the service

Replace the placeholder body of `FixtureService.ScheduleFixture` in
`services/fixture_service.go`.

Apply these rules in order:

| Situation | Result |
|---|---|
| `homeTeamID` and `awayTeamID` are equal | empty fixture and `ErrSameTeam` |
| `venue` is empty | empty fixture and `ErrVenueRequired` |
| inputs are valid | complete fixture and `nil` |

For a valid fixture:

- preserve all five input values in the matching model fields;
- set `Status` to `constants.FixtureStatusScheduled`.

### 3. Own two tests

The same-team test is supplied. Add these tests to `services/fixture_service_test.go`:

1. `TestScheduleFixtureRejectsMissingVenue`
   - use two different teams and an empty venue;
   - assert `ErrVenueRequired` with `errors.Is`;
   - assert that the returned fixture is empty.
2. `TestScheduleFixtureReturnsScheduledFixture`
   - use valid inputs;
   - assert a nil error;
   - compare the returned fixture with the complete expected `models.Fixture`, including
     `constants.FixtureStatusScheduled`.

## Scope preflight

- **Demonstrated:** structs, constants, constructors, sentinel errors, validation branches,
  complete model returns, and ordinary unit tests.
- **Retrieved capability:** models own shared data shapes; services own business rules and
  return models.
- **New operations:** none.
- **Raised dimension:** changed-context construction with increased ownership of familiar
  tests.
- **Deferred:** Gin, handlers, request/response DTOs, persistence, interfaces, middleware,
  table-driven tests, goroutines, and channels.

Decision: **pass**. This increases independence without adding a new architectural boundary.

## Start and verification

Your first three edits are:

1. Define `models.Fixture`.
2. Add the same-team guard.
3. Add the missing-venue guard before constructing the success value.

The likely decision point is the success path: import the supplied constants package and
construct one complete fixture rather than hard-coding the status string.

Run:

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/034-schedule-fixture-model-service/... -v
```

Before review:

```sh
gofmt -w exercises/go/03-model-service-handler-reinforcement/034-schedule-fixture-model-service/{constants,models,services}/*.go
npm run check:go
```

## Documentation

1. [A Tour of Go: structs](https://go.dev/tour/moretypes/2)
2. [A Tour of Go: struct literals](https://go.dev/tour/moretypes/5)
3. [A Tour of Go: if and else](https://go.dev/tour/flowcontrol/7)
4. [A Tour of Go: methods](https://go.dev/tour/methods/1)
5. [Go: return and handle errors](https://go.dev/doc/tutorial/handle-errors)
6. [Go `testing`](https://pkg.go.dev/testing)

## Completion criteria

- `Fixture` contains exactly the documented fields.
- Both invalid states return the correct named error and an empty fixture.
- Valid input returns a complete scheduled fixture.
- You authored both requested tests.
- Focused and workspace-wide Go checks pass.

Ask for review when finished and disclose any documentation or AI help used. No written
reflection is required.
