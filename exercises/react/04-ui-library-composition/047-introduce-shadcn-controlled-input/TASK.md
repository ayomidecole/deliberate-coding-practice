# REACT-047: Introduce a Controlled shadcn Input

Status: complete

Target time: 45–60 minutes

Primary capability: consume an application-owned shadcn Input through a controlled
business component and feature

## Goal

Build the editable runbook field in a deployment-operations console. An engineer needs to
see the URL saved with a production deployment, edit a draft URL, and know whether the
draft differs from the saved value.

This begins the forms family. It does not introduce submission or validation yet. The API
contract, domain decoder, app, shadcn Input source, styling, configuration, and their tests
are supplied. You own the business component, feature, and one test in each folder.

## Mental model

The shadcn CLI places application-owned Input source in `components/ui`. The Input still
accepts familiar native controlled-input props such as `type`, `id`, `value`, and
`onChange`:

```tsx
<Input
  id="example"
  value={currentValue}
  onChange={suppliedChangeHandler}
/>
```

The important data boundary is the same one you used before shadcn:

```text
DeploymentApiRecord
        ↓ validated
readonly Deployment.runbookUrl        ← saved value; never mutate
        ↓ initializes
EditDeploymentRunbookFeature state    ← current editable draft
        ↓ value + change handler + derived comparison
DeploymentRunbookField
        ↓ familiar controlled props
components/ui/Input                    ← supplied shadcn source
```

The feature owns the draft and decides whether it differs from the saved domain value.
The business component owns the labelled presentation and passes the controlled contract
to the Input. The Input does not own the draft.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Follow a supplied API contract and domain object | integrated | REACT-040–046 |
| Initialize string state from a supplied value | retrieved | REACT-023–025 and REACT-044 |
| Store `event.currentTarget.value` | integrated | REACT-022–025 and REACT-044 |
| Compare current and original strings | retrieved | REACT-025 |
| Compose feature state into a controlled component | integrated | Fundamentals and integration arc |
| Author component and feature behavior tests | transferred | REACT-044–046 |
| Consume the supplied local shadcn Input | new | Official docs, generated source, styling, and infrastructure test supplied |

There is one unfamiliar operation. You are not authoring a form submission protocol,
validation rule, Field abstraction, API request, UI infrastructure, or test harness.

## Your four files

Edit only:

- `src/components/deployments/deployment-runbook-field.tsx`
- its colocated test
- `src/features/deployments/edit-deployment-runbook-feature.tsx`
- its colocated test

Do not edit the supplied types, domain, app, styles, `components/ui/Input`, configuration,
or infrastructure tests.

### 1. Business component

Complete `DeploymentRunbookField`. Its prop contract and imports are supplied.

Render:

- an `article` with `className="runbook-card"`,
- an `h3` containing `deployment.serviceName`,
- `Target: <deployment.targetEnvironment>`,
- `Saved runbook: <deployment.runbookUrl>`,
- a native `label` with `htmlFor="runbook-url"` and text `Runbook URL`,
- the supplied shadcn `Input` with `id="runbook-url"`, `type="url"`, the current
  `draftRunbookUrl` as its `value`, and `onRunbookUrlChange` as its `onChange`, and
- a `p` with `className="draft-status"` containing exactly `Unsaved changes` when
  `hasUnsavedChanges` is true or `No unsaved changes` when it is false.

Pass the handler directly to Input. Do not define another change handler, add state, mutate
the domain object, import Base UI directly, or implement the feature here.

### 2. Component test

Replace the component test todo with one changed-draft case:

1. Create a `vi.fn()` change handler.
2. Render the component with the supplied deployment, the draft URL
   `https://runbooks.example.com/identity-v2`, and `hasUnsavedChanges={true}`.
3. Find the textbox by its label `Runbook URL`.
4. Prove it has the draft URL as its value.
5. Prove `Unsaved changes` is in the document.
6. Fire a change with the value `https://runbooks.example.com/identity-v3`.
7. Prove the supplied handler was called once.

This component test proves presentation and event forwarding. It does not expect the
controlled Input to update itself because the feature owns the state.

### 3. Feature

Complete `EditDeploymentRunbookFeature`:

- import `useState` and the `ChangeEvent` type from React,
- destructure the supplied `deployment`,
- initialize `draftRunbookUrl` state from `deployment.runbookUrl`,
- define a typed input-change handler that stores `event.currentTarget.value`,
- derive `hasUnsavedChanges` by comparing the draft with `deployment.runbookUrl`,
- render a `section` with `className="feature-stack"` and
  `aria-labelledby="runbook-editor-heading"`,
- render an `h2` with that id and text `Edit deployment runbook`, and
- compose `DeploymentRunbookField` with the domain object, current draft, derived boolean,
  and change handler.

Do not duplicate the URL in a second state variable, update the domain object, use an
Effect, or define the business component in the feature file.

### 4. Feature test

Replace the feature test todo with one complete controlled-input transition:

1. Render the supplied deployment.
2. Find the textbox by the label `Runbook URL`.
3. Prove its initial value equals `https://runbooks.example.com/identity`.
4. Prove `No unsaved changes` is in the document.
5. Change the textbox to `https://runbooks.example.com/identity-v2`.
6. Prove the textbox now has that value.
7. Prove `Unsaved changes` is in the document.
8. Prove `No unsaved changes` is now absent with `queryByText`.
9. Prove `DEPLOYMENT.runbookUrl` still equals the original URL.

Use the textbox's accessible label rather than a test id or CSS selector.

## Five-minute start gate

Your first three edits are:

1. Destructure the four supplied component props and render the domain text.
2. Connect the native label to the supplied Input with matching `htmlFor` and `id`.
3. Pass `draftRunbookUrl` and `onRunbookUrlChange` through `value` and `onChange`.

The likely stuck point is using `deployment.runbookUrl` as the Input value after creating
state. That would keep displaying the saved value. The Input receives the feature's draft;
the domain value is only the initial value and comparison baseline.

## Verification

Run:

```bash
npx vitest run exercises/react/04-ui-library-composition/047-introduce-shadcn-controlled-input
npm run typecheck
npx vite build exercises/react/04-ui-library-composition/047-introduce-shadcn-controlled-input
```

Then preview:

```bash
npx vite exercises/react/04-ui-library-composition/047-introduce-shadcn-controlled-input --host 127.0.0.1
```

The browser must begin with the saved URL and `No unsaved changes`. Editing the styled
Input must update the draft and show `Unsaved changes` while the saved domain text remains
unchanged.

## Official documentation

- [shadcn Input](https://ui.shadcn.com/docs/components/base/input)
- [React controlled inputs](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)
- [React choosing state structure](https://react.dev/learn/choosing-the-state-structure)
- [Testing Library role queries](https://testing-library.com/docs/queries/byrole/)

## Completion

Report whether you used earlier implementations, official documentation, compiler/test
feedback, or AI help. Completion requires the focused tests, typecheck, production build,
and browser behavior to pass.
