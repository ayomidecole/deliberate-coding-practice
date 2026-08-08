# REACT-040: Integrate Types, Domain, Feature, and Component

Status: active

Target time: 55–75 minutes

Primary capability: build one trusted data flow across established repository layers

## Goal

Build a release-gate workflow from its wire-format contract through browser-visible React
output. This is the first integration task after practicing each responsibility separately.

You have five deliverables:

1. Model the API record in `types`.
2. Decode it into a trusted domain class.
3. Render domain objects in a shared component.
4. Filter and compose that component in a feature.
5. Author one integrated feature behavior test.

`app.tsx`, `main.tsx`, primitive readers, and the type/domain test harnesses are complete
and supplied. Do not edit them.

## Mental model

The same information changes names and trust level as it crosses the application:

```text
ReleaseGateApiRecord[]
  snake_case, expected wire shape
          ↓ new ReleaseGate(record)
ReleaseGate[]
  validated, readonly, application-facing names
          ↓ feature filters by its workflow rule
eligible ReleaseGate[]
          ↓ shared component renders trusted properties
browser output
```

`types` documents what the server is expected to send. The domain constructor accepts
`unknown` because runtime input still requires proof. Components receive only trusted
domain objects. The feature owns which of those objects belong in this workflow. The
supplied app only provides data and places the completed feature.

## Supplied wire record

One release gate looks like this:

```json
{
  "gate_id": "gate-204",
  "gate_name": "Production deployment",
  "environments": ["staging", "production"],
  "required_teams": ["release-engineering", "security"],
  "minimum_approvals": 3
}
```

Every field is required. Both collections may be empty but must always be present.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Model a readonly snake-case wire record | known | Retrieved independently in REACT-032 |
| Declare and construct a readonly domain class | known | Retrieved in REACT-035–039 |
| Validate strings, a number, and string arrays | known | Retrieved independently in REACT-039; readers supplied |
| Translate wire names into domain names | known | Retrieved throughout the domain arc |
| Render keyed domain records and nested collections | known | Keyed list rendering is retrieved |
| Derive a subset with `filter` and a comparison | known | Retrieved independently in REACT-029 |
| Compose a shared component inside a feature | known | Retrieved in prior feature tasks |
| Author visible and absent behavior assertions | known | Retrieved in REACT-029 |
| Mount the feature in the app and browser | demonstrated | Fully supplied from REACT-020–021 |
| Preserve one contract across all layers | new | Sole target capability |

Type and domain test ownership is **fully supplied**. Feature test ownership is **starter
plus learner case**: add one familiar behavior case after the implementation works.

## Implementation checklist

### 1. Model the wire type

Replace `unknown` in `src/types/release-gate-api.ts` with `ReleaseGateApiRecord`'s complete
object shape.

- Keep every wire name exact.
- Make every property readonly.
- Make both string collections readonly.
- Do not use `any`, optional properties, or domain-facing camelCase names.

### 2. Complete the domain constructor

In `src/domain/release-gate.ts`, replace the placeholder constructor body.

- Validate the whole input with `readObject` and the label `ReleaseGate`.
- Map `gate_id` to `id` with `readString`.
- Map `gate_name` to `name` with `readString`.
- Map `environments` to `environments` with `readStringArray`.
- Map `required_teams` to `requiredTeams` with `readStringArray`.
- Map `minimum_approvals` to `minimumApprovals` with `readNumber`.
- Give every field reader its exact wire key as the diagnostic label.

Keep the supplied readonly properties and reader imports.

### 3. Render trusted gates

Complete `src/components/release-gates/release-gate-results.tsx`.

Map `gates` into `article` elements. Each article must:

- use `gate.id` as its React key,
- use `aria-labelledby` with a level-three heading containing `gate.name`,
- display `Minimum approvals: <minimumApprovals>`,
- render `gate.environments` as a list labelled `<gate name> environments`, and
- render `gate.requiredTeams` as a list labelled `<gate name> required teams`.

