# REACT-043: Integrate Service-Alert Acknowledgement

Status: complete

Target time: 80–110 minutes

Primary capability: retrieve a complete layered workflow through a controlled component
and a reversible feature-owned state transition

## Goal

Build an acknowledgement workflow for an on-call engineer reviewing one production
service alert. The engineer needs to see the affected service and severity, acknowledge
that the alert is being handled, and reopen it if follow-up work remains.

The workflow crosses four established layers:

```text
ServiceAlertApiRecord
  describes the expected external record
          ↓ new ServiceAlert(record)
ServiceAlert
  validates and translates trusted domain data
          ↓ alert + acknowledged props
AlertAcknowledgementPanel
  renders one alert and reports the requested next boolean value
          ↓ onAcknowledgementChange(nextAcknowledged)
ReviewServiceAlertFeature
  owns acknowledgement state and rerenders the controlled panel
```

This is another full integration exercise, not a new architecture lesson. Unlike the
previous workflows, it renders one detail panel rather than a collection. The app,
primitive readers, browser entry, fixtures, test harnesses, and global jest-dom setup are
supplied. You own the type, domain constructor, component, feature, and at least one test
in each of those four folders.

Do not open or copy implementation code from earlier React exercises. Official
documentation and compiler/test feedback are allowed. Disclose any other help.

## Supplied wire record

```json
{
  "alert_id": "alert-502",
  "title": "Payment timeout spike",
  "service_name": "payments-api",
  "severity": 1
}
```

Every field is required.

## Controlled-component mental model

`AlertAcknowledgementPanel` does not store acknowledgement state. It receives the current
value and reports the value requested by the user's click:

```text
feature state false
  → panel renders Status: Needs acknowledgement
  → user clicks Acknowledge alert
  → panel reports true
  → feature stores true
  → React rerenders the panel with true

feature state true
  → panel renders Status: Acknowledged
  → user clicks Reopen alert
  → panel reports false
  → feature stores false
  → React rerenders the panel with false
```

The callback does not mutate the prop. It sends a message upward. The feature's state
update creates the next render.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Model one readonly snake-case wire record | transferred | REACT-030–032 and REACT-040–042 |
| Author its exact compile-time type assertion | demonstrated | REACT-032 and REACT-040–042; scaffold supplied |
| Decode an unknown object and scalar fields | transferred | REACT-033–037 and REACT-040–042 |
| Author a valid domain-mapping test | demonstrated | REACT-033–042; fixture supplied |
| Render one accessible labelled article | demonstrated | REACT-042 used the same accessibility relationship |
| Render text and one button conditionally | retrieved | REACT-005–006 and REACT-015–025 |
| Report a boolean through a callback prop | guided retrieval | REACT-028; value trace supplied above |
| Test a component callback with `vi.fn()` | retrieved | REACT-011–014 and REACT-042 |
| Store a boolean in feature-owned state | retrieved | REACT-026 and REACT-028 |
| Test two user-driven state transitions | retrieved | REACT-024–026 |
| Mount and verify the workflow in a browser | demonstrated | REACT-021 onward; app and entry supplied |

No operation is new. The UI shape changes from a collection to one controlled detail
panel, while the architectural boundaries and test tools remain established.

## Working sequence

### 1. Type and type test

Complete `src/types/service-alert-api.ts`.

- Preserve the four wire names exactly.
- Make every property readonly.
- Use `string` for the first three values and `number` for `severity`.
- Do not use `any`, optional fields, domain-facing names, or a response envelope.

Then replace the todo in `src/types/service-alert-api.test.ts` with one test using
`expectTypeOf` to prove exact equality with the supplied expected record.

Run typecheck and the type test before continuing.

### 2. Domain and domain test

Complete the constructor in `src/domain/service-alert.ts`.

- Validate the whole value with `readObject` and the label `ServiceAlert`.
- Map `alert_id` to `id` with `readString`.
- Map `title` to `title` with `readString`.
- Map `service_name` to `serviceName` with `readString`.
- Map `severity` to `severity` with `readNumber`.
- Use the exact wire key as each diagnostic label.

Keep the supplied invalid-severity case. Replace the todo with a valid-construction test
proving all four domain properties equal the fixture values.

### 3. Shared component and component test

Complete `src/components/alerts/alert-acknowledgement-panel.tsx`.

Render one `article` labelled by a unique level-three heading containing the alert title.
Inside it, render:

- `Service: <serviceName>`
- `Severity: <severity>`
- `Status: Needs acknowledgement` when `acknowledged` is false
- `Status: Acknowledged` when `acknowledged` is true
- a `type="button"` button named `Acknowledge alert` when false
- a `type="button"` button named `Reopen alert` when true

