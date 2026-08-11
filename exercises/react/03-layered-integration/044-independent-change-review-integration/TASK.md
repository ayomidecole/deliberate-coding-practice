# REACT-044: Independently Integrate Change Review

Status: complete

Target time: 100–140 minutes

Primary capability: independently reconstruct a complete layered React workflow using
established data, UI, state, and testing boundaries

## Goal

Build a change-review workflow for a platform engineer assessing a production change.
The engineer needs to see the requested change, write a reviewer note, and clear that note
when it is no longer useful.

The production-shaped path is:

```text
ChangeRequestApiRecord
  describes the external wire record
          ↓ new ChangeRequest(record)
ChangeRequest
  validates and translates trusted domain data
          ↓ request + controlled-note props
ChangeReviewPanel
  renders the change and reports input/clear events
          ↓ callbacks
ReviewChangeRequestFeature
  owns the note, handlers, and clear-button decision
```

This is the independent checkpoint for the layered-integration arc. You own the type,
domain constructor, shared component, feature, and one test in each of those four folders.
The app, primitive readers, browser entry, test environment, and starting test shells are
supplied.

Use official documentation, TypeScript errors, test output, and browser behavior. Do not
open or copy implementation code from earlier exercises. Disclose any additional help.

## Supplied wire record

```json
{
  "change_id": "change-204",
  "summary": "Rotate checkout signing key",
  "service_name": "checkout-api",
  "risk_score": 3
}
```

Every field is required.

## Ownership model

- `types` preserves the external snake-case contract.
- `domain` validates `unknown` input and exposes trusted camel-case values.
- `components` owns reusable markup and reports events through props; it owns no state.
- `features` owns the review-note state, event handlers, derived disabled value, and
  component composition.

The input remains controlled: the component displays the `reviewNote` prop, the feature
stores the new event value, and the next render sends the updated prop back down. Clearing
uses the same loop by storing an empty string.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Model a readonly snake-case wire record | known | Transferred in REACT-040–043 |
| Author an exact compile-time contract test | known | Demonstrated in REACT-032 and REACT-040–043 |
| Decode an unknown object and four scalar fields | known | Transferred through the domain arc and REACT-040–043 |
| Test valid and invalid domain construction | known | Repeated domain evidence |
| Render one accessible labelled article | known | Demonstrated in REACT-042–043 |
| Render a controlled text input | known | Retrieved in REACT-023–025 |
| Report input and button events through props | known | Retrieved in REACT-011–014 and REACT-023–025 |
| Own string state and handlers in a feature | known | Retrieved in REACT-023–025 |
| Derive and pass a disabled boolean | known | Retrieved in REACT-024–025 |
| Test input, callback, enabled, and disabled behavior | known | Authored in the fundamentals and integration arcs |
| Mount, build, and verify the workflow | known | Demonstrated from REACT-021 onward |

There are no new operations. The challenge is reconstructing their boundaries without an
earlier implementation beside you.

## 1. Type and type test

Replace the placeholder in `src/types/change-request-api.ts` with the exact readonly wire
contract. Preserve all four snake-case names. The first three values are strings and
`risk_score` is a number.

Replace the todo in its colocated test with one `expectTypeOf` assertion proving exact
equality with `ExpectedChangeRequestApiRecord`.

## 2. Domain and domain test

Complete `ChangeRequest` in `src/domain/change-request.ts`.

- Accept `unknown` in the constructor.
- Validate the whole value with `readObject` and the label `ChangeRequest`.
- Expose readonly `id`, `summary`, `serviceName`, and `riskScore` properties.
- Translate the four wire fields with the matching scalar readers.
- Use the exact wire key as each diagnostic label.

Keep the supplied invalid-risk test. Replace the todo with a valid-construction test that
proves all four domain properties contain the supplied values.

## 3. Shared component and component test

Complete `ChangeReviewPanel` in
`src/components/changes/change-review-panel.tsx`. Its prop contract is supplied.

Render one `article` labelled by a unique level-three heading containing the change
summary. Inside it, render:

- `Service: <serviceName>`
- `Risk score: <riskScore>`
- a text input visibly labelled `Reviewer note`
- a `type="button"` button named `Clear note`

