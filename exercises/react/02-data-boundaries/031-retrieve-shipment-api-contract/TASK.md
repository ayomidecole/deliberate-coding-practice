# REACT-031: Retrieve API Contract Modeling

Status: complete

Target time: 15–25 minutes

Primary capability: independently retrieve raw API contract modeling

## Goal

Model a shipment-list response from its supplied JSON wire format. This task retrieves the
contract capability introduced in REACT-030 before another architectural boundary is
added.

There is still no runtime or browser behavior. The target is whether you can reconstruct
readonly records, readonly collections, exact wire names, and a nullable field in a new
shape without reopening the previous exercise.

## Mental model

The type file describes what the frontend expects the server to send. It neither performs
the request nor proves that runtime JSON is valid:

```text
wire-format JSON → compile-time contract
```

This response has two collection boundaries. `shipments` is a collection of records, and
each record's `warning_codes` is another collection. Each boundary must communicate that
consumers should not mutate the received data.

## Supplied wire response

```json
{
  "shipments": [
    {
      "shipment_id": "shipment-912",
      "reference": "SHP-912",
      "warning_codes": ["LATE_SCAN", "ADDRESS_CHECK"],
      "estimated_delivery": null
    }
  ],
  "generated_at": "2026-08-06T14:30:00Z"
}
```

Additional contract facts:

- `warning_codes` can be an empty collection but is always present.
- `estimated_delivery` contains an ISO timestamp when known and `null` otherwise.
- `generated_at` is always a string.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Define record and response object aliases | demonstrated | REACT-030 |
| Preserve snake-case wire names | demonstrated | REACT-030 |
| Apply `readonly` to properties | demonstrated | REACT-030 |
| Model a readonly collection of records | demonstrated | REACT-030 |
| Model a readonly collection of strings | known operation in a new position | Same readonly-array syntax |
| Model a required string-or-null property | demonstrated | REACT-030 |
| Use Vitest type assertions | supplied | Harness remains outside learner ownership |

There are no unfamiliar operations. The only difficulty change is reconstructing the
contract with less explanation and two separate readonly collections.

Test ownership is **supplied**. Contract retrieval remains the only capability under
assessment; type-test authorship is not added to it.

## Your task

Edit only `src/types/shipment-list-api.ts` and replace both `unknown` placeholders.

Requirements:

- `ShipmentApiRecord` describes one object in `shipments`.
- `ShipmentListApiResponse` describes the complete response.
- Every object property is `readonly`.
- Both collections are readonly.
- Wire-format field names remain exact.
- `estimated_delivery` is required and accepts a string or `null`.
- The response refers to `ShipmentApiRecord` rather than duplicating its fields.

Use the JSON and contract facts as your source of truth. Do not copy the expected aliases
from the supplied test.

## Scope

- Edit only `src/types/shipment-list-api.ts`.
- Do not edit the supplied type test or reopen REACT-030.
- Do not create functions, classes, validators, mappers, requests, components, features,
  runtime fixtures, or additional types.
- Do not use `any`, broad records, optional properties, mutable arrays, or type assertions.
- Disclose any documentation or help you use.

Your first three edits should be:

1. Create the `ShipmentApiRecord` object shape.
2. Translate its scalar, collection, and nullable fields.
3. Create the response shape using the record type.

The likely stuck point is distinguishing the two readonly concerns: the
`warning_codes` property cannot be replaced, and its array cannot be mutated through this
contract.

## Start and verify

Before editing, run:

```bash
npm run typecheck
```

It should fail at the two supplied type assertions while the aliases remain `unknown`.
The focused Vitest case may execute successfully because these assertions are enforced by
the TypeScript compiler.

After implementing the aliases, run:

```bash
npm run typecheck
npx vitest run exercises/react/02-data-boundaries/031-retrieve-shipment-api-contract
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

There is no browser check or production build for this type-only retrieval task.

## Documentation

- [TypeScript: everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript: object and readonly types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Vitest: testing types](https://vitest.dev/guide/testing-types)

## Done when

- Both aliases exactly describe the supplied wire response.
- Both collection boundaries and every property are readonly.
- Typecheck, the focused type test, and the stable suite pass.
- Only the target type file is changed.
