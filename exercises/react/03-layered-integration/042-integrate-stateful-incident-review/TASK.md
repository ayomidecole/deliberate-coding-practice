# REACT-042: Integrate a Stateful Incident-Review Workflow

Status: active

Target time: 90–120 minutes

Primary capability: independently connect trusted data, a presentational event boundary,
feature-owned state, and tests at every learner-owned layer

## Goal

Build an incident-review workflow through four established layers:

```text
IncidentApiRecord[]
  expected wire contract
          ↓ new Incident(record)
Incident[]
  trusted domain objects
          ↓ props
IncidentReviewList
  renders incidents and reports a selected ID
          ↓ callback
ReviewIncidentsFeature
  stores the selected ID and renders the workflow state
```

This replaces the filter-only workflow with an event-driven state transition. The shared
component does not own selection state. It reports what happened. The feature decides what
that event means and stores the workflow state.

The app, primitive readers, fixtures, test-file scaffolds, and global jest-dom setup are
supplied. You own the type, domain, component, feature, and at least one test in every one
of those folders.

Do not open or copy implementation code from earlier React exercises. Official
documentation and test/compiler feedback are allowed. Disclose any other help.

## Supplied wire record

```json
{
  "incident_id": "inc-204",
  "summary": "Checkout latency",
  "affected_services": ["checkout-api", "payments"],
  "severity": 2
}
```

Every field is required. `affected_services` may be empty but must contain only strings.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Model a readonly snake-case wire record | transferred | REACT-040–041 |
| Author an exact compile-time type test | demonstrated | Harness pattern supplied repeatedly; scaffold supplied |
| Decode an unknown object and string array | transferred | REACT-039–041 |
| Author a domain mapping test | demonstrated | Existing domain-test pattern; fixture supplied |
| Render keyed articles and a nested list | demonstrated | Component was A4 in REACT-040–041; retrieval target here |
| Emit a record ID through a callback prop | retrieved | REACT-013–014 |
| Test a component callback with a spy | retrieved | REACT-013–014; imports supplied |
| Store a reported string with `useState` | retrieved | REACT-019 and later state tasks |
| Render two UI states conditionally | retrieved | REACT-015–025 |
| Test a user-driven state transition | retrieved | REACT-019 and REACT-026 |
| Mount the workflow in the browser | demonstrated | App and entry are supplied |

No operation is new. Test ownership increases, but the test files, fixtures, environment,
and imports are supplied. Work sequentially so only one layer and its contract are active
at a time.

## Working sequence

### 1. Type and type test

Complete `src/types/incident-api.ts`.

- Preserve the four wire names exactly.
- Make every property readonly.
- Make `affected_services` a readonly array of strings.
- Do not use `any`, optional fields, or domain-facing names.

Then replace the `it.todo` in `src/types/incident-api.test.ts` with one test using
`expectTypeOf` to prove exact equality with the supplied expected contract.

Run typecheck before continuing.

### 2. Domain and domain test

Complete the constructor in `src/domain/incident.ts`.

- Validate the whole value with `readObject` and the label `Incident`.
- Map `incident_id` to `id` with `readString`.
- Map `summary` to `summary` with `readString`.
- Map `affected_services` to `affectedServices` with `readStringArray`.
- Map `severity` to `severity` with `readNumber`.
- Use the exact wire key as each diagnostic label.

Keep the supplied invalid-severity test. Replace the `it.todo` with a valid-construction
test proving all four domain properties equal the fixture values.

Run the domain tests before continuing.

### 3. Shared component and component test

Complete `src/components/incidents/incident-review-list.tsx`.

Map every incident into an `article`. Each article must:

- use `incident.id` as its React key,
- be labelled by a unique level-three heading containing `incident.summary`,
- display `Severity: <severity>`,
- render `affectedServices` as a list labelled `<summary> affected services`, and
- render a `type="button"` button named `Review <summary>`.

Clicking a review button must call `onIncidentSelect` with that incident's `id`. The
component must not use state, decide which incident is selected, or define the feature.

In the component test, replace the `it.todo` with one test that:

