# REACT-033: Introduce Domain Decoding

Status: complete

Target time: 25–35 minutes

Primary capability: construct a validated, readonly domain model from an untrusted runtime
value

## Goal

Complete the first `domain` class in the React track. An `Order` constructor will accept an
unknown runtime value, validate its fields through supplied readers, translate the API's
wire names into domain names, and expose a trusted readonly model.

This matches the responsibility used by your team's `domain` folder while keeping the
first exercise to scalar fields only.

## Mental model

The API type and domain class protect different boundaries:

```text
server JSON → compile-time API shape → runtime validation → trusted Order instance
                 src/types              src/domain
```

- A type alias records what the server is expected to send, but TypeScript types disappear
  at runtime.
- The domain constructor accepts `unknown` because external data is not trusted merely
  because code gave it a type annotation.
- `readObject` first proves that the input is a non-null object.
- `readString` and `readNumber` prove individual field values before they are assigned.
- The constructor is the one place allowed to initialize the class's readonly properties.
- Wire names may remain snake case while the trusted domain model exposes application-facing
  names such as `id`.

The supplied first mapping demonstrates the constructor flow:

```ts
this.id = readString(record.order_id, "order_id");
```

Read this from right to left: take the raw `order_id`, require it to be a string, then store
the validated value as the domain object's `id`.

## Supplied boundary

The API contract in `src/types/order-api.ts` describes this expected wire record:

```json
{
  "order_id": "order-731",
  "reference": "ORD-731",
  "priority": 2
}
```

The readers in `src/domain/primitives.ts`, the domain class shell, the first `id` mapping,
and both test cases are supplied. You are using those readers, not implementing validation
infrastructure yet.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Read a raw API object contract | retrieved | REACT-032 |
| Initialize readonly properties | demonstrated | Prior readonly modeling; class shell supplied |
| Map a wire field to a domain property | new target operation | Mental model and first `id` mapping supplied |
| Use object and primitive runtime readers | supplied infrastructure | `primitives.ts` is complete |
| Choose the string or number reader | guided | Function names, signatures, and one string use are visible |
| Add one value assertion | demonstrated | Existing React tests use `toBe` |
| Author class syntax or test harness | supplied | Both structures already exist |

Only domain construction is unfamiliar. Input-container validation, thrown errors, and the
test harness are observable but remain supplied responsibilities.

Test ownership is **starter plus learner assertion**. You add one familiar value assertion;
the invalid-input case is supplied because rejection testing is not the new responsibility
for this task.

## Your task

### 1. Complete the domain constructor

Edit `src/domain/order.ts`. After the supplied `id` assignment:

- Initialize `reference` from the wire field with the same name and validate it using the
  appropriate supplied reader.
- Initialize `priority` from the wire field with the same name and validate it using the
  appropriate supplied reader.
- Pass the exact wire field name as the reader's second argument so failures identify the
  bad boundary field.

Do not change the class fields, constructor parameter, object reader, or supplied `id`
mapping.

### 2. Add one test assertion

In the valid-record test in `src/domain/order.test.ts`, add one assertion that proves the
domain object's `reference` equals the supplied wire value. Do not change the fixture or
the existing tests.

## Scope

- Edit only the two locations described above.
- Do not edit the API contract, primitive readers, fixtures, or supplied assertions.
- Do not add arrays, nullable fields, methods, factories, requests, React components, or
  extra validation rules.
- Do not use casts, non-null assertions, `any`, defaults, or direct assignment of unvalidated
  record values.
- Disclose any documentation or help you use.

Your first three edits should be:

1. Initialize `reference` through the correct reader.
2. Initialize `priority` through the correct reader.
3. Add the requested `reference` assertion.

The likely stuck point is keeping three roles distinct in one expression: the domain
property on the left, the wire-format key inside `record`, and the validator selected for
that value's runtime type.

## Start and verify

Before editing, run:

```bash
npm run typecheck
npx vitest run exercises/react/02-data-boundaries/033-introduce-order-domain-decoding
```

Typecheck should report that `reference` and `priority` are not initialized. Both focused
cases should initially fail because the missing priority mapping neither stores the valid
number nor rejects the invalid string.

After your edits, run:

```bash
npm run typecheck
npx vitest run exercises/react/02-data-boundaries/033-introduce-order-domain-decoding
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

There is no browser check or production build because this task stops at the domain
boundary.

## Documentation

- [TypeScript: classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [TypeScript: narrowing `unknown`](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-unknown-type)
- [Vitest: `toBe`](https://vitest.dev/api/expect.html#tobe)

## Done when

- `new Order(validRecord)` exposes the three correctly mapped readonly properties.
- A non-number `priority` throws the supplied field-specific error.
- Your valid-record test includes the requested `reference` assertion.
- Typecheck, the focused tests, and the stable suite pass.
- Only the two permitted locations are changed.
