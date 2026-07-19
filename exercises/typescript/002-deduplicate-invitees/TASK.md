# TS-002: Deduplicate Invitees

Target time: 25–40 minutes  
Primary focus: type design, normalization, persistent collection state, stable filtering, and complete test authorship

## Concept

Normalize a value for comparison while preserving the original data selected for output.

## Why it matters

Real systems often receive logically duplicate data in different textual forms. Developers need to define identity precisely, preserve intentional ordering, avoid mutation, and prove those behaviors with tests.

## Scenario

An event organizer merged invitee lists from several sources. The combined list can contain the same email with different capitalization or surrounding whitespace.

Create these files yourself in this folder:

- `deduplicate-invitees.ts`
- `deduplicate-invitees.test.ts`

Design an invitee type that contains a person's name and email address. Decide whether a type alias or interface best communicates your intent, and decide how readonly guarantees should appear in the public API.

Implement and export a function named `deduplicateInvitees`.

## Required behavior

- Treat two emails as equal after removing surrounding whitespace and converting them to lowercase.
- Preserve the first invitee encountered for each normalized email.
- Return that first invitee exactly as supplied; normalization is only for comparison.
- Preserve the original relative order of retained invitees.
- Return an empty array for empty input.
- Do not mutate the input array or any invitee.
- Return a new array, even when the input contains no duplicates.
- Assume every email is non-empty after trimming. Email-format validation is out of scope.

## Your type responsibility

- Author the complete invitee type.
- Make the input and output types explicit.
- Express non-mutation intent through the types where appropriate.
- Be prepared to explain your choice of type alias or interface and your readonly decisions.

## Your testing responsibility

Author the entire test suite and all fixtures. Write at least five meaningful tests whose combined coverage includes:

- empty input
- input containing only unique emails
- exact duplicate emails
- duplicates that differ by capitalization and surrounding whitespace
- preservation of the first invitee's original values
- preservation of output order
- input immutability
- returning a new array rather than the original input reference

Tests may cover multiple requirements when the test name and assertions still communicate a clear behavior.

## Constraints

- Do not use `any`.
- Do not use type assertions such as `as SomeType`.
- Do not add a library to perform normalization or deduplication.
- Prefer straightforward control flow over a compressed one-line implementation.

## Required reading

- [TypeScript: Type aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [TypeScript: Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
- [TypeScript: Readonly properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties)
- [MDN: `Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

## Reference material

- [MDN: `String.prototype.trim()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim)
- [MDN: `String.prototype.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
- [Vitest: Assertions](https://vitest.dev/api/expect.html)

## Acceptance criteria

- Both required code files exist.
- Required behavior is implemented.
- At least five meaningful tests cover all listed behaviors collectively.
- Tests verify observable behavior rather than private implementation choices.
- Type-checking and all tests pass.

Run from the repository root:

```sh
npm run check
```

To run only this exercise:

```sh
npx vitest exercises/typescript/002-deduplicate-invitees
```

## When you are done

Ask for review and include short answers:

1. Why did you choose a type alias or an interface?
2. Where did you place readonly guarantees, and why?
3. Which documentation changed or confirmed your approach?
4. Which test gave you the most confidence?
5. Did you use any hints?
