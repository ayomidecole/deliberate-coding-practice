# REACT-030: Model an Order API Contract

Status: complete

Target time: 15–25 minutes

Primary capability: model a raw API response in the repository's `types` layer

## Goal

Replace two placeholder aliases with TypeScript types that describe a supplied order-list
API response. This introduces the first boundary in the API arc without yet combining it
with HTTP requests, React state, runtime validation, or domain construction.

This task intentionally involves one target file and has no browser UI. You asked to work
inside individual architectural layers as well as combine them later; this is the isolated
`types`-layer step that future `api`, `domain`, and `features` work will consume.

## Mental model

An API contract type describes the shape the frontend expects at the network boundary:

```text
JSON response
    ↓ described at compile time
types/order-list-api.ts
    ↓ consumed later by
api request → domain construction → feature
```

The contract must follow the wire format exactly. If the server sends `customer_name`, the
raw response type says `customer_name`; it does not rename the field to fit UI conventions.
A later domain constructor can validate the unknown runtime value and create a camel-cased,
readonly model.

This distinction matters:

- `types` contains compile-time shapes and disappears when TypeScript is compiled.
- `api` will perform the HTTP request and receive the raw response.
- `domain` will later validate raw values and construct behavior-owning models.
- `features` will coordinate those results for the user interface.

Declaring a response type does **not** prove that a server actually returned that shape.
That runtime boundary is deliberately deferred.

## Supplied wire response

The endpoint is expected to return this JSON shape:

```json
{
  "orders": [
    {
      "id": "order-731",
      "reference": "ORD-731",
      "customer_name": "Northwind Retail",
      "total_cents": 12900
    }
  ],
  "next_cursor": null
}
```

On a page with more results, `next_cursor` contains a string instead of `null`. The key is
always present.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Define object type aliases | demonstrated | Established TypeScript work |
| Represent strings, numbers, arrays, and `null` | known | Established TypeScript operations |
| Reference one type inside another | demonstrated | Prior shared model and props types |
| Preserve raw wire-format field names | new | Explained above and fixed by the supplied schema |
| Distinguish contract types from domain classes | new boundary, same concept | Explained above; domain behavior is excluded |
| Use Vitest type assertions | supplied | First type-only contract test; learner does not author it |
| Make a request or validate runtime JSON | excluded | Introduced in later tasks |

The two new rows are one architectural decision: a raw contract mirrors the wire shape in
`types`. No additional runtime or React boundary is introduced.

Test ownership is **supplied**. Type-only assertions are unfamiliar infrastructure, and
authoring that harness would add a second learning dimension. Your existing behavior-test
ownership returns in later feature work.

## Your task

Edit only `src/types/order-list-api.ts`.

Replace both `unknown` placeholders:

1. `OrderApiRecord` must describe one object inside `orders`.
2. `OrderListApiResponse` must describe the complete response object.

Requirements:

- Every property must be `readonly`.
- Use the exact field names from the JSON response.
- `orders` must be a readonly collection of `OrderApiRecord` values.
- `next_cursor` must accept a string or `null`; it must not be optional.
- Keep the two supplied exported type names.

Do not copy the expected types out of the supplied test. Use the JSON contract above as
the source of truth; the test is verification, not the implementation specification to
transcribe.

## Scope

- Edit only `src/types/order-list-api.ts`.
- Do not edit the supplied type test.
- Do not create a class, constructor, validator, mapper, function, API request, component,
  feature, mock server, or runtime fixture.
- Do not rename snake-case response fields to camel case.
- Do not use `any`, `Record<string, unknown>`, optional properties, or type assertions.

Your first three edits should be:

1. Replace `OrderApiRecord = unknown` with an object type shell.
2. Translate the four fields of one order into that shell.
3. Replace `OrderListApiResponse = unknown` with the collection and cursor fields.

The likely stuck point is `next_cursor`: because the server always sends the key, its type
is a required `string`-or-`null` value, not an optional property.

## Start and verify

Run the typecheck before editing:

```bash
npm run typecheck
```

It should fail in the supplied contract test because `unknown` does not equal the expected
shape. The Vitest case may still execute successfully before your change because
TypeScript types do not exist at runtime; the compiler is the primary check here.

After implementing both types, run:

```bash
npm run typecheck
npx vitest run exercises/react/02-data-boundaries/030-model-order-api-contract
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

There is no browser check or production build for this type-only exercise.

## Documentation

- [TypeScript: everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript: object and readonly types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Vitest: testing types](https://vitest.dev/guide/testing-types)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)

## Done when

- Both aliases exactly describe the supplied wire response.
- Raw snake-case field names remain unchanged.
- The response refers to the record type instead of duplicating its fields.
- Typecheck, the focused type test, and the stable suite pass.
- Only the target type file is changed.
