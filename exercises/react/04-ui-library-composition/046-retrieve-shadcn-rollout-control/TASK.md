# REACT-046: Retrieve a shadcn Button Through a Stateful Feature

Status: active

Target time: 45–60 minutes

Primary capability: retrieve application-owned UI composition while regaining feature
ownership

## Goal

Build the rollout control in a release-operations console. An engineer must be able to
pause an active production rollout and later resume it from the same screen.

REACT-045 introduced the local shadcn Button inside a supplied workflow. This exercise
keeps that UI boundary familiar and increases ownership: the API contract, domain decoder,
app, shadcn source, styling, and infrastructure tests are supplied; you own the business
component, feature, and one test in each of those folders.

## Mental model

The API/domain value is the trusted state when the page starts. It is readonly historical
input, not the place where browser interaction is stored:

```text
DeploymentApiRecord
        ↓ validated once
readonly Deployment.rolloutPaused
        ↓ initializes
ManageRolloutFeature state             ← you own current workflow state
        ↓ current value + callback
RolloutControlCard                     ← you own business presentation
        ↓ familiar props
components/ui/Button                   ← supplied shadcn source
```

After initialization, the feature owns the current pause state. The component receives
that state and reports the requested next value. Neither layer mutates the domain object.

This is a controlled-component contract you have already used:

```tsx
type ControlledBooleanProps = {
  readonly value: boolean;
  readonly onValueChange: (nextValue: boolean) => void;
};
```

The business component translates `isPaused` into a status, a Button label, and the next
boolean sent to the feature. The feature stores that next value and renders again.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Read a supplied readonly domain object | integrated | REACT-040–045 |
| Render boolean-dependent status and action text | retrieved | REACT-026 and REACT-043 |
| Report the opposite boolean through a callback | integrated | REACT-043 |
| Initialize and update feature-owned state | integrated | Fundamentals and REACT-043 |
| Compose a component from a feature | integrated | REACT-018 onward |
| Consume the local shadcn Button | introduced | Completed in REACT-045; retrieved here |
| Author component and feature behavior tests | transferred | REACT-044 and REACT-045 |

There are no unfamiliar operations. The difficulty increase is ownership: this time you
connect the Button, controlled component, feature state, and two familiar tests.

## Your four files

Edit only:

- `src/components/deployments/rollout-control-card.tsx`
- its colocated test
- `src/features/deployments/manage-rollout-feature.tsx`
- its colocated test

Do not edit the supplied type, domain, app, styles, `components/ui/Button`, configuration,
or infrastructure tests.

### 1. Business component

Complete `RolloutControlCard`. Its props are supplied.

Render:

- an `article` with `className="rollout-card"`,
- an `h3` containing `deployment.serviceName`,
- `Target: <deployment.targetEnvironment>`,
- a `p` with `className="rollout-status"`, showing exactly
  `Rollout status: Active` or `Rollout status: Paused`, and
- the supplied shadcn `Button` with `type="button"`.

When `isPaused` is false, the Button is named `Pause rollout` and clicking it calls
`onPausedChange(true)`. When `isPaused` is true, it is named `Resume rollout` and clicking
it calls `onPausedChange(false)`.

The component must not use state, mutate `deployment`, import Base UI directly, or define
the feature.

### 2. Component test

Replace the component test todo with one active-rollout case:

1. Create a `vi.fn()` callback.
2. Render the supplied deployment with `isPaused={false}`.
3. Prove `Rollout status: Active` is in the document.
4. Find the `Pause rollout` Button by role and name.
5. Click it.
6. Prove the callback was called once with `true`.

The test does not expect the component to change itself; it proves the controlled
component reports the requested next value.

### 3. Feature

Complete `ManageRolloutFeature`:

- destructure the supplied `deployment`,
- initialize one boolean state value from `deployment.rolloutPaused`,
- define a handler receiving `nextPaused: boolean` and store that value,
- render a `section` with `className="feature-stack"` and
  `aria-labelledby="rollout-control-heading"`,
- render an `h2` with that id and the text `Control production rollout`, and
- compose `RolloutControlCard` with the domain object, current state, and handler.

Do not keep separate `paused` and `active` booleans, add an Effect, or duplicate the
component's visible status in the feature.

### 4. Feature test

Replace the feature test todo with one test covering the complete transition:

1. Render the supplied initially active deployment.
2. Prove the active status and `Pause rollout` Button are present.
3. Click `Pause rollout`.
4. Prove the paused status and `Resume rollout` Button are present.
5. Prove the active status is now absent with `queryByText`.
6. Click `Resume rollout`.
7. Prove the active status and `Pause rollout` Button have returned.

Use role queries for buttons and jest-dom matchers for document presence.

## Five-minute start gate

Your first three edits are identifiable from previous work:

1. Destructure the three supplied component props and render the domain fields/status.
2. Render the supplied Button with its branch-dependent label and callback value.
3. Destructure the feature prop and initialize state from `deployment.rolloutPaused`.

The likely stuck point is treating `deployment.rolloutPaused` as current mutable state.
Use it only as the initial value passed to `useState`; pass feature state to the component.

## Verification

Run:

```bash
npx vitest run exercises/react/04-ui-library-composition/046-retrieve-shadcn-rollout-control
npm run typecheck
npx vite build exercises/react/04-ui-library-composition/046-retrieve-shadcn-rollout-control
```

Then preview:

```bash
npx vite exercises/react/04-ui-library-composition/046-retrieve-shadcn-rollout-control --host 127.0.0.1
```

The browser must begin active, switch to paused, and return to active while using the
styled application-owned Button.

## Official documentation

- [shadcn Button](https://ui.shadcn.com/docs/components/base/button)
- [React state as a snapshot](https://react.dev/learn/state-as-a-snapshot)
- [React sharing state](https://react.dev/learn/sharing-state-between-components)
- [Testing Library role queries](https://testing-library.com/docs/queries/byrole/)

## Completion

Report whether you used earlier implementations, official documentation, test/compiler
feedback, or AI help. Completion requires the focused tests, typecheck, production build,
and both browser transitions to pass.
