# GO-012: Calculate a Session Duration

Target time: 20–35 minutes  
Primary focus: transfer struct modeling with less scaffolding

## Why this matters

Systems pass related data between components as coherent values. A session's identifier and
time boundaries belong together, and explicit unit names help prevent callers from mixing
minutes with seconds or milliseconds.

## Your task

Work only in `session.go`.

Define an exported struct named `Session` with these exported fields:

- `ID`: the session identifier
- `StartMinute`: when the session starts
- `EndMinute`: when the session ends

Choose each field's type from its meaning and the supplied tests.

Then implement:

```go
func DurationMinutes(session Session) int
```

Return the number of minutes from the start through the end. Assume minute values are
non-negative and the end is never before the start.

## Constraints

- Do not change or add tests.
- Do not use branches, errors, loops, slices, methods, pointers, interfaces, or helpers.
- Do not mutate the received struct.

## Documentation

- [A Tour of Go: structs](https://go.dev/tour/moretypes/2)
- [A Tour of Go: struct fields](https://go.dev/tour/moretypes/3)
- [A Tour of Go: struct literals](https://go.dev/tour/moretypes/5)

## Commands

Start here:

```sh
go test ./exercises/go/012-calculate-session-duration -v
```

Before review:

```sh
gofmt -w exercises/go/012-calculate-session-duration
npm run check:go
```

## Done when

All checks pass and you can explain how you chose each field type and why this function can
accept a struct value without a pointer.

When requesting review, report documentation, hints, previous-solution lookup, and outside
AI assistance.
