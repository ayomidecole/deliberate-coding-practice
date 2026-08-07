# REACT-035: Retrieve Domain Decoding Independently

Status: complete

Target time: 25–35 minutes

Primary capability: independently reconstruct a validated scalar domain class

## Goal

Build a `Customer` domain class from a minimally supplied declaration. This is the
immediate retrieval required after REACT-034's solution-level assistance.

The data still contains only strings and a number. Success here means independently
reconstructing the boundary before arrays, nullability, domain methods, or API integration
increase the difficulty.

## Mental model

Reconstruct this flow from the supplied files:

```text
unknown value → object reader → field readers → readonly Customer
```

The API type documents an expected wire shape but cannot validate runtime JSON. The class
constructor establishes the runtime guarantee. Its responsibilities are:

- declare the trusted properties the application may consume;
- validate the whole input before reading any field;
- translate each wire key into its domain property;
- choose a reader whose output matches that property's type;
- identify whole-object failures with the domain name and field failures with wire names.

The supplied current files contain everything needed to infer the reader signatures and
expected behavior. No implementation mapping is supplied in the class.

## Supplied boundary

`src/types/customer-api.ts` describes this wire record:

```json
{
  "customer_id": "customer-440",
  "display_name": "Northwind Retail",
  "risk_score": 7
}
```

The API type, primitive readers, fixture, assertions for `id` and `riskScore`, and invalid
input case are supplied. `src/domain/customer.ts` supplies only its imports and class name.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Declare readonly class properties | demonstrated | REACT-033 and REACT-034 |
| Write an unknown-input constructor | demonstrated | REACT-033 and REACT-034 |
| Validate the container before field access | guided retrieval | Corrected in REACT-034 |
| Map snake-case strings and a number | guided retrieval | REACT-034 used solution-level help |
| Distinguish object and field error labels | guided retrieval | Corrected after review in REACT-034 |
| Add an assertion inside an existing case | demonstrated | REACT-033 and REACT-034 |
| Author validators or failure-test structure | supplied | Not learner responsibility here |

There are no unfamiliar operations. Reduced class scaffolding is the only increased
difficulty dimension.

Test ownership is **starter plus learner assertion**. You add one familiar assertion to
the existing valid-construction case; the rejection test remains supplied.

## Your task

### 1. Build the domain class

Complete `Customer` in `src/domain/customer.ts`:

- Declare readonly `id: string`, `displayName: string`, and `riskScore: number` properties.
- Add a constructor that accepts one `unknown` value.
- Validate the whole value as an object using the domain name `"Customer"` as its label.
- Map `customer_id` to `id` through the correct reader.
- Map `display_name` to `displayName` through the correct reader.
- Map `risk_score` to `riskScore` through the correct reader.
- Give every field reader its exact wire key as the error label.

Choose the reader functions from their signatures rather than from an earlier solution.

### 2. Add one test assertion

Inside the existing valid-construction `it` block in `src/domain/customer.test.ts`, add one
`expect` statement proving that `displayName` equals `"Northwind Retail"`. Do not create a
new `it` block.

## Independent retrieval boundary

For this task to count as independent evidence:

- Use the current task's API type, validators, tests, compiler output, and linked official
  documentation.
- Do not open REACT-033 or REACT-034 as implementation references.
- Do not use AI-generated code or solution-level guidance.

If you need help, ask for it—the task can still be completed, but the assistance level will
determine whether another scalar retrieval is needed.

## Scope

- Edit only `src/domain/customer.ts` and the existing valid test case.
- Do not edit the API type, validators, fixture, or supplied assertions.
- Do not add helpers, arrays, nullable fields, methods, factories, requests, or React code.
- Do not use casts, non-null assertions, `any`, defaults, or unvalidated field assignment.
- Disclose any documentation or help you use.

Your first three edits should be:

1. Declare the three readonly properties.
2. Add the unknown-input constructor and validate its container as `"Customer"`.
3. Map `customer_id` to `id` through the matching reader.

Then complete the other mappings and test assertion. The likely stuck point is keeping the
domain name for the object-reader label while using exact wire names for field-reader
labels.

## Start and verify

Before editing, run:

```bash
npm run typecheck
npx vitest run exercises/react/035-retrieve-customer-domain-decoding
```

The initial compiler and both focused tests should fail because `Customer` has no fields or
constructor behavior yet.

After your edits, run:

```bash
npm run typecheck
npx vitest run exercises/react/035-retrieve-customer-domain-decoding
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

There is no browser check or production build for this domain-only retrieval task.

## Documentation

- [TypeScript: classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [TypeScript: narrowing `unknown`](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-unknown-type)
- [Vitest: `toBe`](https://vitest.dev/api/expect.html#tobe)

## Done when

- The class independently reconstructs the complete scalar decoding path.
- `new Customer(validRecord)` exposes all three correctly mapped readonly properties.
- A non-number `risk_score` throws the supplied field-specific error.
- Your `displayName` assertion is inside the existing valid case.
- Typecheck, focused tests, and the stable suite pass.
- Only the two permitted locations are changed.
