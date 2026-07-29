# REACT-003: Compose a Team Overview

Status: complete

Target time: 20–30 minutes

Primary capability: parent/child component composition and downward prop flow

Test responsibility: none; the React harness and tests are supplied

## Engineering reason

Features are built by composing components, not by placing all markup in one large
component. A parent owns the broader section and delegates a narrower responsibility to a
child through props.

Within a Bulletproof React teams feature, both supplied files would belong under
`features/teams/components`. `TeamOverview` is the parent; `TeamSummary` owns the team name
and member count.

## Mental model

Lowercase JSX tags describe browser elements. Capitalized JSX tags refer to component
functions:

```tsx
<Avatar imageUrl={profileImageUrl} />
```

The parent does not call `Avatar` like an ordinary function. It renders the component and
passes values as props. React renders the child’s returned JSX into the parent’s tree.
Props flow downward, and the child should only receive the values covered by its contract.

## Supplied structure

- `team-summary.tsx` contains a complete child component. Do not edit it.
- `team-overview.tsx` contains the named import, readonly parent props type, and parent
  component signature.
- The complete tests and browser-like environment are supplied.

Implement `TeamOverview` by replacing `return null` with one semantic JSX tree that:

- renders the supplied `TeamSummary` child
- passes `teamName` and `memberCount` from the parent props to the child
- renders `description` as paragraph text owned directly by `TeamOverview`
- does not duplicate the child’s heading or member-count markup in the parent

The tests render two different teams and verify the complete composed output.

## Constraints

- Edit only `team-overview.tsx`.
- Keep the supplied import, type, and function signature unchanged.
- Pass child props explicitly; do not use JSX prop spreading.
- Do not call `TeamSummary` as a regular function.
- Do not add state, events, conditions, lists, styling, `children`, or another component.
- Do not edit `team-summary.tsx` or the tests.

## Required reading

- [React: Your First Component](https://react.dev/learn/your-first-component)
- [React: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React: Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components)

## Five-minute start

1. Run the focused test before editing.
2. Replace `return null` with a semantic parent element.
3. Render `TeamSummary` inside it and connect the two child-owned props.
4. Add the parent-owned description paragraph.

Focused test:

```sh
npx vitest run exercises/react/003-compose-team-overview
```

Full TypeScript/React acceptance check:

```sh
npm run check:typescript
```

## Acceptance criteria

- Both supplied test cases pass.
- Type-checking passes.
- `TeamOverview` renders `TeamSummary` rather than duplicating its markup.
- The child receives only `teamName` and `memberCount`.
- The parent renders `description` itself.
- No excluded behavior or test changes are introduced.
- Both verification commands pass.

When finished, request review and disclose any documentation, hints, prior exercise
reference, or outside AI help.
