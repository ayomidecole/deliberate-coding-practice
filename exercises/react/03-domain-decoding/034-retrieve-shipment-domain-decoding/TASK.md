# REACT-034: Retrieve Scalar Domain Decoding

Status: complete

Target time: 20–30 minutes

Primary capability: independently construct a validated scalar domain model with reduced
scaffolding

## Goal

Complete a `Shipment` domain class from a different wire record. This retrieves the same
boundary introduced in REACT-033, but the constructor no longer supplies the object
narrowing or first field mapping.

The task deliberately stays with strings and a number. Arrays and nullable values wait
until scalar decoding has independent evidence.

## Mental model

The responsibility remains:

```text
untrusted runtime value → validate container → validate fields → trusted Shipment
```

The supplied API type documents the expected wire shape. It does not validate a runtime
value. The domain constructor must therefore:

1. use `readObject` before accessing fields;
2. send every raw field through its matching primitive reader;
3. assign the validated result to its readonly domain property.

The three names in a mapping can differ in purpose:

```text
domain property ← validator(rawRecord.wire_key, "wire_key")
```

The domain class uses camel case; error labels retain exact wire names so a bad server
field can be identified.

## Supplied boundary

`src/types/shipment-api.ts` describes this wire record:

```json
{
  "shipment_id": "shipment-8841",
  "tracking_code": "TRK-8841",
  "delay_minutes": 45
}
```

The API type, primitive readers, class fields, constructor signature, fixtures, and test
harness are supplied. Do not reopen REACT-033; use the mental model, the available reader
signatures, and compiler/test feedback.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Accept an unknown constructor value | demonstrated | REACT-033 |
| Validate the container with `readObject` | guided retrieval | Supplied in REACT-033; reader remains available |
| Map snake-case fields to camel-case properties | demonstrated | REACT-033 |
| Select string or number readers | demonstrated | REACT-033 |
| Initialize readonly class fields | demonstrated | REACT-033 |
| Add an assertion inside an existing case | demonstrated | Corrected and completed in REACT-033 |
| Author validators or rejection-test structure | supplied | Not learner responsibility here |

There are no new operations. The difficulty increase is reduced constructor scaffolding.

Test ownership is **starter plus learner assertion**. The harness and invalid-input case
remain supplied; you add one assertion to the existing valid-construction case.

## Your task

### 1. Complete the domain constructor

Edit the empty constructor in `src/domain/shipment.ts`:

- Validate `value` as an object and keep the returned record in a local variable.
- Initialize `id` from `shipment_id` through the matching reader.
- Initialize `trackingCode` from `tracking_code` through the matching reader.
- Initialize `delayMinutes` from `delay_minutes` through the matching reader.
- Use the exact wire key as each reader's error-label argument.

Choose the readers from their input/output contracts. Do not copy REACT-033.

### 2. Add one test assertion

Inside the existing valid-construction `it` block in `src/domain/shipment.test.ts`, add one
`expect` statement proving that `trackingCode` equals `"TRK-8841"`. Do not create another
`it` block.

## Scope

- Edit only the constructor body and the existing valid test case.
- Do not edit the API type, validators, fixtures, class fields, or supplied assertions.
- Do not add helpers, arrays, nullable fields, methods, factories, requests, or React code.
- Do not use casts, non-null assertions, `any`, defaults, or unvalidated field assignment.
- Disclose any documentation or help you use.

Your first three edits should be:

1. Establish the validated record with `readObject`.
2. Map `shipment_id` to `id` through its reader.
3. Map `tracking_code` to `trackingCode` through its reader.

Then map the numeric field and add the test assertion. The likely stuck point is attempting
to read properties from `value` before `readObject` has converted the unknown container
into a record.

## Start and verify

Before editing, run:

```bash
npm run typecheck
npx vitest run exercises/react/03-domain-decoding/034-retrieve-shipment-domain-decoding
```

Typecheck should report three uninitialized properties. Both focused cases should fail
because the empty constructor neither stores the valid numeric value nor rejects the bad
tracking code.

After your edits, run:

```bash
npm run typecheck
npx vitest run exercises/react/03-domain-decoding/034-retrieve-shipment-domain-decoding
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

There is no browser check or production build for this domain-only retrieval task.

## Documentation

- [TypeScript: classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [TypeScript: narrowing `unknown`](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-unknown-type)
- [Vitest: `toBe`](https://vitest.dev/api/expect.html#tobe)

## Done when

- `new Shipment(validRecord)` exposes all three correctly mapped readonly properties.
- A non-string `tracking_code` throws the supplied field-specific error.
- The valid-record test contains your `trackingCode` assertion in the existing case.
- Typecheck, focused tests, and the stable suite pass.
- Only the two permitted locations are changed.
