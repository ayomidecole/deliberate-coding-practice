# REACT-050: Compose a Release Approval Feature

Status: active

Target time: 75–90 minutes

Primary capability: compose a complex business component and coordinate multiple sibling
components through one feature-owned workflow state

## Goal

Build a production-shaped release approval feature. A release engineer needs one structured
view of a candidate's target, verification progress, and approval status, plus a separate
action that approves the release when every check is complete.

This is the composition turn in the UI-library arc. The API contract, domain decoder,
app, local shadcn source, routine tests, styling, and configuration are supplied. You own
one complex business component, the feature that coordinates two business components, and
the central feature behavior test.

This is also the first exercise using the project's chosen Sera design-system preset.
Its tokens, fonts, icons, and generated primitives are supplied; your responsibility is
to consume that shared visual language through documented component APIs.

## Mental model

There are three different levels of composition:

```text
ApproveReleaseFeature                         ← owns current approval state
│
├── ReleaseReadinessCard                      ← business presentation
│   ├── shadcn Card                            ← new structure primitive
│   ├── shadcn Badge                           ← familiar status primitive
│   └── shadcn Progress                        ← familiar feedback primitive
│
└── ReleaseApprovalControl                    ← supplied business action component
    └── shadcn Button                          ← familiar action primitive
```

The feature is the common owner because one approval transition affects both siblings:

```text
isApproved changes to true
        ├── ReleaseReadinessCard shows Approved
        └── ReleaseApprovalControl becomes disabled and says Release approved
```

Neither sibling owns a private copy of `isApproved`. Data flows down through props; the
action reports upward through `onApprove`.

Card is a compound presentation component. Its current composition is:

```text
Card
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter (optional here)
```

Unlike Dialog, Card has no hidden interaction state or event protocol. It gives related
content consistent structure. The generated source stays in `components/ui`; your
business component decides what release information belongs in each part.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Read supplied API/domain data | integrated | REACT-040–049 |
| Initialize and update boolean feature state | integrated | Fundamentals and REACT-046 |
| Derive approval eligibility | retrieved | Established conditional and derived-state work |
| Compose Badge, Progress, and Button | retrieved/transferred | REACT-045–049 |
| Compose shadcn Card parts | new | Mental model, official docs, imports, generated source, and test supplied |
| Build one component from several UI primitives | guided expansion | All child primitives except Card are familiar |
| Coordinate two sibling business components | guided expansion | Familiar data-down/events-up flow with one state value |
| Author one central feature test | transferred | REACT-044–049 |

There is one unfamiliar UI operation. There is no API request, effect, timer, array
transformation, form protocol, overlay, controlled third-party state, or new test harness.

## Your three files

Edit only:

- `src/components/releases/release-readiness-card.tsx`
- `src/features/releases/approve-release-feature.tsx`
- its colocated test

Read the supplied type, domain, component, action-control, and UI tests as executable
contracts. Do not edit supplied tests, generated UI source, app, styles, or configuration.

### 1. Complex business component

Complete `ReleaseReadinessCard`. Its prop type and required imports are supplied.

Derive:

- verification percentage from completed and total checks, rounded with `Math.round`,
- whether all checks are complete, and
- the status text and Badge variant:

| Current condition | Badge text | Badge variant |
|---|---|---|
| `isApproved` | `Approved` | `default` |
| not approved and all checks complete | `Ready for approval` | `secondary` |
| not approved and checks remain | `Checks incomplete` | `outline` |

Render an `article` with `className="release-card"`. Inside it, compose:

- `Card` as the presentation surface,
- `CardHeader`,
- `CardTitle` containing an `h3` with `release.serviceName`,
- `CardDescription` with `Target: <target environment>`,
- `CardAction` containing the status Badge,
- `CardContent` containing `<completed> of <total> checks complete`, and
- Progress with the derived percentage and accessible label
  `<service name> readiness`.

Do not add state, mutate the domain object, put the approval Button in this component,
import Base UI directly, or add custom Tailwind classes.

### 2. Multi-component feature

Complete `ApproveReleaseFeature`:

- destructure `release`,
- initialize `isApproved` from whether `release.approvalStatus` is `approved`,
- derive `allChecksComplete`,
- derive `canApprove` from completion and the current approval state,
- define `handleApprove` to set approval to `true`,
- render a `section` with `className="feature-stack"` and
  `aria-labelledby="release-approval-heading"`,
- render an `h2` with that id and text `Review release approval`,
- compose `ReleaseReadinessCard` with the release and current approval state, and
- compose the supplied `ReleaseApprovalControl` with `isApproved`, `canApprove`, and the
  handler.

The feature owns the workflow. Do not place JSX inside the handler, duplicate Badge or
Button markup, store `canApprove` in state, or redefine either business component here.

### 3. Central feature test

Replace the feature-test todo with one test proving sibling coordination:

1. Render the supplied complete, pending release.
2. Prove `Ready for approval` is present.
3. Retrieve `Approve release` and prove it is enabled.
4. Click it.
5. Prove `Approved` is present and `Ready for approval` is absent.
6. Prove the Button is now named `Release approved` and is disabled.

The supplied component test already covers the incomplete Card branch and percentage.
Your test owns the cross-component workflow behavior.

## Five-minute start gate

Your first three edits are:

1. Build the supplied Card anatomy around the release name and target.
2. Derive the percentage and status, then place familiar Progress and Badge primitives.
3. Initialize `isApproved` in the feature and render both business components.

The likely stuck point is deciding where `isApproved` belongs. Both siblings need the
current value, so their closest common owner—the feature—stores it once and distributes it.

## Verification

Run:

```bash
npx vitest run exercises/react/04-ui-library-composition/050-compose-release-approval-feature
npm run typecheck
npx vite build exercises/react/04-ui-library-composition/050-compose-release-approval-feature
```

Then preview:

```bash
npx vite exercises/react/04-ui-library-composition/050-compose-release-approval-feature --host 127.0.0.1
```

The browser should show a complete release ready for approval. Approving it must update
the Card's Badge and the separate action component from the same feature state.

## Official documentation

- [Project's shadcn preset](https://ui.shadcn.com/create?preset=b5nhg0PRgm)
- [shadcn Card](https://ui.shadcn.com/docs/components/base/card)
- [shadcn Badge](https://ui.shadcn.com/docs/components/base/badge)
- [shadcn Progress](https://ui.shadcn.com/docs/components/base/progress)
- [React sharing state](https://react.dev/learn/sharing-state-between-components)
- [Testing Library role queries](https://testing-library.com/docs/queries/byrole/)

## Completion

Report whether you used earlier implementations, official documentation, compiler/test
feedback, or AI help. Completion requires the learner-authored feature test, all supplied
tests, typecheck, production build, and browser behavior to pass.