Use each string as the key for its own list item.

### 4. Implement the feature workflow

Complete `src/features/release-gates/review-release-gates-feature.tsx`.

- Derive `reviewGates` with `filter`.
- Keep gates whose `minimumApprovals` is greater than or equal to the supplied
  `minimumApprovals` prop.
- Render a section labelled by a level-two heading named
  `Release gates requiring review`.
- Compose `ReleaseGateResults` with `reviewGates`.

Do not store the derived collection in state or define a component inside the feature.

### 5. Add one integrated behavior test

Keep the supplied heading case in
`src/features/release-gates/review-release-gates-feature.test.tsx` and add one `it` case.

After calling the supplied `renderFeature`, prove that:

- exactly two articles render,
- `Production deployment` and `Emergency production access` are visible level-three
  headings,
- `Sandbox deployment` is absent as a level-three heading,
- `release-engineering` is visible, and
- `incident-command` is visible.

Name the case after the user-visible review rule. Use `getBy...` for required content and
`queryBy...` for absent content.

## Scope

Edit only these five locations:

- `src/types/release-gate-api.ts`
- `src/domain/release-gate.ts`
- `src/components/release-gates/release-gate-results.tsx`
- `src/features/release-gates/review-release-gates-feature.tsx`
- one new case in the supplied feature test

Do not edit primitive readers, supplied fixtures, type/domain tests, app, browser entry, or
HTML. Do not add API requests, promises, state, events, Effects, hooks, pages, routing,
context, stores, helpers, dependencies, casts, assertions, defaults, or barrel files.

Use this task, current files, compiler/test output, and official documentation. Do not copy
implementation code from REACT-039. Disclose any help you use.

Your first three edits should be:

1. Replace the wire-type placeholder from the supplied JSON.
2. Replace the domain constructor placeholder with container validation and five mappings.
3. Replace the shared component's `null` with keyed articles and nested collections.

Then implement the feature and its test. The likely stuck point is confusing the three
names involved in a mapping: the wire key, the domain property, and the diagnostic label.
Trace each field through the diagram instead of moving raw records into React.

## Verify in stages

Start with:

```bash
npm run typecheck
```

The supplied type assertion should reject the `unknown` placeholder. After fixing the
type, implement the domain and run:

```bash
npx vitest run exercises/react/040-integrate-release-gate-workflow/src/domain
```

All three domain cases should pass before you work on React. Then implement the component
and feature and run:

```bash
npx vitest run exercises/react/040-integrate-release-gate-workflow/src/features
```

When your behavior case passes, verify the complete exercise:

```bash
npm run typecheck
npx vitest run exercises/react/040-integrate-release-gate-workflow
npx vite build exercises/react/040-integrate-release-gate-workflow
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

For the browser check:

```bash
npx vite exercises/react/040-integrate-release-gate-workflow --host 127.0.0.1
```

Confirm that only the production and emergency gates appear with their trusted domain
properties.

## Documentation

- [TypeScript object types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [React: Thinking in React](https://react.dev/learn/thinking-in-react)
- [React: Rendering lists](https://react.dev/learn/rendering-lists)
- [React: Passing props](https://react.dev/learn/passing-props-to-a-component)
- [MDN: `Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [Testing Library: `ByRole`](https://testing-library.com/docs/queries/byrole/)
- [Bulletproof React: project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- The wire type, domain model, feature rule, and component rendering agree on one contract.
- Raw snake-case fields stop at domain construction.
- The supplied type/domain checks and both feature behavior cases pass.
- Typecheck, focused tests, production build, stable suite, and browser verification pass.
- Only the five permitted target locations changed.

System-design lesson: integration is not collapsing layers together. It is preserving a
clear contract while each layer transforms or consumes only what it owns. That lets the
eventual API source change without leaking wire names into feature logic or UI components.
