# REACT-002: Build a Team Summary

Status: complete

Target time: 15–25 minutes

Primary capability: retrieve typed-prop semantic JSX

Difficulty change: author the component boundary with less scaffolding

Test responsibility: none; the existing React harness is supplied

## Engineering reason

REACT-001 established the mechanics of reading typed props and returning JSX. This task
checks whether you can reconstruct that component boundary in a different feature context
without receiving the function signature.

In a Bulletproof React application, `TeamSummary` would be a feature-specific component
under `features/teams/components`. That placement is supplied; architectural placement is
not a design decision in this retrieval task.

## Supplied contract

`team-summary.tsx` contains the complete readonly `TeamSummaryProps` type.

Define and export a function component named `TeamSummary` that accepts one props object
using that type. It must render one semantic JSX tree that:

- presents the exact text `<teamName> team` as an accessible level-two heading
- presents the exact text `<memberCount> members`
- derives both pieces of content from props rather than hardcoding test values

The supplied tests use two different teams to enforce the prop contract.

## Scope

This is retrieval, not a new React lesson. Use the same component model, destructured typed
props, JSX braces, single-parent rule, and semantic heading behavior practiced in
REACT-001.

Do not add:

- state or hooks
- events or conditional rendering
- styling or CSS classes
- another component
- custom test infrastructure

## Constraints

- Edit only `team-summary.tsx`.
- Keep `TeamSummaryProps` unchanged.
- Remove the scaffold comment when implementing the component.
- Use a named export.
- Do not change or add tests.
- Do not import React; the configured JSX transform does not require it.

## Required reading

- [React: Your First Component](https://react.dev/learn/your-first-component)
- [React: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React: Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)

## Five-minute start

1. Run the focused test and read the missing-export failure.
2. Under the supplied props type, declare and export `TeamSummary`.
3. Type and destructure its one props parameter.
4. Return the required heading and member text inside one parent element.

Focused test:

```sh
npx vitest run exercises/react/01-fundamentals/002-build-team-summary
```

Full TypeScript/React acceptance check:

```sh
npm run check:typescript
```

## Acceptance criteria

- Both supplied test cases pass.
- Type-checking passes.
- The component boundary is learner-authored and uses `TeamSummaryProps`.
- Both visible strings are derived from props.
- No excluded behavior or test changes are introduced.
- Both verification commands pass.

When finished, request review and disclose any documentation, hints, prior exercise
reference, or outside AI help.
