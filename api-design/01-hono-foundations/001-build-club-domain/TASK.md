# API-001: Build a club model and domain value

Target time: 20–30 minutes  
Focus: writing the two TypeScript pieces that a later API service can use

## Goal

A club record has an ID, a name, and a city. The name entered into the record may have
surrounding spaces; the application should work with a trimmed, nonblank name. Write the
record type and the domain class that enforces that rule. The domain class will be reused
when we introduce a service.

```text
ClubRecord (data shape) → new Club(record) → valid club value or error
```

The type describes what fields TypeScript expects. It does not change a value at runtime.
The class constructor runs when called, so it can trim and reject a bad name. This is the
same separation you practiced in the Go model/domain work, expressed in TypeScript.

## Your task

### `src/models/club.ts`

Define the exported `ClubRecord` object type. Its required fields are `id`, `name`, and
`city`; each is a readonly string.

### `src/domain/club.ts`

Define the exported `Club` class with public readonly `id`, `name`, and `city` string
properties. Its constructor accepts a `ClubRecord`.

Trim the record's name. If the result is empty, throw an `Error` with the message
`club name is required`. Otherwise, assign the original ID and city and the trimmed name
to the class. Do not modify the input record.

Assume ID and city are already present and valid. This task has one business rule: a club
must have a nonblank name. Leave HTTP, Hono, services, persistence, and server startup for
later exercises.

## Scope preflight

| Required operation | Evidence and classification |
|---|---|
| Define an object type with readonly fields | Demonstrated in React API contract exercises. |
| Define a class, constructor, and readonly properties | Previously practiced in React; syntax is guided here because the learner requested a refresher. |
| Trim a string, branch, throw, and assign fields | Familiar TypeScript and Go operations; applying them to this domain rule is the exercise. |
| Use type and runtime checks | Supplied; you do not write or set up the test harness in this task. |
| Hono APIs, service calls, test infrastructure | Deferred. |

This combines a known data-shape operation with guided domain construction. The choice
left to you is how to maintain the name invariant.

Once `ClubRecord` is defined, your first domain edits are to declare the class properties,
compute the trimmed name in the supplied constructor, and check it.

## Check your work

From `api-design/`:

```sh
npm run typecheck
npm test -- 01-hono-foundations/001-build-club-domain
```

The checks are expected to fail until you implement the two files. The type check covers
the record shape and readonly fields. The runtime tests cover a normal name, trimming,
an all-space name, and preserving the input record. Tests live beside the source they test.

Documentation for these two parts:

- [TypeScript object types and readonly fields](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript class fields and constructors](https://www.typescriptlang.org/docs/handbook/2/classes.html)

Done when both commands pass and your domain class contains the name rule. Ask me to
review the code when you finish; no written explanation is required.