- constructs both supplied domain objects,
- renders the component with a `vi.fn()` callback,
- proves both articles render,
- clicks `Review Checkout latency`, and
- proves the callback was called once with `inc-204`.

Use semantic queries and jest-dom matchers.

### 4. Feature and feature test

Complete `src/features/incidents/review-incidents-feature.tsx`.

- Destructure the supplied `incidents` prop.
- Store `selectedIncidentId` with initial value `''`.
- Define a handler that receives the next incident ID and stores it.
- Render a section labelled by a level-two heading named `Incident review queue`.
- Compose `IncidentReviewList` with the incidents and handler.
- When the stored ID is empty, render `No incident selected.`
- Otherwise render `Selected incident: <selectedIncidentId>`.

Derive the displayed sentence during render. Do not add an Effect, store a second copy of
the selected incident, filter the list, or move state into the shared component.

In the feature test, replace the `it.todo` with one test that:

- constructs both supplied domain objects,
- renders the feature,
- proves `No incident selected.` is initially in the document,
- proves `Selected incident: inc-309` is initially absent,
- clicks `Review Identity outage`, and
- proves the initial sentence is absent and `Selected incident: inc-309` is present.

## Scope

Edit only:

- `src/types/incident-api.ts`
- the todo in `src/types/incident-api.test.ts`
- `src/domain/incident.ts`
- the todo in `src/domain/incident.test.ts`
- `src/components/incidents/incident-review-list.tsx`
- the todo in its colocated test
- `src/features/incidents/review-incidents-feature.tsx`
- the todo in its colocated test

Do not edit app composition, primitive readers, supplied fixtures/tests, browser entry,
HTML, global test setup, or package files. Do not add API requests, promises, Effects,
hooks beyond `useState`, pages, routing, context, stores, helpers, dependencies, casts,
assertions, defaults, or barrel files.

## Five-minute start gate

Your first three meaningful edits should be:

1. Replace the wire-type placeholder from the supplied JSON.
2. Replace the type-test todo with the exact contract assertion.
3. Replace the domain constructor placeholder with four validated mappings.

The likely stuck point comes later: the component does not change the selected state. Its
button calls the callback with an ID; the feature's handler receives that ID and updates
state. Trace that one value through the arrow diagram rather than combining the two roles.

## Verification

Run after each layer:

```bash
npm run typecheck
npx vitest run exercises/react/03-layered-integration/042-integrate-stateful-incident-review/src/types
npx vitest run exercises/react/03-layered-integration/042-integrate-stateful-incident-review/src/domain
npx vitest run exercises/react/03-layered-integration/042-integrate-stateful-incident-review/src/components
npx vitest run exercises/react/03-layered-integration/042-integrate-stateful-incident-review/src/features
```

Then verify the complete slice:

```bash
npm run typecheck
npx vitest run exercises/react/03-layered-integration/042-integrate-stateful-incident-review
npx vite build exercises/react/03-layered-integration/042-integrate-stateful-incident-review
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

For the browser:

```bash
npx vite exercises/react/03-layered-integration/042-integrate-stateful-incident-review --host 127.0.0.1d

Confirm that both incidents render, no incident starts selected, and clicking either review
button displays its stable ID.

## Official documentation

- [TypeScript object types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [React: Sharing state between components](https://react.dev/learn/sharing-state-between-components)
- [React: Responding to events](https://react.dev/learn/responding-to-events)
- [React: Rendering lists](https://react.dev/learn/rendering-lists)
- [React: Choosing state structure](https://react.dev/learn/choosing-the-state-structure)
- [Testing Library: `ByRole`](https://testing-library.com/docs/queries/byrole/)
- [jest-dom matchers](https://github.com/testing-library/jest-dom)

## Done when

- The wire, domain, component, and feature preserve one incident identity.
- The component reports an event; the feature owns the resulting state transition.
- You authored at least one passing test in every learner-owned folder.
- Typecheck, focused tests, production build, stable suite, and browser verification pass.
- Only the permitted target files changed.

System-design lesson: component callbacks are boundary messages. A shared component reports
what the user did using stable domain identity; the feature interprets that message and owns
the workflow state. This preserves reuse without pushing application behavior into shared UI.
