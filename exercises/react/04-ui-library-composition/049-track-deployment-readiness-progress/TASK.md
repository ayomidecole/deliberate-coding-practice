# REACT-049: Track Deployment Readiness with shadcn Progress

Status: active

Target time: 60–75 minutes

Primary capability: connect a supplied shadcn Progress to feature-owned numeric state and
a bounded workflow transition

## Goal

Build one part of a release-readiness console. A release engineer needs to see how many
verification checks have passed and mark the next check complete without advancing beyond
the checklist total.

This introduces the feedback family through Progress. The API contract, domain decoder,
app, generated shadcn Progress and Button source, styling, configuration, and unfamiliar
UI infrastructure test are supplied. You own the business component, feature, and their
tests. You will also add one familiar test in both `types` and `domain` so every
architectural folder keeps participating in the verification story.

## Mental model

Progress presents workflow state; it does not own or advance that state:

```text
DeploymentChecklistApiRecord
              ↓ supplied validation
readonly DeploymentChecklist
              ↓ initializes once
TrackDeploymentReadinessFeature state       ← current completed-check count
       ↓ current count              ↑ next bounded count
DeploymentReadinessSummary        shadcn Button
       ↓ derives percentage
components/ui/Progress                      ← presentation primitive
```

The domain object is the trusted snapshot received when the screen starts. The feature
stores the current browser workflow value and updates it without mutating that snapshot.
The summary converts the current count into Progress's 0–100 `value`:

```ts
const examplePercentage = Math.round((finishedItems / totalItems) * 100);
```

Progress exposes `role="progressbar"` and its current value to assistive technology. Give
it a useful accessible label because the visual bar alone does not explain what is
progressing:

```tsx
<Progress aria-label="Example task progress" value={examplePercentage} />
```

The Button is familiar. The feature's transition must use the current state and preserve
the upper bound:

```ts
setCurrentCount((current) => Math.min(current + 1, maximumCount));
```

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Read a supplied API contract and readonly domain object | integrated | REACT-040–048 |
| Add one type-contract test and one domain test | retrieved | Data-boundary and integration arcs |
| Initialize numeric feature state from the domain | integrated | Fundamentals and REACT-046 |
| Perform a bounded functional state update | retrieved | Earlier state-transition work |
| Derive a percentage from current and total counts | known | Established JS/TS arithmetic and render derivation |
| Compose the supplied shadcn Button | retrieved | REACT-045–046 |
| Consume supplied shadcn Progress with `value` and a label | new | Mental model, generic examples, generated source, infrastructure test, and official docs supplied |
| Author component and feature behavior tests | transferred | REACT-044–048 |

There is one unfamiliar operation. There is no array traversal, selection, form protocol,
API request, effect, timer, overlay, custom animation, or test-harness setup.

## Your six files

Edit only:

- `src/types/deployment-checklist-api.test.ts`
- `src/domain/deployment-checklist.test.ts`
- `src/components/deployments/deployment-readiness-summary.tsx`
- its colocated test
- `src/features/deployments/track-deployment-readiness-feature.tsx`
- its colocated test

Do not edit the supplied implementations, app, styles, `components/ui`, configuration, or
infrastructure test.

### 1. API-contract test

Replace the todo in `deployment-checklist-api.test.ts` with one type-level test proving
that `DeploymentChecklistApiRecord` exactly matches the supplied expected wire shape.
Use `expectTypeOf` as you did in the data-boundary and integration arcs.

### 2. Domain test

Replace the todo in `deployment-checklist.test.ts` with one test that constructs the
supplied fixture and proves all four domain properties were translated correctly. Leave
the supplied invalid-progress test unchanged.

### 3. Business component

Complete `DeploymentReadinessSummary`. Its props and Progress import are supplied.

Render:

- an `article` with `className="readiness-card"`,
- an `h3` containing `deployment.serviceName`,
- a `p` containing the exact text `Release verification`,
- a `p` containing `<completed> of <total> checks complete`, and
- the supplied Progress.

Derive the percentage from `completedChecks` and `deployment.totalChecks`, round it with
`Math.round`, and pass it to Progress's `value`. Give Progress the accessible label
`<service name> readiness`.

The component must remain stateless. Do not mutate `deployment`, render the Button here,
import Base UI directly, or add custom width/color/animation logic.

### 4. Component test

Replace the component-test todo. Render `DEPLOYMENT` with `completedChecks={2}` and prove:

1. `Billing API` is a level-three heading.
2. `2 of 4 checks complete` is in the document.
3. The progressbar named `Billing API readiness` has `aria-valuenow="50"`.

This tests the business translation rather than generated Tailwind classes.

### 5. Feature

Complete `TrackDeploymentReadinessFeature`:

- initialize `completedChecks` from `deployment.completedChecks`,
- derive whether all checks are complete,
- define a handler that adds one using the functional updater and `Math.min`,
- render a `section` with `className="feature-stack"` and
  `aria-labelledby="readiness-heading"`,
- render an `h2` with that id and text `Track deployment readiness`,
- compose `DeploymentReadinessSummary` with the domain object and current count, and
- render the supplied Button after the summary.

While work remains, the Button says `Complete next check` and calls the handler. At the
total, it is disabled and says `All checks complete`.

Do not store a percentage or the whole domain object in state. Do not use `map`, `find`,
`filter`, an effect, or a timer.

### 6. Feature test

Replace the feature-test todo with one transition test:

1. Render the feature with `DEPLOYMENT` (initially 2 of 4).
2. Click `Complete next check` once and prove `3 of 4 checks complete` appears.
3. Click it once more and prove `4 of 4 checks complete` appears.
4. Prove the Button is now named `All checks complete` and is disabled.

This deliberately tests multiple transitions because bounded workflow state—not Progress
markup—is the feature's responsibility.

## Five-minute start gate

Your first three edits are:

1. Replace the type-test todo with the familiar `expectTypeOf` comparison.
2. Destructure the summary props and derive the percentage.
3. Render the heading, count text, and labelled Progress.

The likely stuck point is deciding what belongs in state. Store only the current completed
count. The percentage and completion boolean are derived during every render.

## Verification

Run:

```bash
npx vitest run exercises/react/04-ui-library-composition/049-track-deployment-readiness-progress
npm run typecheck
npx vite build exercises/react/04-ui-library-composition/049-track-deployment-readiness-progress
```

Then preview:

```bash
npx vite exercises/react/04-ui-library-composition/049-track-deployment-readiness-progress --host 127.0.0.1
```

The browser should begin at 2 of 4 (50%), advance to 4 of 4 (100%), then expose a disabled
`All checks complete` Button.

## Official documentation

- [shadcn Progress](https://ui.shadcn.com/docs/components/base/progress)
- [Base UI Progress semantics](https://base-ui.com/react/components/progress)
- [React state as a snapshot](https://react.dev/learn/state-as-a-snapshot)
- [React functional state updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [Testing Library role queries](https://testing-library.com/docs/queries/byrole/)

## Completion

Report whether you used earlier implementations, official documentation, compiler/test
feedback, or AI help. Completion requires all four learner-authored tests, focused tests,
typecheck, production build, and browser behavior to pass.
