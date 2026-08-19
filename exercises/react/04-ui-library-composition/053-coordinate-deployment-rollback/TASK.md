# REACT-053: Coordinate a Deployment Rollback

Status: complete

Target time: 90–120 minutes

Primary capability: retrieve multi-component feature composition in a different layout
while adopting one controlled overlay protocol

## Goal

Build a deployment operations workspace where an operator can:

1. inspect deployment checks in a table,
2. open a rollback plan in a right-side Sheet, and
3. start the rollback, closing the Sheet while the main workspace updates.

This deliberately changes the visual shape from the card stacks and diff viewer used in the
previous tasks. The screen has a summary band, a wide data table, and a narrow decision rail.

## What is supplied and what you own

Supplied:

- API contract, domain decoder, fixtures, app composition, and responsive styles,
- shadcn Button, Badge, Table, and Sheet source,
- completed summary and checks-table business components,
- routine component tests and the Sheet test harness,
- every routine import in the files you edit.

You will edit only these files, in this order:

1. `src/components/deployments/rollback-plan-sheet.tsx`
2. `src/features/deployments/manage-deployment-blocker-feature.tsx`
3. `src/features/deployments/manage-deployment-blocker-feature.test.tsx`

## Scope preflight

| Operation | Classification | Support |
|---|---|---|
| Consume a supplied readonly domain object | demonstrated | REACT-040–052 |
| Consume the supplied Table component through props | known | its markup and test are complete |
| Control Sheet with `open` and `onOpenChange` | **new** | mental model, tree, snippet, test, and official docs below |
| Coordinate sibling components with two state values | retrieved | REACT-049–052 |
| Author an observable feature workflow test | transferred | harness and all imports are supplied |

There is one new behavioral protocol. You are not authoring test infrastructure or import
paths.

## Mental model: a controlled Sheet

A Sheet is a dialog that enters from an edge of the screen. Its content is rendered through
a portal, but that does not move ownership: the feature still owns whether it is open.

```text
feature open state ─────────────► Sheet open prop
       ▲                              │
       └──── onOpenChange(nextOpen) ──┘
```

The Sheet reports requests to open or close. Your callback stores that next value. Starting
the rollback is a separate business event: the feature stores `true` for the rollback and
`false` for the Sheet in the same handler.

The component nesting is:

```text
RollbackPlanSheet
└── Sheet
    ├── SheetTrigger (renders a Button)
    └── SheetContent (right side)
        ├── SheetHeader
        │   ├── SheetTitle
        │   └── SheetDescription
        ├── ordered list of rollback steps
        └── SheetFooter
            └── Button
```

Base UI uses a `render` prop so the trigger adopts the supplied Button instead of nesting
one interactive element inside another:

```tsx
<SheetTrigger render={<Button type="button" />}>
  Open plan
</SheetTrigger>
```

Adapt that small protocol to the business labels and conditions below; do not copy a full
example component.

## Step 1: Complete `rollback-plan-sheet.tsx`

All imports and the prop contract are supplied. Replace the placeholder `<Sheet />` with:

1. A controlled `Sheet` using the supplied `open` and `onOpenChange` props.
2. A `SheetTrigger` that renders a destructive Button.
   - Disable it when `rollbackStarted` is true.
   - Show `Rollback started` when true; otherwise show `Review rollback plan`.
3. `SheetContent` entering from the right.
4. A `SheetHeader` containing:
   - `SheetTitle`: `Rollback plan for {service name}`
   - `SheetDescription`: `Review the recovery sequence before starting the rollback.`
5. An ordered list with `className="rollback-steps"`. Map `deployment.rollbackSteps` to
   `<li>` elements; use the step text as the key because these supplied steps are unique.
6. A `SheetFooter` containing a destructive Button named `Start rollback`. It calls
   `onStartRollback` and is disabled when `rollbackStarted` is true.

Do not add state to this component. It presents values and reports user intent.

