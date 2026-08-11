# REACT-045: Use a shadcn Button in a Business Component

Status: active

Target time: 30–45 minutes

Primary capability: consume one application-owned shadcn component through familiar React
props

## Goal

Build one part of a release-approval console. A release engineer needs to see which service
is targeting production and request approval when that action is available.

This is an introduction to the UI-library arc, not an integration capstone. The app,
feature state, styling, shadcn configuration, generated Button source, and UI infrastructure
test are supplied. You own one business component and one of its tests.

## Mental model

shadcn is not a component package that the business component imports. It places
application-owned component source in `src/components/ui`:

```text
supplied ReviewDeploymentFeature
  owns whether approval is still available
                 ↓ props
DeploymentApprovalCard                 ← you complete this
  gives the action business meaning
                 ↓ imports
components/ui/Button                    ← supplied shadcn source
  owns reusable appearance and low-level behavior
```

The generated Button accepts familiar button props. You already know the underlying React
operations:

```tsx
<Button disabled={!isAllowed} onClick={reportAction}>
  Perform action
</Button>
```

Your translation is from the deployment vocabulary in this exercise to that generic
pattern. Do not import Base UI directly or edit the generated Button.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Render supplied string and boolean props | known | Used throughout the fundamentals and integration arcs |
| Derive visible text from a boolean | known | Retrieved in earlier stateful components |
| Pass `disabled` and `onClick` | known | Event and prop fundamentals |
| Author one behavior test with role queries | known | Transferred in REACT-044 |
| Consume the supplied local shadcn `Button` | new | Mental model, generic snippet, source, styling, and infrastructure test supplied |

There is one new operation. You are not authoring feature state, a domain model, a UI
primitive, Tailwind classes, test setup, or a Base UI callback.

## Your two files

Edit only:

- `src/components/deployments/deployment-approval-card.tsx`
- `src/components/deployments/deployment-approval-card.test.tsx`

### 1. Complete the business component

The props and Button import are already supplied. Use this direct element map:

| Element | Required output |
|---|---|
| `article` | `className="deployment-card"` |
| `h3` | the supplied `serviceName` |
| first `p` | `Target: <targetEnvironment>` |
| second `p` | `className="approval-availability"` and either `Approval available` or `Approval unavailable` |
| supplied `Button` | `type="button"`, text `Request approval`, and the behavior below |

The Button must:

- be disabled when `approvalAvailable` is `false`, and
- call `onApprove` through `onClick` when enabled.

Do not add state, an Effect, custom Tailwind classes, an event wrapper, or another
component.

### 2. Complete one test

The component test already contains a passing supplied case for the unavailable branch.
Replace the remaining `it.todo` with one test for the available branch:

1. create a `vi.fn()` callback,
2. render the card with approval available,
3. find the button by role and the name `Request approval`,
4. prove the button is enabled,
5. prove `Approval available` is in the document,
6. click the button, and
7. prove the callback was called once.

The imports and test environment are supplied. Do not test shadcn's internal classes or
Base UI implementation details.

## Five-minute start gate

Your first three edits are:

1. Destructure the four supplied props.
2. Render the article, heading, target, and conditional availability text.
3. Render the supplied Button with its familiar props.

The likely mistake is reversing the disabled condition. Predict both cases before writing
it: available means enabled; unavailable means disabled.

## Verification

After completing the component, run:

```bash
npx vitest run exercises/react/04-ui-library-composition/045-introduce-shadcn-button
npm run typecheck
npx vite build exercises/react/04-ui-library-composition/045-introduce-shadcn-button
```

Then preview it:

```bash
npx vite exercises/react/04-ui-library-composition/045-introduce-shadcn-button --host 127.0.0.1
```

The page should begin with approval available. Clicking the styled Button should submit
the request, show `Approval request: Submitted`, and disable the Button.

## Official documentation

- [shadcn Button](https://ui.shadcn.com/docs/components/base/button)
- [React: responding to events](https://react.dev/learn/responding-to-events)
- [Testing Library: role queries](https://testing-library.com/docs/queries/byrole/)

## Completion

Report whether you used earlier exercise implementations, official documentation,
compiler/test feedback, or AI help. Completion requires the focused tests, typecheck,
production build, and browser behavior to pass.
