# REACT-039: Retrieve String-Array Domain Decoding

Status: complete

Target time: 35–50 minutes

Primary capability: independently validate unknown string arrays and give the domain its
own readonly collections

## Goal

Build an `AccessPolicy` domain boundary with two string-array fields. This retrieves the
array operation from REACT-038 in a changed domain before we add another architectural
boundary.

You have three deliverables:

1. Implement `readStringArray` without opening REACT-038.
2. Build the complete `AccessPolicy` class.
3. Author one required invalid-element test.

## Mental model

The operation establishes trust in layers:

```text
unknown value
  → prove the outer value is an array
  → visit every existing item and its index
  → prove each item is a string
  → collect the validated strings into a new array
```

The item passed to the mapping callback is the value being validated. The indexed label,
such as `required_roles[1]`, is only diagnostic text passed to `readString`; it identifies
the failing location but does not access the array.

Returning the mapped result matters even when every item is already a string. It gives the
domain a different array reference from the raw API record. The readonly type controls what
domain consumers may do through the property; the copy prevents mutation through the
original wire-data reference.

## Supplied boundary

`src/types/access-policy-api.ts` supplies this wire shape:

```json
{
  "policy_id": "policy-204",
  "policy_name": "Production deployment",
  "allowed_regions": ["us-east-1", "us-west-2"],
  "required_roles": ["release-manager", "service-owner"],
  "revision": 3
}
```

The API type, scalar readers, fixture, five comparison tests, and Vitest harness are
supplied. The array reader throws a placeholder error, and the class is empty.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Reject a non-array container | guided retrieval | REACT-038 required A4 help |
| Validate every element and return the mapped copy | guided retrieval; sole target | REACT-038 required A4 help |
| Build indexed diagnostic labels | guided retrieval; same operation | Mental model above |
| Decode two fields with the same reader | retrieved application | Domain construction from REACT-035–038 |
| Build the remaining readonly domain fields | retrieved | REACT-035 and REACT-037 |
| Author one rejection test | retrieved | REACT-037 and REACT-038 |
| Add API calls, React, nullable arrays, or object arrays | excluded | Later tasks |

This task adds no unfamiliar operation. It changes the domain and requires the same array
decoder to serve two independent fields.

Test ownership is **starter plus learner case**. The supplied tests cover the general
contract; your case proves that indexed validation also works for the second collection.

## Implementation checklist

### 1. Rebuild `readStringArray`

In `src/domain/primitives.ts`:

- Reject a value whose outer container is not an array with
  `` `${fieldName} must be an array` ``.
- Visit every item with its index.
- Validate each item through the supplied `readString`.
- Give `readString` an indexed field label.
- Return the newly produced array.
- Preserve an empty array.

Do not cast, return the raw input, filter invalid values, coerce them, or supply defaults.

### 2. Build `AccessPolicy`

In `src/domain/access-policy.ts`, build a class with these properties:

- `readonly id: string`
- `readonly name: string`
- `readonly allowedRegions: readonly string[]`
- `readonly requiredRoles: readonly string[]`
- `readonly revision: number`

Its constructor accepts `unknown`, validates the object with the label `AccessPolicy`, and
maps:

| Wire field | Domain property | Reader |
|---|---|---|
| `policy_id` | `id` | `readString` |
| `policy_name` | `name` | `readString` |
| `allowed_regions` | `allowedRegions` | `readStringArray` |
| `required_roles` | `requiredRoles` | `readStringArray` |
| `revision` | `revision` | `readNumber` |

Use the exact wire key as each reader's diagnostic label.

### 3. Author the second-collection test

Inside the existing `describe` block in `src/domain/access-policy.test.ts`, add a test named
`rejects a non-string required role`.

Construct an `AccessPolicy` from the supplied fixture with `required_roles` replaced by
`["release-manager", false]`. Assert that construction throws:

```text
required_roles[1] must be a string
```

## Independent retrieval boundary

Use this task document, the current files, compiler/test output, and linked documentation.
Do not open REACT-038 or ask AI for implementation code. If you need help, ask for a hint;
the assistance level will determine whether another retrieval is needed.

## Scope

- Edit only the `readStringArray` body, `AccessPolicy`, and your new test case.
- Do not edit the API type, scalar readers, fixture, or supplied tests.
- Do not add new helpers, dependencies, API requests, React code, nullable arrays, or object
  arrays.

Your first three edits should be:

1. Replace the reader's placeholder with the outer-container rejection.
2. Produce and return an array whose elements have been validated with indexed labels.
3. Declare the five readonly `AccessPolicy` properties.

Then complete the constructor mappings and your test. The likely stuck point is treating
the diagnostic label as the array lookup. Remember: the callback's item is the value;
the constructed label only tells `readString` what to name in an error.

## Start and verify

Before editing, run:

```bash
npm run typecheck
npx vitest run exercises/react/02-data-boundaries/039-retrieve-string-array-domain-decoding
```

Both are expected to fail while the class and reader remain incomplete.

When all three deliverables are complete, run:

```bash
npm run typecheck
npx vitest run exercises/react/02-data-boundaries/039-retrieve-string-array-domain-decoding
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

There is no browser check or production build for this domain-only task.

## Documentation

- [MDN: `Array.isArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
- [MDN: `Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [TypeScript: `ReadonlyArray`](https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type)
- [Vitest: `toThrowError`](https://vitest.dev/api/expect.html#tothrowerror)

## Done when

- The reader rejects non-arrays and invalid indexed elements.
- The reader preserves empty arrays and returns a defensive copy.
- Both collection fields use the shared reader and expose independent readonly arrays.
- All scalar fields are mapped correctly.
- Your required_roles rejection test is present and meaningful.
- Typecheck, focused tests, and the stable suite pass.
- Only the three permitted locations changed.
