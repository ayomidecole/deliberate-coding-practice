# GO-004: Write One HTTP Response

Target time: 10–20 minutes  
Primary focus: constructing a response with `http.ResponseWriter`

## Scope preflight

- New operation: write an HTTP header, status, and body through `ResponseWriter`.
- Worked example: the first handler in `status_handler.go` implements those operations.
- Supplied verification: both tests are complete; you do not author HTTP tests yet.
- Familiar work: read analogous Go code, substitute contract values, and run tests.
- Deferred: method branching, errors, routing, JSON, Gin, test authorship, and layers.

Decision: **pass**. There is one guided new operation and an identifiable first edit.

## Mental model

The request describes what came in. `ResponseWriter` is how a handler constructs what goes
back:

1. headers describe the response;
2. the status communicates the outcome;
3. the body carries the response data.

## Start here

Read these files in order:

1. `status_handler.go` from top to bottom
2. `status_handler_test.go` from top to bottom

Run the focused test. The worked example should pass and `StatusHandler` should fail.

## Your task

Implement only `StatusHandler` in `status_handler.go`.

It must:

- set `Content-Type` to `text/plain; charset=utf-8`;
- write status `200 OK`;
- write the exact body `inventory service is ready\n`.

Use the first handler in the same file as a pattern. The request is deliberately unused
in this step.

## Constraints

- Do not change or add tests.
- Use only the standard library and keep the handler direct.
- Do not add method checks, error responses, routing, JSON, servers, models, persistence,
  interfaces, goroutines, or channels.

## Documentation

- [`http.ResponseWriter`](https://pkg.go.dev/net/http#ResponseWriter)

The example code is the primary teaching material; the documentation is reference.

## Commands

```sh
go test ./exercises/go/004-handle-service-status -v
```

Before review:

```sh
gofmt -w exercises/go/004-handle-service-status
npm run check
```

## Done when

The worked-example and target tests pass, formatting/vetting pass, and the repository
checks pass.

When requesting review, briefly explain what the header, status, and body each communicate,
and report any hints or outside AI assistance.
