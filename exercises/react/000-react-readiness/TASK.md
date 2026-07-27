# REACT-000: Choose a Stock Badge Tone

Target time: 10–15 minutes  
Primary capability: terminal conditional control flow  
Retrieval target: typed function inputs and outputs  
Habit: run the focused test before editing

## Why this checkpoint comes first

A React component is a function: it receives inputs and produces a description of UI.
Before adding JSX, routing, hooks, or application structure, you need to independently
translate one UI rule into typed control flow.

This checkpoint intentionally contains no React API. Passing it independently clears the
foundation gate for the first component task, where JSX rendering will be the only new
operation.

## Mental model

The supplied function receives a number and returns one of two allowed string values:

```ts
type ExampleResult = "first-option" | "second-option";

function chooseResult(input: number): ExampleResult {
  // Inspect the input, make the required decision, and return one allowed value.
}
```

The string union is a contract. TypeScript will reject a return value that is not one of
its members.

## Scenario

A future product component will display its stock badge using one of two tones:

- exactly `0` available units means `"sold-out"`
- any positive number of available units means `"available"`

Assume `availableUnits` is always a non-negative integer. Validation is out of scope.

Implement `selectStockBadgeTone` in `select-stock-badge-tone.ts`.

## Supplied infrastructure

The function signature, output type, and complete Vitest suite are supplied. Do not add or
change tests in this checkpoint.

## Constraints

- Keep the exported type and function signature unchanged.
- Use explicit conditional control flow.
- Do not use a ternary expression, lookup object, type assertion, or `any`.
- Do not import React.

## Required reading

- [TypeScript: functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [TypeScript: literal types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)

## Start here

1. Before editing, predict the results for `0`, `1`, and `12`.
2. Run the focused test and read the failure.
3. Replace the placeholder implementation with the smallest clear branch that satisfies
   the written rule.

Focused test:

```sh
npx vitest run exercises/react/000-react-readiness
```

Full TypeScript/React acceptance check:

```sh
npm run check:typescript
```

## Acceptance criteria

- All three supplied behaviors pass.
- TypeScript accepts every return path.
- The implementation uses an explicit branch and remains within the stated scope.
- Both verification commands pass.

## When you are done

Ask for review and include:

1. Your predictions for `0`, `1`, and `12`.
2. Why the boundary belongs at exactly zero.
3. What TypeScript would do if the function returned `"empty"`.
4. Whether you used documentation, a hint, or outside AI-generated code.
