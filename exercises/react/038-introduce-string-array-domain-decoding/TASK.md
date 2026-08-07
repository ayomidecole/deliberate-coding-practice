# REACT-038: Introduce Readonly String-Array Domain Decoding

Status: complete

Target time: 40–55 minutes

Primary capability: validate an unknown string array and construct an independently owned
readonly domain collection

## Goal

Build a `Deployment` domain boundary containing `warningCodes: readonly string[]`. This
introduces one operation—array decoding—while retaining the broader ownership established
in REACT-037.

This task has three required deliverables:

1. Implement the complete string-array reader.
2. Build the complete `Deployment` domain class.
3. Author the invalid-element rejection test.

## Mental model

An array boundary has two levels of trust to establish:

```text
unknown value → is the container an array?
              → is every indexed element a string?
              → produce a new trusted array
```

Checking only `Array.isArray` would trust the elements too early. Checking the elements and
then returning the original array would retain an external alias: code holding the raw API
array could mutate what the domain object observes later.

The reader therefore maps every item through `readString`. Mapping both validates every
element and produces a new array. Use an indexed field label such as `warning_codes[1]` so
an error identifies the exact invalid entry.

The domain property and reader return type are `readonly string[]`. TypeScript's readonly
array contract prevents consumers from calling mutating methods through that type; the
defensive copy separately prevents mutations through the original input reference.

Valid and invalid states are:

```text
[]                       → valid empty collection
["LATE_SCAN"]            → valid copied collection
"LATE_SCAN"              → invalid container
["LATE_SCAN", 404]       → invalid element at index 1
```

## Supplied boundary

`src/types/deployment-api.ts` describes this wire record:

```json
{
  "deployment_id": "deployment-901",
  "environment": "production",
  "warning_codes": ["LATE_SCAN", "ADDRESS_CHECK"],
  "duration_minutes": 18
}
```

The API type, scalar readers, fixture, valid-array test, empty-array test, defensive-copy
test, non-array test, and harness are supplied. The array reader is a throwing stub, and
the class contains only its imports and name.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Use `Array.isArray`, indexed `.map`, and `toEqual` | demonstrated | Earlier React exercises and supplied scalar helpers |
| Model `readonly string[]` | retrieved at compile time | REACT-031 and REACT-032 |
| Validate both array container and elements | new target operation | Mental model and supplied behavior cases |
| Return a defensive copy | new part of the same array operation | Supplied aliasing test |
| Build a complete readonly domain class | retrieved | REACT-035 and REACT-037 |
| Author a rejection test | retrieved | REACT-037 |
| Decode object arrays, request data, or render React | excluded | Later boundaries |

Only string-array decoding is unfamiliar. Class construction and test authorship are
familiar responsibilities.

Test ownership is **starter plus learner case**. You author the invalid-element case; all
test infrastructure and comparison behaviors are supplied.

## Implementation checklist

### 1. Implement `readStringArray`

Replace its placeholder body in `src/domain/primitives.ts`:

- If `value` is not an array, throw `` `${fieldName} must be an array` ``.
- Map every item through `readString` and return the resulting new array.
- Pass an indexed label—`` `${fieldName}[${index}]` ``—to `readString`.
- Preserve valid empty arrays.
- Do not cast, return the raw input array, filter bad values, coerce items, or provide a
  default.

### 2. Build `Deployment`

Complete `src/domain/deployment.ts`:

- Declare readonly `id: string`, `environment: string`,
  `warningCodes: readonly string[]`, and `durationMinutes: number` properties.
- Add a constructor accepting one `unknown` value.
- Validate the container using `"Deployment"` as its label.
- Map `deployment_id` to `id` through `readString`.
- Map `environment` to `environment` through `readString`.
- Map `warning_codes` to `warningCodes` through `readStringArray`.
- Map `duration_minutes` to `durationMinutes` through `readNumber`.
- Pass exact wire keys to the field readers.

### 3. Author the invalid-element test

Inside the existing `describe` block in `src/domain/deployment.test.ts`, write a test named
`"rejects a non-string warning code"`.

Construct a `Deployment` from the supplied fixture with `warning_codes` replaced by
`["LATE_SCAN", 404]`. Assert that construction throws
`"warning_codes[1] must be a string"`.

## Independent retrieval boundary

For independent evidence, use the current task's files, compiler/test output, and linked
documentation. Do not open prior domain exercises or use AI-generated implementation code.
If you need help, ask; the assistance level will determine the next retrieval.

## Scope

- Edit only the array-reader body, `Deployment`, and the new invalid-element case.
- Do not edit the API type, scalar readers, fixture, or supplied tests.
- Do not add nested object arrays, nullable arrays, methods, factories, requests, or React
  code.
- Do not use casts, non-null assertions, `any`, coercion, filtering, or defaults.
- Disclose any documentation or help you use.

Your first three edits should be:

1. Add the non-array rejection branch.
2. Map array elements through `readString` with indexed labels.
3. Declare the four readonly domain properties.

Then construct the class and test. The likely stuck point is validating successfully but
returning `value`; the returned collection must be the newly mapped array so the raw input
cannot mutate domain state through a shared reference.

## Start and verify

Before editing, run:

```bash
npm run typecheck
npx vitest run exercises/react/038-introduce-string-array-domain-decoding
```

The compiler and all four supplied cases should fail because `Deployment` has no constructor
contract or behavior yet.

After completing all three deliverables, run:

```bash
npm run typecheck
npx vitest run exercises/react/038-introduce-string-array-domain-decoding
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

There is no browser check or production build for this domain-only task.

## Documentation

- [TypeScript: `ReadonlyArray`](https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type)
- [MDN: `Array.isArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
- [MDN: `Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [Vitest: `toEqual`](https://vitest.dev/api/expect.html#toequal)

## Done when

- The reader validates the container and every indexed element.
- The reader returns a defensive copy and preserves an empty array.
- `Deployment` exposes all four correctly mapped readonly properties.
- The learner-authored invalid-element test is present and meaningful.
- Typecheck, focused tests, and the stable suite pass.
- Only the three permitted locations are changed.
