# REACT-045: Use a shadcn Button in a Business Component

Status: active

Target time: 30–45 minutes

Primary capability: consume one application-owned shadcn component through familiar React
props

## Goal

Build one part of a release-approval console. A release engineer needs to see which service
is targeting production and request approval when that action is available.

This is an introduction to the UI-library arc, not an integration capstone. The API
contract, domain decoder, app, feature state, styling, shadcn configuration, generated
Button source, and their tests are supplied. You own one business component and one of its
tests.

## Mental model

shadcn is not a component package that the business component imports. It places
application-owned component source in `src/components/ui`:

```text
supplied DeploymentApiRecord contract
                 ↓ validated by
supplied Deployment domain object
                 ↓ passed into
supplied ReviewDeploymentFeature
  owns whether approval is still available
                 ↓ domain object + current workflow props
DeploymentApprovalCard                 ← you complete this
  gives the action business meaning
                 ↓ imports
components/ui/Button                    ← supplied shadcn source
  owns reusable appearance and low-level behavior
```

There is no API request yet. The app decodes an API-shaped fixture into `Deployment`; the
async API arc will later replace that fixture with a real response. Keeping the contract
and domain here preserves the production data path without making them new learner work.

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
| Follow a supplied API contract → domain → feature path | known | Integrated in REACT-040–044; no implementation required here |
| Read a supplied readonly `Deployment` | known | Integrated in REACT-040–044 |
| Render domain fields and a supplied boolean | known | Used throughout the fundamentals and integration arcs |
| Derive visible text from a boolean | known | Retrieved in earlier stateful components |
| Pass `disabled` and `onClick` | known | Event and prop fundamentals |
| Author one behavior test with role queries | known | Transferred in REACT-044 |
| Consume the supplied local shadcn `Button` | new | Mental model, generic snippet, source, styling, and infrastructure test supplied |

There is one new operation. You are not authoring the API contract, domain decoder,
feature state, UI primitive, Tailwind classes, test setup, or a Base UI callback.

## Your two files

Edit only:

- `src/components/deployments/deployment-approval-card.tsx`
- `src/components/deployments/deployment-approval-card.test.tsx`

### 1. Complete the business component

The props and Button import are already supplied. Use this direct element map:

| Element | Required output |
|---|---|
| `article` | `className="deployment-card"` |
| `h3` | `deployment.serviceName` |
| first `p` | `Target: <deployment.targetEnvironment>` |
| second `p` | `className="approval-availability"` and either `Approval available` or `Approval unavailable` |
| supplied `Button` | `type="button"`, text `Request approval`, and the behavior below |

The Button must:

- be disabled when `canRequestApproval` is `false`, and
- call `onApprove` through `onClick` when enabled.

Do not add state, an Effect, custom Tailwind classes, an event wrapper, or another
component.

The feature passes the trusted `Deployment` into this business component. It separately
passes the current `canRequestApproval` workflow value because a submitted request can make
the action unavailable without mutating the readonly domain object.

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

1. Destructure `deployment`, `canRequestApproval`, and `onApprove`.
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