### Checkpoint for Step 1

Run:

```bash
npx vitest run exercises/react/04-ui-library-composition/053-coordinate-deployment-rollback/src/components/deployments/rollback-plan-sheet.test.tsx
```

The supplied test must pass before you open the feature file.

## Step 2: Complete `manage-deployment-blocker-feature.tsx`

The feature coordinates three business components:

```text
ManageDeploymentBlockerFeature
├── DeploymentBlockerSummary
└── deployment-grid
    ├── BlockingChecksTable
    └── rollback-rail
        └── RollbackPlanSheet
```

All imports and the outer section are supplied. Complete the feature in this order:

1. Create `isPlanOpen` state initialized to `false`.
2. Create `rollbackStarted` state initialized from
   `deployment.rollbackStatus === 'started'`.
3. Add `handlePlanOpenChange(nextOpen: boolean)` and store `nextOpen`.
4. Add `handleStartRollback()`. In this one handler:
   - store `true` in `rollbackStarted`,
   - store `false` in `isPlanOpen`.
5. After the supplied `<h2>`, render `DeploymentBlockerSummary` with the deployment and
   current rollback value.
6. Render `<div className="deployment-grid">` containing:
   - `BlockingChecksTable` with `deployment.checks`,
   - `<aside className="rollback-rail" aria-labelledby="rollback-decision-heading">`.
7. Inside the aside, render:
   - `<h3 id="rollback-decision-heading">Rollback decision</h3>`,
   - `<p>Review the ordered recovery plan before changing production.</p>`,
   - `RollbackPlanSheet` with the domain object, both state values, and both handlers.

Do not mutate the domain object, duplicate Sheet markup in the feature, or store derived
labels in state.

## Step 3: Write the feature workflow test

The environment, imports, fixture, and cleanup are supplied. Replace `it.todo` with one
test proving this observable sequence:

1. Render the feature with `BLOCKED_DEPLOYMENT`.
2. `Deployment blocked` is present.
3. The table row named with `Error-rate budget` is present.
4. Click `Review rollback plan`.
5. The dialog named `Rollback plan for Checkout API` is present.
6. Click `Start rollback`.
7. The dialog is no longer present. Use `queryByRole` for this absence assertion.
8. `Rollback in progress` is present.
9. The `Rollback started` button is disabled.

Test only behavior visible to a user. Do not inspect React state or invoke handlers directly.

## Full verification

Run from the workspace root:

```bash
npx vitest run exercises/react/04-ui-library-composition/053-coordinate-deployment-rollback
npx tsc --noEmit -p exercises/react/04-ui-library-composition/053-coordinate-deployment-rollback/tsconfig.json
npm run typecheck
npx vite build exercises/react/04-ui-library-composition/053-coordinate-deployment-rollback
```

Then preview:

```bash
npx vite exercises/react/04-ui-library-composition/053-coordinate-deployment-rollback --host 127.0.0.1
```

The browser must show the responsive table-and-decision-rail layout. The plan must open in
a right-side Sheet. Starting the rollback must close it and update the main workspace.

## Official documentation

- [shadcn Sheet](https://ui.shadcn.com/docs/components/base/sheet)
- [Base UI Dialog API](https://base-ui.com/react/components/dialog)
- [shadcn Table](https://ui.shadcn.com/docs/components/base/table)
- [shadcn Badge](https://ui.shadcn.com/docs/components/base/badge)
- [shadcn Button](https://ui.shadcn.com/docs/components/base/button)
- [React sharing state](https://react.dev/learn/sharing-state-between-components)
- [Testing Library role queries](https://testing-library.com/docs/queries/byrole/)

## Completion

Report what help you used. Completion requires the learner-authored feature workflow test,
all supplied tests, both typechecks, the production build, and browser behavior.

System-design lesson: overlay location does not determine state ownership. The feature owns
the workflow; the Sheet is a controlled presentation boundary that reports user intent.
