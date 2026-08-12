# REACT-048: Introduce a shadcn Health Badge

Status: complete

Target time: 45–60 minutes

Primary capability: communicate trusted domain status with an application-owned shadcn
Badge inside a feature-selected record

## Goal

Build one part of a service-health console. An operations engineer opens a service from a
collection and needs its owner and current health communicated clearly. If the requested
service is missing, the screen must report that state instead of crashing.

This begins the information-display family. The API contract, domain decoder, app,
generated Badge source, styling, configuration, and infrastructure tests are supplied.
You own the business component, selection feature, and their tests.

## Mental model

A Badge is compact presentation, not business state. The feature selects a trusted domain
object; the business component translates its health into visible wording and a Badge
variant:

```text
API records -- supplied map --> readonly MonitoredService[]
                                      ↓ feature uses find(selectedServiceId)
                         MonitoredService | undefined
                            ↓                          ↓
                ServiceHealthSummary       unavailable status
                            ↓
               health text + shadcn Badge
```

`find` is appropriate because the feature needs zero or one service. `map` would be
appropriate if the screen needed to render every service. The supplied app already uses
`map` for its different responsibility: constructing every domain object.

The Badge accepts a `variant` prop. A generic status translation looks like:

```tsx
<Badge variant={needsAttention ? 'destructive' : 'secondary'}>
  {needsAttention ? 'Needs attention' : 'Operating normally'}
</Badge>
```

Your component translates the actual domain vocabulary: `healthy` and `degraded`. Visible
text must communicate the status; color alone is not sufficient.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Read supplied readonly domain objects | integrated | REACT-040–047 |
| Use `find` to select one record by ID | retrieved | Fundamentals and earlier integration work |
| Narrow a possibly missing result | retrieved | Established conditional rendering and TypeScript narrowing |
| Compose one selected object into a component | integrated | Integration arc |
| Render two trusted status branches | retrieved | REACT-026, REACT-043, and REACT-046 |
| Author component and feature tests | transferred | REACT-044–047 |
| Consume a supplied shadcn Badge and choose its variant | new | Mental model, generic example, official docs, source, and infrastructure supplied |

There is one unfamiliar operation. There is no new state, event protocol, API request,
test harness, list rendering, custom color system, or second UI primitive.

## Your four files

Edit only:

- `src/components/services/service-health-summary.tsx`
- its colocated test
- `src/features/services/review-service-health-feature.tsx`
- its colocated test

Do not edit the supplied types, domain, app, styles, `components/ui/Badge`, configuration,
or infrastructure tests.

### 1. Business component

Complete `ServiceHealthSummary`. Its prop and Badge import are supplied.

Render:

- an `article` with `className="service-health-card"`,
- an `h3` containing `service.name`,
- a `p` containing `Owner: <service.ownerTeam>`, and
- a `p` containing the visible label `Health:` followed by the supplied Badge.

Translate the domain status this way:

| `service.health` | Badge text | Badge `variant` |
|---|---|---|
| `healthy` | `Healthy` | `secondary` |
| `degraded` | `Degraded` | `destructive` |

You may derive the text and variant before the return or directly in JSX. Do not add
state, mutate the service, use custom color classes, import Base UI directly, or define
the feature in this file.

### 2. Component test

Replace the component test todo with one degraded-service test:

1. Render `DEGRADED_SERVICE`.
2. Prove `Identity API` is a level-three heading.
3. Prove `Owner: Access Platform` is in the document.
4. Prove `Degraded` is in the document.

Do not assert generated class names. The behavior test proves business output; code review
will verify the chosen Badge variant.

### 3. Feature

Complete `ReviewServiceHealthFeature`:

- destructure `services` and `selectedServiceId`,
- use `find` to select the service whose `id` equals `selectedServiceId`,
- render a `section` with `className="feature-stack"` and
  `aria-labelledby="service-health-heading"`,
- render an `h2` with that id and text `Review service health`,
- when no service is found, render a `p` with `role="status"` and the exact text
  `Selected service unavailable`, and
- otherwise compose `ServiceHealthSummary` with the selected service.

Remember the return type of `find`:

```ts
const selected = records.find(/* predicate */);
// selected is Record | undefined, so handle both branches before using it as Record.
```

Do not store the selected object in state, use `filter`, render every service, duplicate
the Badge, or define the business component here.

### 4. Feature tests

Replace both feature test todos.

For `finds and presents the selected service`:

1. Render the feature with `SERVICES` and `selectedServiceId="service-identity"`.
2. Prove `Identity API` and `Degraded` are present.
3. Prove `Payments API` is absent with `queryByRole`.

For `reports an unavailable selected service`:

1. Render with `selectedServiceId="service-missing"`.
2. Prove the status named `Selected service unavailable` is in the document.
3. Prove no level-three heading is present with `queryByRole`.

These tests verify both possible results of `find` without testing shadcn's classes.

## Five-minute start gate

Your first three edits are:

1. Destructure `service` and render its name and owner.
2. Translate its two health values into Badge text and variants.
3. Destructure the feature props and call `find` with the ID comparison.

The likely stuck point is passing the result of `find` directly to
`ServiceHealthSummary`. Handle `undefined` first; only the other branch has a
`MonitoredService`.

## Verification

Run:

```bash
npx vitest run exercises/react/04-ui-library-composition/048-introduce-shadcn-health-badge
npm run typecheck
npx vite build exercises/react/04-ui-library-composition/048-introduce-shadcn-health-badge
```

Then preview:

```bash
npx vite exercises/react/04-ui-library-composition/048-introduce-shadcn-health-badge --host 127.0.0.1
```

The browser should show the selected Identity API with a destructive `Degraded` Badge.

## Official documentation

- [shadcn Badge](https://ui.shadcn.com/docs/components/base/badge)
- [MDN `Array.find`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
- [React conditional rendering](https://react.dev/learn/conditional-rendering)
- [Testing Library role queries](https://testing-library.com/docs/queries/byrole/)

## Completion

Report whether you used earlier implementations, official documentation, compiler/test
feedback, or AI help. Completion requires the focused tests, typecheck, production build,
and browser output to pass.
