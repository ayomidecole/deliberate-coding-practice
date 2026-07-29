# REACT-004: Compose a Discussion Panel

Status: active

Target time: 20–30 minutes

Primary capability: retrieve parent/child composition with less scaffold

Test responsibility: none; the React harness and tests are supplied

## Engineering reason

REACT-003 introduced composition with the complete parent signature supplied. This task
checks whether you can reconstruct the parent boundary while continuing to route each value
to the component that owns it.

Within a Bulletproof React application, both components would belong under
`features/discussions/components`. Their placement is supplied; folder design is not part
of this retrieval task.

## Supplied structure

- `discussion-summary.tsx` contains a complete child component. Do not edit it.
- `discussion-panel.tsx` contains the named child import and complete readonly parent props
  type, but no parent component implementation.
- The complete tests and browser-like environment are supplied.

Define and export a function component named `DiscussionPanel` that accepts one props object
using `DiscussionPanelProps`. It must render one semantic JSX tree that:

- renders the supplied `DiscussionSummary` child
- passes `title` and `commentCount` to the child explicitly
- renders the exact text `Started by <authorName>` in parent-owned paragraph markup
- does not duplicate the child’s heading or comment-count markup

The tests render two discussions to verify the component contract and data flow.

## Constraints

- Edit only `discussion-panel.tsx`.
- Keep the supplied import and `DiscussionPanelProps` unchanged.
- Use a named export.
- Pass child props explicitly; do not use JSX prop spreading.
- Do not call `DiscussionSummary` as a regular function.
- Do not add state, events, conditions, lists, styling, `children`, or another component.
- Do not edit `discussion-summary.tsx` or the tests.

## Required reading

- [React: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React: Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components)

## Five-minute start

1. Run the focused test and read the missing-export failure.
2. Define and export `DiscussionPanel` using the supplied props type.
3. Render `DiscussionSummary` with its two owned values.
4. Render the parent-owned author text.

Focused test:

```sh
npx vitest run exercises/react/004-compose-discussion-panel
```

Full TypeScript/React acceptance check:

```sh
npm run check:typescript
```

## Acceptance criteria

- Both supplied test cases pass.
- Type-checking passes.
- The learner-authored parent uses `DiscussionPanelProps`.
- The supplied child receives only `title` and `commentCount`.
- The parent renders the author text itself.
- No child markup is duplicated in the parent.
- No excluded behavior or test changes are introduced.
- Both verification commands pass.

When finished, request review and disclose any documentation, hints, prior exercise
reference, or outside AI help.