Clicking the button reports the opposite of the current `acknowledged` prop through
`onAcknowledgementChange`. The component must not use state, define the feature, or modify
the domain object.

In the component test, replace the todo with one test that:

- constructs the supplied domain object,
- renders the panel with `acknowledged={false}` and a `vi.fn()` callback,
- proves the article named `Payment timeout spike` and the initial status are present,
- clicks `Acknowledge alert`, and
- proves the callback was called once with `true`.

Use semantic queries and jest-dom matchers.

### 4. Feature and feature test

Complete `src/features/alerts/review-service-alert-feature.tsx`.

- Destructure the supplied `alert` prop.
- Store one boolean acknowledgement value with initial value `false`.
- Define a handler that receives and stores the next boolean value.
- Render a section labelled by a level-two heading named `Review service alert`.
- Compose `AlertAcknowledgementPanel` with the alert, current value, and handler.

Do not duplicate the status in feature state. Do not add an Effect, keep separate
`acknowledged` and `reopened` booleans, or move state into the shared component.

In the feature test, replace the todo with one test that:

1. constructs the supplied domain object and renders the feature,
2. proves the initial status and `Acknowledge alert` button are present,
3. proves the acknowledged status is initially absent,
4. clicks `Acknowledge alert`,
5. proves the acknowledged status and `Reopen alert` button are present,
6. clicks `Reopen alert`, and
7. proves the initial status and button have returned.

Use `getBy...` for required visible content and `queryBy...` when proving content is absent.

## Scope

Edit only:

- `src/types/service-alert-api.ts`
- the todo in its colocated test
- `src/domain/service-alert.ts`
- the todo in its colocated test
- `src/components/alerts/alert-acknowledgement-panel.tsx`
- the todo in its colocated test
- `src/features/alerts/review-service-alert-feature.tsx`
- the todo in its colocated test

Do not edit app composition, primitive readers, supplied fixtures/tests, browser entry,
HTML, global test setup, or package files. Do not add arrays, `map`, `filter`, API requests,
promises, Effects, pages, routing, context, stores, dependencies, assertions, casts,
defaults, helpers, or barrel files.

## Five-minute start gate

Your first three meaningful edits should be:

1. Replace the wire-type placeholder from the supplied JSON.
2. Replace the type-test todo with the exact contract assertion.
3. Replace the domain constructor placeholder with four validated mappings.

The likely stuck point comes later: the button does not change the prop directly. It
reports the opposite value; the feature stores that value; the new prop arrives on the
next render. Trace the boolean through the mental-model diagram if the UI does not change.

## Verification

Run after each layer:

```bash
npm run typecheck
npx vitest run exercises/react/03-layered-integration/043-integrate-alert-acknowledgement/src/types
npx vitest run exercises/react/03-layered-integration/043-integrate-alert-acknowledgement/src/domain
npx vitest run exercises/react/03-layered-integration/043-integrate-alert-acknowledgement/src/components
npx vitest run exercises/react/03-layered-integration/043-integrate-alert-acknowledgement/src/features
```

Then verify the complete slice:

```bash
npm run typecheck
npx vitest run exercises/react/03-layered-integration/043-integrate-alert-acknowledgement
npx vite build exercises/react/03-layered-integration/043-integrate-alert-acknowledgement
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

For the browser:

```bash
npx vite exercises/react/03-layered-integration/043-integrate-alert-acknowledgement --host 127.0.0.1
```

Confirm that the alert begins unacknowledged, acknowledgement changes the visible status
and action, and reopening restores the initial state.

## Official documentation

- [TypeScript object types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [React: Sharing state between components](https://react.dev/learn/sharing-state-between-components)
- [React: Responding to events](https://react.dev/learn/responding-to-events)
- [React: Conditional rendering](https://react.dev/learn/conditional-rendering)
- [Testing Library: `ByRole`](https://testing-library.com/docs/queries/byrole/)
- [jest-dom matchers](https://github.com/testing-library/jest-dom)

## Done when

- The wire type, domain object, controlled component, and feature preserve one alert.
- The component reports requested state; the feature remains the single source of truth.
- Both acknowledgement transitions work without storing duplicate state.
- You authored at least one passing test in every learner-owned folder.
- Typecheck, focused tests, production build, stable suite, and browser verification pass.
- Only the permitted target files changed.

System-design lesson: a controlled component receives both its current value and the
callback used to request the next value. Keeping the feature as the single state owner
prevents the shared UI and its consumer from drifting into contradictory workflow states.
