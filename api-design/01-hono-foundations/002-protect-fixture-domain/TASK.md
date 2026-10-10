# API-002: Protect a fixture's clubs

Focus: retrieve domain class construction in a changed soccer rule. Edit only
`src/domain/fixture.ts`.

## Goal

A fixture has a home club and an away club. The same club cannot occupy both sides.
The supplied `FixtureRecord` describes the input data; your `Fixture` class must enforce
the rule whenever one is constructed.

```text
FixtureRecord → new Fixture(record) → valid fixture or error
```

## Your task

### `src/domain/fixture.ts`

Complete the exported `Fixture` class. Give it public readonly string properties `id`,
`homeClubId`, and `awayClubId`. Its constructor already accepts a `FixtureRecord`.

If `homeClubId` and `awayClubId` are equal, throw an `Error` with the message
`fixture clubs must differ`. Otherwise, assign the record's three values to the class.
Do not modify the input record. Assume all IDs are nonempty strings.

Use your finished `Club` class from API-001 as a syntax reference if needed. Here the
decision compares *two fields*; there is no trimming and no new data layer.

## Scope preflight

- **Guided, now retrieved:** readonly class fields, constructor guard, throwing an error,
  and assigning `this` properties. API-001 passed after help with these operations.
- **Known:** comparing two strings, branching, and leaving input unchanged.
- **Supplied:** `FixtureRecord`, its import, and the domain test harness. Test authorship
  is unchanged because class construction is the skill being retrieved.
- **New operations:** none. The changed dimension is the invariant: two club IDs must
  differ. HTTP, services, and Hono remain outside this task.
- **Start:** declare the three properties, add the same-club guard, then assign fields.
  If the compiler says a property is uninitialized, compare its `this` name with the
  corresponding input field.

## Verify

From `api-design/`:

```sh
npm run typecheck
npm test -- 01-hono-foundations/002-protect-fixture-domain
```

The tests cover a valid fixture, the same club on both sides, and preserving the input.
They live beside `fixture.ts` in `src/domain/`.

Documentation: [TypeScript class fields and constructors](https://www.typescriptlang.org/docs/handbook/2/classes.html).

Done when both commands pass. Ask for review when finished; no written reflection is
required.
