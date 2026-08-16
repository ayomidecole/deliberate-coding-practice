# REACT-051: Compose a Release Handoff Interface

Status: active

Target time: 90–120 minutes

Primary capability: use documentation to compose the UI components a business workflow
needs, then integrate that interface with feature-owned state

## Goal

Build a production-shaped release handoff interface. An operator must understand the
current handoff guidance, choose a delivery channel, see that choice reflected in the
release summary, and send the handoff. Sending updates the interface and locks its controls.

This is not a Select-memorization exercise. It practices the reusable UI-building process:

1. Start from the business states and actions.
2. Find appropriate components in the design system.
3. Read their docs and generated source.
4. Compose generic primitives behind a business component.
5. Connect that component to feature-owned state.
6. Test the workflow through what a user can observe and operate.

The interface uses several component families: Alert, Separator, Select, Card, Badge, and
Button. Some names are new, but only Select introduces a new interaction protocol. Alert
and Separator are ordinary presentational composition.

The API contract, domain model, app, Sera design-system source, summary Card, action
component, routine tests, styles, and configuration are supplied. You own the multi-
primitive channel panel, feature integration, and central workflow test.

## Component mental models

### Alert and Separator

Alert groups an important message; `AlertTitle` and `AlertDescription` structure its
content. Separator creates a visual boundary. Neither owns workflow state or reports an
event.

```text
Alert
├── AlertTitle
└── AlertDescription

Separator                     ← presentation only
```

### Controlled Select

Select is an interactive family made from cooperating parts:

```text
Select                         ← controlled root: value + onValueChange
├── SelectTrigger              ← visible control the user opens
│   └── SelectValue            ← selected label or placeholder
└── SelectContent              ← popup created when open
    ├── SelectItem
    ├── SelectItem
    └── SelectItem
```

Select reports its next value as the callback's first argument. Base UI also supplies
event details as a second argument; the business boundary forwards only the value:

```tsx
<Select
  value={value}
  onValueChange={(nextValue) => onValueChange(nextValue)}
>
  <SelectTrigger aria-labelledby="handoff-channel-label">
    <SelectValue placeholder="Choose a channel" />
  </SelectTrigger>
  <SelectContent>{/* SelectItem children belong here */}</SelectContent>
</Select>
```

### Application composition

```text
CoordinateReleaseHandoffFeature          ← owns handoffChannel and isSent
│
├── ReleaseHandoffCard                  ← supplied Card + Badge summary
├── HandoffChannelPanel                 ← your Alert + Separator + Select
└── HandoffSubmitControl                ← supplied Button action
```

The generic primitives do not know what a release handoff means. The panel supplies that
meaning; the feature stores the workflow state shared by its siblings.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Read supplied API/domain data | demonstrated | REACT-040–050 |
| Compose Card, Badge, and Button | demonstrated | REACT-045–050 |
| Own state and coordinate siblings | demonstrated/retrieval | REACT-050 |
| Derive presentation and eligibility | demonstrated | REACT-049–050 |
| Compose Alert and Separator | new names, known operation | Stateless component composition; docs and source supplied |
| Compose controlled Select parts | new operation | Mental model, snippet, generated source, docs, and test supplied |
| Author the central interaction test | demonstrated | REACT-044–050 |

There is one unfamiliar behavioral protocol. Component count is not being used as a proxy
for difficulty.

## Your three files

Edit only:

- `src/components/handoffs/handoff-channel-panel.tsx`
- `src/features/handoffs/coordinate-release-handoff-feature.tsx`
- its colocated test

Read the supplied domain, Card, action control, generated UI source, and tests as executable
contracts. Do not edit supplied tests, UI source, app, styles, or configuration.

### 1. Multi-primitive business panel

Complete `HandoffChannelPanel`. Its props, imports, wrapper, and accessible label are
supplied.

Derive the Alert title and description:

| Condition | Alert title | Alert description |
|---|---|---|
| `isSent` | `Delivery confirmed` | `The handoff channel is locked.` |
| not sent and `value` is non-null | `Channel selected` | `<value> will receive the release context.` |
| not sent and `value` is null | `Choose a channel` | `Select where the release context should be delivered.` |

