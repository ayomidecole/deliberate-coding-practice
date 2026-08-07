# REACT-036: Introduce Nullable Domain Decoding

Status: complete

Target time: 25–35 minutes

Primary capability: decode a required runtime field whose valid values are `string` or
`null`

## Goal

Implement the first nullable primitive reader and use it to construct a `SupportTicket`
domain model. Scalar class decoding is already retrieved; this task adds one new operation:
distinguishing two valid runtime branches from an invalid third branch.

## Mental model

The wire contract says `assignee_name` is required, but its value may mean either:

```text
string → assigned ticket
null   → intentionally unassigned ticket
other  → invalid server data
```

Nullable is not the same as optional. A required `string | null` field accepts an explicit
`null`; it does not accept a missing value (`undefined`). An empty string is still a string,
so a truthiness check would model the contract incorrectly.

The nullable reader is a runtime implementation of a union type. It must narrow an
`unknown` value into exactly one of the two valid outputs:

```text
unknown → null branch → return null
        → string branch → return the string
        → neither branch → throw a field-specific error
```

The domain constructor then uses that reader just like the familiar scalar readers. Once
construction succeeds, downstream code receives `assigneeName: string | null` and handles
the business meaning rather than questioning the raw JSON type.

## Supplied boundary

`src/types/support-ticket-api.ts` describes this wire record:

```json
{
  "ticket_id": "ticket-612",
  "subject": "Address confirmation required",
  "assignee_name": null,
  "priority": 3
}
```

The scalar primitive readers, scalar class path, nullable property declaration, fixtures,
and all three behavior cases are supplied. `readNullableString` deliberately throws a
placeholder error, and the constructor deliberately leaves `assigneeName` uninitialized.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Validate the object and scalar fields | retrieved | REACT-035 A0 |
| Model `string | null` in a type | demonstrated | REACT-030 through REACT-032 |
| Return `null` for the explicit null branch | new target operation | Mental model and supplied cases |
| Return a string after runtime narrowing | new target operation | Same nullable-decoding operation |
| Reject `undefined`, numbers, and other values | new target operation | Supplied invalid case and required error contract |
| Map the decoded union into a readonly class field | guided | Familiar constructor pattern; reader import supplied |
| Add an assertion inside an existing case | demonstrated | REACT-033 through REACT-035 |

Only nullable runtime decoding is unfamiliar. Scalar construction and all rejection-test
infrastructure remain supplied.

Test ownership is **starter plus learner assertion**. You add one familiar assigned-value
assertion; null and invalid-input behavior tests are supplied.

## Your task

### 1. Implement the nullable reader

Replace the placeholder body of `readNullableString` in `src/domain/primitives.ts`.

Its contract is:

- return `null` when `value` is exactly `null`;
- return `value` when its runtime type is string;
- otherwise throw `new Error` with the exact message
  `` `${fieldName} must be a string or null` ``.

Do not call `String(value)`, use truthiness, provide a default, or accept `undefined`.

### 2. Complete the domain mapping

In `src/domain/support-ticket.ts`, initialize `assigneeName` from the
`assignee_name` wire field through `readNullableString`. Pass the exact wire key as its
field label. Do not change the supplied scalar mappings.

### 3. Add one test assertion

Inside the existing `preserves an assigned name` test case, add one assertion proving that
`ticket.assigneeName` equals `"Ava Cole"`. Do not create another `it` block.

## Scope

- Edit only the nullable-reader body, the missing constructor assignment, and the existing
  assigned-name test case.
- Do not edit the API type, scalar readers, fixtures, supplied assertions, or test names.
- Do not add optional properties, defaults, arrays, methods, factories, requests, or React
  code.
- Do not use casts, non-null assertions, `any`, or coercion.
- Disclose any documentation or help you use.

Your first three edits should be:

1. Implement the exact-null return branch.
2. Implement the runtime-string return branch.
3. Throw the required error when neither valid branch matched.

Then wire the helper into the constructor and add the assertion. The likely stuck point is
using a falsy check, which would incorrectly treat the valid empty string like `null` and
could accidentally accept `undefined`.

## Start and verify

Before editing, run:

```bash
npm run typecheck
npx vitest run exercises/react/036-introduce-nullable-domain-decoding
```

Typecheck should report that `assigneeName` is not initialized. The focused suite should
start at 1/3 passing: the null and invalid-number behaviors fail until the reader is wired.

After your edits, run:

```bash
npm run typecheck
npx vitest run exercises/react/036-introduce-nullable-domain-decoding
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

There is no browser check or production build for this domain-only task.

## Documentation

- [TypeScript: union types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [TypeScript: `typeof` narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards)
- [Vitest: `toBeNull`](https://vitest.dev/api/expect.html#tobenull)

## Done when

- The nullable reader returns the exact valid string or `null` value.
- Missing and wrong-type values throw the required field-specific error.
- `SupportTicket` assigns the decoded wire value to `assigneeName`.
- Your assigned-name assertion is inside the supplied test case.
- Typecheck, focused tests, and the stable suite pass.
- Only the three permitted locations are changed.
