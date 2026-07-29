# REACT-004: Compose a Discussion Panel

Status: complete

Target time: 20–30 minutes

Primary capability: retrieve parent/child composition with less scaffold

## Goal

Build a typed parent component that renders a supplied child and sends each value to the
component that owns it.

In a Bulletproof React application, both components would live under
`features/discussions/components`. Folder placement is supplied in this exercise.

## Mental model

The parent coordinates the larger UI. The child owns a narrower rendering contract.
Props flow downward:

```text
DiscussionPanel
├── title ──────────> DiscussionSummary
├── commentCount ──> DiscussionSummary
└── authorName ────> parent-owned paragraph
```

Explicit prop names make the boundary visible. The parent should render the child as a
capitalized JSX tag rather than call it as a regular function.

## Your task

The child component, named import, readonly parent props type, tests, and browser-like test
environment are supplied.

Define and export `DiscussionPanel` in `discussion-panel.tsx`. It must:

- use `DiscussionPanelProps`
- render `DiscussionSummary`
- pass `title` and `commentCount` to the child explicitly
- render the exact text `Started by <authorName>` in a parent-owned paragraph
- avoid duplicating the child’s heading or comment-count markup

## Scope

Edit only `discussion-panel.tsx`. Do not change the supplied import, type, child, or tests.
Do not add prop spreading, state, events, conditions, lists, styling, `children`, or another
component.

## Start and verify

1. Run the focused test and read the missing-export failure.
2. Define the exported, typed parent.
3. Render the supplied child with its two values.
4. Add the parent-owned author text.

```sh
npx vitest run exercises/react/004-compose-discussion-panel
npm run check:typescript
```

## Documentation

- [React: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React: Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components)

## Done when

- Both supplied tests and type-checking pass.
- The parent uses `DiscussionPanelProps`.
- The child receives only its owned values.
- Author markup remains in the parent.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, or outside
AI help.
