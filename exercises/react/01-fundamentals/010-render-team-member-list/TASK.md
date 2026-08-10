# REACT-010: Render a Team Member List

Status: complete

Target time: 15–25 minutes

Primary capability: independently retrieve keyed JSX list rendering

## Goal

Render readonly team-member records as a semantic list with stable React identity.

This is a retrieval task under `src/components/teams`. It checks whether you can recall how
to embed a mapped JSX collection without another syntax reference.

## Mental model

The component receives an array of records. The mapping callback turns each record into one
list item, and the unordered list owns the complete array of returned JSX elements.

Each returned list item must use the member's stable `id` as React's identity. Visible text
and React identity have separate jobs: the text is for the user, while the key helps React
match an item across future renders.

## Your task

The shared member type, component props, function boundary, tests, and browser-like test
environment are supplied. Edit
`src/components/teams/team-member-list.tsx` and replace `return null`.

Render:

- a `section`
- a level-two heading with the exact text `Team members`
- an unordered list
- one list item per member, in input order
- exact list-item text `<displayName>: <role>`

Use each member's `id` as its list item's key. Empty input should still render the heading
and an empty unordered list.

## Scope

Edit only `src/components/teams/team-member-list.tsx`.

- Keep the supplied import, props type, and function signature unchanged.
- Use exactly one `map` call inside the unordered list.
- Use a callback block with an explicit `return`.
- Put `key={member.id}` on the returned list item.
- Do not use an array index or generate a key.
- Do not add conditions, child components, state, events, filtering, sorting, utilities,
  styling, fragments, or test changes.
- For independent retrieval evidence, do not open REACT-009 or search for list-rendering
  syntax. If you use a reference, disclose it during review.

## Start and verify

1. Run the focused tests before editing.
2. Build the semantic heading and list shell.
3. Retrieve the mapped, keyed JSX structure from memory.

```sh
npx vitest run exercises/react/01-fundamentals/010-render-team-member-list
npm run typecheck
npx vitest run --exclude 'exercises/typescript/005-test-rate-limit-state/**'
```

The separate active TypeScript task is excluded from the stable suite until its tests are
authored.

## Documentation

Use after your independent attempt if needed:

- [React: Rendering Lists](https://react.dev/learn/rendering-lists)
- [Bulletproof React: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- Both supplied focused tests, type-checking, and the stable suite pass.
- The component renders one correctly formatted list item per member in input order.
- Every returned list item uses its member's stable `id` key.
- Empty input renders an empty semantic list without special-case branching.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, search, or
outside AI help.
