# REACT-040: Introduce a GET-to-Domain Boundary

Status: active

Target time: 30–45 minutes

Primary capability: sequence an asynchronous GET request and convert its unknown result
into a trusted domain object

## Goal

Implement the first function in the top-level `src/api` layer. `getAccessPolicy` receives a
policy ID, asks a supplied HTTP client for that resource, and returns a validated
`AccessPolicy`.

This connects responsibilities you have already practiced:

```text
caller
  → api/getAccessPolicy owns the endpoint and request sequence
  → HttpClient owns transport details
  → unknown response data
  → domain/AccessPolicy owns runtime validation
  → Promise<AccessPolicy> returns to the caller
```

You own two deliverables:

1. Implement `getAccessPolicy`.
2. Add one assertion proving the exact request path.

## Mental model

Calling `httpClient.get(...)` starts an asynchronous operation and immediately gives the
API function a `Promise<unknown>`. `await` pauses this function's remaining work until that
promise settles:

```text
Promise<unknown> --await--> unknown --AccessPolicy constructor--> AccessPolicy
```

An `async` function always returns a promise. Returning an `AccessPolicy` from its body
therefore fulfills the declared `Promise<AccessPolicy>`.

There are also two rejection paths, both already covered by supplied tests:

- If `httpClient.get` rejects, `await` causes `getAccessPolicy` to reject with that error.
- If the domain constructor throws because the response is malformed, the async function
  returns a rejected promise containing that validation error.

Do not catch either error in this exercise. The API function has no recovery policy yet;
its caller will eventually decide how failures are presented.

The supplied `HttpClient` is a narrow transport interface. A production adapter might use
`fetch`, Axios, authentication headers, or shared configuration. Keeping those mechanics
behind the interface lets this API function focus on the endpoint and conversion into the
domain model.

## Supplied boundary

The exercise supplies:

- `src/api/http-client.ts`: the transport contract.
- `src/domain/access-policy.ts`: the completed domain model from the previous capability.
- `src/domain/primitives.ts`: all runtime validation.
- `src/types/access-policy-api.ts`: the compile-time wire shape.
- `src/api/access-policies/get-access-policy.test.ts`: the async harness, fake clients,
  success case, transport-rejection case, and malformed-response case.
- The complete function signature and imports for `getAccessPolicy`.

The `HttpClient` contract is:

```ts
type HttpClient = {
  readonly get: (path: string) => Promise<unknown>;
};
```

The unknown return type is intentional. A successful network response is not trusted merely
because TypeScript knows the caller wants an `AccessPolicy`; the domain constructor must
validate the runtime value.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Call a promise-returning collaborator and await its result | new target operation | Mental model, supplied signature, client, and async tests |
| Build a path from a string parameter | demonstrated | Template literals and function inputs used earlier |
| Construct `AccessPolicy` from `unknown` | retrieved and supplied | REACT-039; model is complete here |
| Understand fulfillment and rejection flow | new part of the same async operation | Supplied success and rejection tests |
| Add a request-path assertion | retrieved test design | Existing test and recorded-path harness are supplied |
| Author an async harness or fake-client utility | excluded | Fully supplied |
| Use `fetch`, parse JSON, handle status codes, or add React state | excluded | Later tasks |

Async GET sequencing is the sole unfamiliar operation. Domain decoding is deliberately
supplied so this task does not combine two implementation boundaries.

Test ownership is **starter plus learner assertion**. You add one synchronous assertion to
an already-running async test; all unfamiliar promise and fake-client infrastructure is
supplied.

## Implementation checklist

### 1. Implement the API function

In `src/api/access-policies/get-access-policy.ts`:

- Request `/access-policies/${policyId}` through the supplied client's `get` method.
- Await the result so you have the resolved unknown value.
- Construct and return an `AccessPolicy` from that value.
- Keep the supplied signature and imports.
- Do not catch errors or return the raw response.

### 2. Assert the collaborator interaction

In the first test in `get-access-policy.test.ts`, add one assertion after the request has
completed. Prove that `requestedPaths` contains exactly one entry and that entry is:

```text
/access-policies/policy-204
```

Use an equality matcher you already know. Do not inspect the function or call the fake
client directly from the assertion.

## Independent implementation boundary

Use this task document, current files, compiler/test output, and linked documentation. The
domain code is supplied for inspection, but do not edit it. If async control flow is unclear,
ask before guessing; confusion here is scope evidence, not a reason to combine more work.

## Scope

- Edit only the body of `getAccessPolicy` and add the single path assertion.
- Do not edit the client contract, domain, primitives, API type, fixture, or supplied test
  behavior.
- Do not add `fetch`, Axios, headers, status handling, JSON parsing, `try`/`catch`, React,
  hooks, caching, configuration, or new dependencies.

Your first three edits should be:

1. Replace the placeholder throw with a call to `httpClient.get` using the parameterized
   endpoint.
2. Await that call and give its resolved value to `AccessPolicy`.
3. Add the request-path assertion to the supplied success test.

The likely stuck point is passing the unresolved promise into `AccessPolicy`. The constructor
validates the response value, not the promise representing future completion; `await` must
separate those stages.

## Start and verify

Before editing, run:

```bash
npm run typecheck
npx vitest run exercises/react/040-introduce-get-domain-boundary
```

Typecheck should pass because the throwing stub satisfies the return type. All three focused
tests should fail with the placeholder error.

After both deliverables, run:

```bash
npm run typecheck
npx vitest run exercises/react/040-introduce-get-domain-boundary
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

There is no browser check or production build for this API-only task.

## Documentation

- [MDN: `async function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN: `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [MDN: using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Bulletproof React: project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- The function requests the exact policy-specific endpoint once.
- It awaits the transport result and returns an `AccessPolicy` rather than raw data.
- Transport and domain-validation failures remain rejected promises.
- Your request-path assertion is present and meaningful.
- Typecheck, focused tests, and the stable suite pass.
- Only the two permitted locations changed.