The input receives `reviewNote` as its value and `onReviewNoteChange` as its change
handler. The button receives `clearDisabled` as its disabled value and calls
`onClearReviewNote` when clicked. The component must not use state, inspect the event,
derive the disabled value, or define the feature.

Replace the component-test todo with one test that constructs the supplied domain object,
renders the panel with a non-empty note and two `vi.fn()` callbacks, and proves:

- the article named `Rotate checkout signing key` is present,
- the input contains the supplied note,
- `Clear note` is enabled,
- changing the input calls the change callback once, and
- clicking `Clear note` calls the clear callback once.

## 4. Feature and feature test

Complete `ReviewChangeRequestFeature` in
`src/features/changes/review-change-request-feature.tsx`.

- Destructure the supplied `request` prop.
- Store one review-note string with an initial value of `''`.
- Define a typed input-change handler that stores `event.currentTarget.value`.
- Define a clear handler that stores `''`.
- Derive whether clearing is disabled from whether the note is empty.
- Render a section labelled by a level-two heading named `Review change request`.
- Compose `ChangeReviewPanel` with the request, current note, derived boolean, and both
  handlers.

Do not add state to the shared component, duplicate the disabled value in state, mutate
the domain object, or add an Effect.

Replace the feature-test todo with one test that:

1. constructs the supplied domain object and renders the feature,
2. proves the reviewer-note input starts empty and `Clear note` is disabled,
3. changes the input to `Canary checks passed.`,
4. proves the input contains that value and `Clear note` is enabled,
5. clicks `Clear note`, and
6. proves the input is empty and the button is disabled again.

Use semantic queries and jest-dom matchers.

## Scope

Edit only:

- `src/types/change-request-api.ts`
- the todo in its colocated test
- `src/domain/change-request.ts`
- the todo in its colocated test
- `src/components/changes/change-review-panel.tsx`
- the todo in its colocated test
- `src/features/changes/review-change-request-feature.tsx`
- the todo in its colocated test

Do not edit app composition, primitive readers, browser entry, HTML, global test setup, or
package files. Do not add arrays, collection methods, API requests, promises, Effects,
pages, routing, context, stores, dependencies, casts, assertions, defaults, helpers, or
barrel files.

## Five-minute start gate

Your first three meaningful edits should be:

1. Replace the placeholder wire type using the supplied JSON.
2. Replace the type-test todo with the exact contract assertion.
3. Replace the domain placeholders with validated wire-to-domain mappings.

The likely stuck point is the input boundary: the shared component attaches the supplied
handler, while the feature defines that handler and reads the event value. If state or
event logic starts moving into the component, return to the ownership model above.

## Verification

Run after each layer:

```bash
npm run typecheck
npx vitest run exercises/react/03-layered-integration/044-independent-change-review-integration/src/types
npx vitest run exercises/react/03-layered-integration/044-independent-change-review-integration/src/domain
npx vitest run exercises/react/03-layered-integration/044-independent-change-review-integration/src/components
npx vitest run exercises/react/03-layered-integration/044-independent-change-review-integration/src/features
```

Then verify the complete slice:

```bash
npm run typecheck
npx vitest run exercises/react/03-layered-integration/044-independent-change-review-integration
npx vite build exercises/react/03-layered-integration/044-independent-change-review-integration
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

For the browser:

```bash
npx vite exercises/react/03-layered-integration/044-independent-change-review-integration --host 127.0.0.1
```

Confirm the note begins empty with clearing disabled, becomes editable with clearing
enabled, and returns to empty after clearing.

## Official documentation

- [React: responding to events](https://react.dev/learn/responding-to-events)
- [React: sharing state between components](https://react.dev/learn/sharing-state-between-components)
- [React: `useState`](https://react.dev/reference/react/useState)
- [Testing Library: `ByRole`](https://testing-library.com/docs/queries/byrole/)
- [jest-dom matchers](https://github.com/testing-library/jest-dom#custom-matchers)

## Completion

When finished, report whether you used earlier exercise implementations, official
documentation, compiler/test feedback, or AI help. Completion requires the focused tests,
typecheck, production build, stable suite, and browser transition to pass.
