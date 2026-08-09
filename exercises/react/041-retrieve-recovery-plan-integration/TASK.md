# REACT-041: Retrieve a Complete Recovery-Plan Workflow

Status: active

Target time: 60–80 minutes

Primary capability: independently rebuild one trusted data flow across established layers

## Goal

Build a service-recovery workflow through the same production-shaped boundaries practiced
in REACT-040:

1. describe the expected API record in `types`,
2. validate it into a trusted `domain` object,
3. render domain objects with a shared `component`,
4. select and compose those objects in a `feature`, and
5. author one integrated feature behavior test.

This is a retrieval task, not a new architecture lesson. The app, browser entry, primitive
readers, fixtures, and test infrastructure are supplied. You own all five target layers,
including the component that was supplied in the previous exercise.

Do not open or copy implementation code from REACT-040 while completing this task. Use the
mental model, requirements, official documentation, and compiler/test feedback.

## Mental model

```text
RecoveryPlanApiRecord[]
  expected snake_case wire data
             ↓ new RecoveryPlan(record)
RecoveryPlan[]
  validated, readonly application data
             ↓ feature applies the review rule
urgent RecoveryPlan[]
             ↓ shared component renders trusted fields
browser output
```

Each layer owns a different decision. The type documents the server contract. The domain
constructor proves runtime values. The feature decides which plans belong in this workflow.
The component decides how trusted plans are presented. The behavior test proves the whole
path from wire-shaped fixtures to user-visible output.

## Supplied wire record

```json
{
  "plan_id": "plan-checkout",
  "service_name": "Checkout API",
  "dependencies": ["payments", "inventory"],
  "owner_teams": ["commerce-platform", "payments"],
  "recovery_target_minutes": 15
}
```

Every field is required. Both collections may be empty, but they must be arrays containing
only strings.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Model a readonly snake-case wire record | transferred | Independently completed in REACT-040 |
| Validate an unknown object into readonly domain fields | transferred | Independently completed in REACT-040 |
| Decode two string arrays | transferred | Independently completed in REACT-039–040 |
| Translate wire names into application names | transferred | Independently completed in REACT-040 |
| Render keyed articles and nested string lists | demonstrated | Prior solution was supplied A4; this task retrieves it |
| Derive a collection with `filter` and a numeric comparison | transferred | Independently completed in REACT-029 and REACT-040 |
| Compose a shared component inside a feature | transferred | Independently completed in REACT-040 |
| Assert included, excluded, and nested visible output | transferred | Independently completed in REACT-040 |
| Mount the workflow in an app | demonstrated | Fully supplied; not a learner target |

No operation is new. Test ownership remains starter-plus-one-case so independent component
retrieval is the only meaningful scaffolding reduction.

## Implementation checklist

### 1. Model the wire contract

Replace `unknown` in `src/types/recovery-plan-api.ts` with the complete
`RecoveryPlanApiRecord` object type.

- Preserve the five snake_case wire names exactly.
- Make every property readonly.
- Make both string collections readonly.
- Do not use `any`, optional properties, or domain-facing names.

### 2. Build the trusted domain object

Complete the constructor in `src/domain/recovery-plan.ts`.

- Validate the container with `readObject` and the label `RecoveryPlan`.
- Map `plan_id` to `id`.
- Map `service_name` to `serviceName`.
- Map `dependencies` to `dependencies`.
- Map `owner_teams` to `ownerTeams`.
- Map `recovery_target_minutes` to `recoveryTargetMinutes`.
- Use the exact wire key as every field reader's diagnostic label.

Keep the supplied properties and reader imports.

### 3. Render trusted plans

Complete `src/components/recovery-plans/recovery-plan-results.tsx`.

Map `plans` into `article` elements. Each article must:

- use `plan.id` as its React key,
- use `aria-labelledby` with a unique id and a level-three heading containing
  `plan.serviceName`,
