# REACT-032: Retrieve an API Contract and Its Type Test

Status: complete

Target time: 20–30 minutes

Primary capability: independently retrieve raw API contract modeling while retaining a
small amount of type-test ownership

## Goal

Model an alert-list response from its JSON wire format, then complete one supplied type
test for the response envelope. This is another retrieval of the API-contract boundary;
it does not add domain decoding, requests, or React behavior yet.

## Mental model

The production types describe the server data that may enter the frontend. The type test
compares that contract with an independently written expected shape:

```text
wire-format JSON → production type ← type-level expectation
```

`expectTypeOf<A>().toEqualTypeOf<B>()` asks TypeScript whether `A` and `B` are exactly the
same type. It does not make an HTTP request or validate JSON at runtime. The first record
assertion is supplied as the pattern; you will complete the response assertion.

## Supplied wire response

```json
{
  "alerts": [
    {
      "alert_id": "alert-88",
      "message": "Shipment requires address review",
      "severity": 2,
      "affected_order_ids": ["order-731", "order-842"],
      "resolved_at": null
    }
  ],
  "generated_at": "2026-08-06T15:00:00Z"
}
```

Additional contract facts:

- `affected_order_ids` can be empty but is always present.
- `resolved_at` is a string when the alert is resolved and `null` otherwise.
- `generated_at` is always a string.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Define record and response object aliases | demonstrated | REACT-030 and REACT-031 |
| Preserve snake-case wire names | demonstrated | REACT-030 and REACT-031 |
| Apply `readonly` to object properties | demonstrated | REACT-030 and REACT-031 |
| Model readonly outer and nested collections | guided retrieval target | REACT-031 needed one reminder at the outer boundary |
| Model required number and string-or-null fields | demonstrated | Earlier TypeScript work and REACT-031 |
| Complete one `expectTypeOf` assertion | scaffolded | One complete adjacent assertion supplies the pattern |

There are no new production operations. The only responsibility increase is completing
one response-level type assertion after modeling the contract.

Test ownership is **starter plus learner case**. The test structure and expected aliases
are supplied; you author the response assertion so the testing habit stays active without
competing with the contract retrieval.

## Your task

### 1. Model the production contract

Edit `src/types/alert-list-api.ts` and replace both `unknown` placeholders.

Requirements:

- `AlertApiRecord` describes one object in `alerts`.
- `AlertListApiResponse` describes the complete response.
- Every object property is `readonly`.
- Both collection boundaries are readonly.
- Wire-format field names remain exact.
- `resolved_at` is required and accepts a string or `null`.
- The response refers to `AlertApiRecord` rather than duplicating its fields.

Use the JSON and contract facts as your production source of truth. Do not copy the
expected aliases from the test.

### 2. Complete the response type test

In `src/types/alert-list-api.test.ts`, find the empty `matches the complete raw response`
case. Add one `expectTypeOf` assertion that compares `AlertListApiResponse` with
`ExpectedAlertListApiResponse`. Follow the supplied record assertion's pattern.

## Scope

- Edit only `src/types/alert-list-api.ts` and the empty response test case.
- Do not change the supplied expected aliases or record assertion.
- Do not create domain classes, validators, mappers, requests, components, features, or
  runtime fixtures.
- Do not use `any`, broad records, optional properties, mutable arrays, or type assertions.
- Disclose any documentation or help you use.

Your first three edits should be:

1. Build the `AlertApiRecord` object shape from one object in `alerts`.
2. Build the response envelope using `AlertApiRecord`.
3. Complete the response-level `expectTypeOf` assertion.

The likely stuck point is applying readonly at both collection boundaries: the response's
`alerts` collection and each record's `affected_order_ids` collection.

## Start and verify

Before editing, run:

```bash
npm run typecheck
```

It should fail at the supplied record assertion while `AlertApiRecord` remains `unknown`.
The focused Vitest cases can still execute because `expectTypeOf` is checked by TypeScript.

After completing both parts, run:

```bash
npm run typecheck
npx vitest run exercises/react/032-retrieve-alert-api-contract
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

There is no browser check or production build for this type-only task.

## Documentation

- [TypeScript: everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript: object and readonly types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Vitest: testing types](https://vitest.dev/guide/testing-types)

## Done when

- Both production aliases exactly describe the wire response.
- Both collection boundaries and every property are readonly.
- The response test contains your type assertion and checks the production response alias.
- Typecheck, the focused type test, and the stable suite pass.
- Only the two permitted locations are changed.
