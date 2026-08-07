# REACT-037: Retrieve Nullable Domain Decoding With Full Ownership

Status: complete

Target time: 35–50 minutes

Primary capability: independently reconstruct nullable validation, domain construction,
and one boundary test

## Goal

Build a `MaintenanceWindow` domain boundary around a required nullable field. This is the
retrieval after REACT-036's solution-level help; it adds no new runtime type.

This task has three required deliverables:

1. Implement the complete nullable-string reader.
2. Build the complete domain class from its minimal declaration.
3. Author the missing-field rejection test inside the supplied suite.

## Mental model

The same contract must agree across three layers:

```text
API expectation       approved_by: string | null
runtime decoder       string or null succeeds; everything else throws
domain guarantee      approvedBy: string | null
```

Nullable does not mean optional. An absent `approved_by` property produces `undefined`,
which belongs to the invalid branch. The decoder must preserve an explicit `null`, preserve
a string, and reject both missing and wrong-type values.

The class then performs the familiar trust-boundary sequence:

```text
unknown input → validate object → validate each wire field → readonly domain instance
```

Whole-object errors use the domain name `MaintenanceWindow`; field errors use the exact
wire keys. Downstream code should never need to reinterpret snake-case names or inspect
unvalidated input.

## Supplied boundary

`src/types/maintenance-window-api.ts` describes this wire record:

```json
{
  "window_id": "window-204",
  "title": "Database maintenance",
  "approved_by": null,
  "duration_minutes": 60
}
```

The API type, scalar readers, fixture, two valid cases, one wrong-type case, and test harness
are supplied. The nullable reader is a throwing stub, and the domain class contains only
its imports and name.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Implement string/null/invalid branches | guided retrieval | REACT-036 completed with A4 help |
| Declare a readonly scalar domain class | retrieved | REACT-035 A0 |
| Validate the object and scalar fields | retrieved | REACT-035 A0 |
| Map a nullable wire field through its reader | guided retrieval | REACT-036 |
| Keep object and field labels distinct | retrieved | REACT-035 A0 |
| Author a missing-field rejection case | familiar mechanics, increased ownership | Adjacent `toThrow` case and harness supplied |
| Decode arrays, request data, or render React | excluded | Later boundaries |

There are no unfamiliar operations. The task raises ownership and reduces scaffolding while
keeping the runtime contract unchanged.

Test ownership is **starter plus learner case**. You author one complete rejection case;
the fixture, suite, and comparison case remain supplied.

## Implementation checklist

### 1. Implement `readNullableString`

Replace its placeholder body in `src/domain/primitives.ts`:

- Return `null` only when the value is exactly `null`.
- Return the value only when its runtime type is string.
- Otherwise throw `` `${fieldName} must be a string or null` ``.
- Do not accept `undefined`, use truthiness, coerce values, or supply defaults.

### 2. Build `MaintenanceWindow`

Complete `src/domain/maintenance-window.ts`:

- Declare readonly domain properties `id: string`, `title: string`,
  `approvedBy: string | null`, and `durationMinutes: number`.
- Add a constructor accepting one `unknown` value.
- Validate the container using `"MaintenanceWindow"` as its label.
- Map `window_id` to `id` through the string reader.
- Map `title` to `title` through the string reader.
- Map `approved_by` to `approvedBy` through the nullable-string reader.
- Map `duration_minutes` to `durationMinutes` through the number reader.
- Pass the exact wire key to every field reader.

### 3. Author the missing-field test

Inside the existing `describe` block in `src/domain/maintenance-window.test.ts`, write a new
test named `"rejects a missing approval field"`.

The test should construct a `MaintenanceWindow` from an explicit object containing
`window_id`, `title`, and `duration_minutes`, but no `approved_by`. Assert that construction
throws `"approved_by must be a string or null"`.

## Independent retrieval boundary

For independent evidence, use only the current task's files, compiler/test output, and
linked official documentation. Do not open REACT-036 or use AI-generated implementation
code. If you need help, ask; the assistance level will determine the next retrieval.

## Scope

- Edit only the nullable-reader body, `MaintenanceWindow`, and the new test case.
- Do not edit the API type, scalar readers, fixture, or supplied tests.
- Do not add arrays, optional properties, defaults, methods, factories, requests, or React
  code.
- Do not use casts, non-null assertions, `any`, coercion, or unvalidated assignment.
- Disclose any documentation or help you use.

Your first three edits should be:

1. Implement the exact-null return branch.
2. Implement the runtime-string return branch.
3. Implement the invalid-value error branch.

Then build the class and test. The likely stuck point is the missing-field case: reading an
absent property yields `undefined`, so the nullable reader—not a default—must reject it.

## Start and verify

Before editing, run:

```bash
npm run typecheck
npx vitest run exercises/react/037-retrieve-nullable-domain-decoding
```

The compiler and all three supplied cases should fail because the class has no constructor
contract or behavior yet.

After completing all three deliverables, run:

```bash
npm run typecheck
npx vitest run exercises/react/037-retrieve-nullable-domain-decoding
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

There is no browser check or production build for this domain-only retrieval task.

## Documentation

- [TypeScript: union types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [TypeScript: `typeof` narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards)
- [TypeScript: classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [Vitest: `toThrow`](https://vitest.dev/api/expect.html#tothrowerror)

## Done when

- Nullable decoding independently handles string, explicit null, missing, and wrong-type
  values.
- `MaintenanceWindow` exposes all four correctly mapped readonly properties.
- The learner-authored missing-field test is present and meaningful.
- Typecheck, focused tests, and the stable suite pass.
- Only the three permitted locations are changed.