- display `Recovery target: <recoveryTargetMinutes> minutes`,
- render `plan.dependencies` as a list labelled `<service name> dependencies`, and
- render `plan.ownerTeams` as a list labelled `<service name> owner teams`.

Use each string as the key for its own list item. Do not put workflow filtering in this
component.

### 4. Implement the urgent-review feature

Complete `src/features/recovery-plans/review-urgent-recovery-plans-feature.tsx`.

- Derive `urgentPlans` with `filter`.
- Keep plans whose `recoveryTargetMinutes` is less than or equal to the supplied
  `maximumRecoveryMinutes` prop.
- Render a section labelled by a level-two heading named
  `Recovery plans requiring urgent review`.
- Compose `RecoveryPlanResults` with `urgentPlans`.

The boundary value is included:

| Recovery target | Maximum | Keep? |
|---:|---:|---|
| 15 | 30 | yes |
| 30 | 30 | yes |
| 90 | 30 | no |

Do not store `urgentPlans` in state or define a component inside the feature.

### 5. Author one integrated behavior test

Keep the supplied heading case in
`src/features/recovery-plans/review-urgent-recovery-plans-feature.test.tsx` and add one
`it` case. After calling the supplied `renderFeature`, prove that:

- exactly two articles render,
- `Checkout API` and `Identity provider` are visible level-three headings,
- `Analytics reporting` is absent as a level-three heading,
- `payments` is visible, and
- `security` is visible.

Name the test after the user-visible urgency rule. Use `getBy...` for required content and
`queryBy...` for absent content.

## Scope

Edit only these five files:

- `src/types/recovery-plan-api.ts`
- `src/domain/recovery-plan.ts`
- `src/components/recovery-plans/recovery-plan-results.tsx`
- `src/features/recovery-plans/review-urgent-recovery-plans-feature.tsx`
- one new case in the supplied feature test

Do not edit primitive readers, supplied fixtures, type/domain tests, app, browser entry, or
HTML. Do not add requests, promises, state, events, Effects, hooks, pages, routing, context,
stores, helpers, dependencies, casts, assertions, defaults, or barrel files.

## Five-minute start gate

Your first three edits should be identifiable immediately:

1. Translate the supplied JSON record into the readonly wire type.
2. Trace the same five wire keys through the domain constructor.
3. Replace the component's `null` with keyed articles, then add the two nested lists.

The likely stuck point is carrying the previous feature's `>=` rule into this workflow.
Use the table above: shorter recovery targets are more urgent, and exactly 30 is included.

## Verify in stages

```bash
npm run typecheck
npx vitest run exercises/react/041-retrieve-recovery-plan-integration/src/domain
npx vitest run exercises/react/041-retrieve-recovery-plan-integration/src/features
```

When the learner-owned behavior case passes, run:

```bash
npm run typecheck
npx vitest run exercises/react/041-retrieve-recovery-plan-integration
npx vite build exercises/react/041-retrieve-recovery-plan-integration
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

For the browser:

```bash
npx vite exercises/react/041-retrieve-recovery-plan-integration --host 127.0.0.1
```

Confirm that only Checkout API and Identity provider render, including their trusted
domain properties.

## Official documentation

- [TypeScript object types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [React: Thinking in React](https://react.dev/learn/thinking-in-react)
- [React: Rendering lists](https://react.dev/learn/rendering-lists)
- [React: Passing props](https://react.dev/learn/passing-props-to-a-component)
- [MDN: `Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [Testing Library: `ByRole`](https://testing-library.com/docs/queries/byrole/)
- [Bulletproof React: project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- The wire, domain, feature, component, and test preserve one coherent contract.
- Snake_case data stops at domain construction.
- The supplied type/domain checks and both feature cases pass.
- Typecheck, focused tests, production build, stable suite, and browser verification pass.
- Only the five permitted target locations changed.

System-design lesson: a vertical slice is reliable when every boundary narrows its own
responsibility while preserving the same business meaning. Rebuilding the slice in a new
domain proves the architecture is a usable decision model rather than a memorized folder
diagram.