Inside the wrapper, compose in this order:

1. `Alert` containing `AlertTitle` and `AlertDescription` with the derived text.
2. `Separator`.
3. The supplied label.
4. Controlled `Select` with `value` and `disabled`; adapt its callback so only the next
   value reaches the supplied `onValueChange`.
5. `SelectTrigger` labelled by `handoff-channel-label` and `SelectValue` with placeholder
   `Choose a channel`.
6. `SelectContent` containing three `SelectItem` options whose values and text are
   `Slack channel`, `Email`, and `Incident room`.

Do not add state, translate a DOM event, import Base UI directly, edit generated source,
or add custom Tailwind classes.

### 2. Multi-component feature

Complete `CoordinateReleaseHandoffFeature`:

- initialize `handoffChannel` to `null`,
- initialize `isSent` from whether `release.handoffStatus` is `sent`,
- derive `hasChannel` from whether the channel is non-null,
- derive `canSend` from `hasChannel` and the current sent state,
- define a handler that stores the next `string | null` channel,
- define a send handler that sets `isSent` to `true`,
- keep the supplied section and heading,
- render `ReleaseHandoffCard` with the release, channel, and sent state,
- render `HandoffChannelPanel` with the controlled channel, sent state as `disabled`,
  sent state, and its change handler, and
- render `HandoffSubmitControl` with `isSent`, `canSend`, and the send handler.

Do not store `hasChannel` or `canSend` in state, mutate the domain object, duplicate UI
markup, or define business components inside the feature.

### 3. Central feature test

Replace the todo with one test proving the complete workflow:

1. Render the supplied draft handoff.
2. Prove `Channel required` and the Alert title `Choose a channel` are present.
3. Retrieve the `Handoff channel` combobox and prove it is enabled.
4. Retrieve `Send handoff` and prove it is disabled.
5. Open the combobox and choose the `Slack channel` option.
6. Prove the Card shows `Handoff channel: Slack channel` and `Ready to send`.
7. Prove the Alert title is now `Channel selected`.
8. Prove `Send handoff` is enabled, then click it.
9. Prove the Card shows `Handoff sent`, the Alert title is `Delivery confirmed`, and
   `Ready to send` is absent.
10. Prove the combobox and Button named `Handoff sent` are disabled.

The supplied panel test demonstrates the unfamiliar Select interaction. Your test
translates it into the complete business workflow.

## Five-minute start gate

Your first three edits are:

1. Derive the Alert copy from the supplied table and render its three parts.
2. Add Separator, then put controlled Select beneath the supplied label.
3. Add the three SelectItem options using the mental model and docs.

The likely stuck point is treating `onValueChange` like an Input event. Do not read
`event.currentTarget.value`; Select passes the selected value directly.

## Verification

Run:

```bash
npx vitest run exercises/react/04-ui-library-composition/051-coordinate-release-handoff-feature
npx tsc --noEmit -p exercises/react/04-ui-library-composition/051-coordinate-release-handoff-feature/tsconfig.json
npm run typecheck
npx vite build exercises/react/04-ui-library-composition/051-coordinate-release-handoff-feature
```

Then preview:

```bash
npx vite exercises/react/04-ui-library-composition/051-coordinate-release-handoff-feature --host 127.0.0.1
```

The browser should begin with guidance, a required channel, and disabled action. Selecting
a channel must update the Card and Alert and enable the action. Sending must update and
lock the interface.

## Official documentation

- [Project's shadcn preset](https://ui.shadcn.com/create?preset=b5nhg0PRgm)
- [shadcn Alert](https://ui.shadcn.com/docs/components/base/alert)
- [shadcn Separator](https://ui.shadcn.com/docs/components/base/separator)
- [shadcn Select](https://ui.shadcn.com/docs/components/base/select)
- [Base UI Select](https://base-ui.com/react/components/select)
- [React sharing state](https://react.dev/learn/sharing-state-between-components)
- [Testing Library role queries](https://testing-library.com/docs/queries/byrole/)

## Completion

Report what help you used. Completion requires the learner-authored central feature test,
all supplied tests, exercise and root typechecks, production build, and browser behavior.
