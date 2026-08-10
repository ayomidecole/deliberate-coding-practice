# GO-003: Apply Stock Adjustments Without Mutation

Target time: 25–35 minutes  
Primary focus: Go map ownership and behavioral tests

## Concept

Return adjusted map data without changing the map supplied by the caller.

## Why it matters

Maps can be shared across parts of a program. Unexpected mutation creates hidden coupling and makes changes harder to reason about and test.

## Scenario

An inventory function calculates new stock levels, but its current implementation modifies the caller's map.

Read the provided implementation and tests. Run the focused test before editing to observe the mutation failure.

## Required behavior

- Apply adjustments in their given order.
- Multiple adjustments for the same product are cumulative.
- Return a new map containing every original product and the adjusted values.
- Never mutate the input map.
- Empty adjustments return an independent copy of the input map.

For this exercise, assume every product exists and every resulting stock value is valid.

## Your implementation responsibility

- Preserve the exported types and function signature.
- Create independent result state before applying adjustments.
- Keep the implementation direct and readable.

## Your testing responsibility

Keep the starter tests and add at least two meaningful behavioral tests. Your additions must cover:

- repeated adjustments to one product;
- empty adjustments returning an independent copy.

Prove independence by changing the returned map and confirming the input map does not change. Use `maps.Equal` when comparing map contents.

## Constraints

- Do not mutate the caller's input map.
- Do not add validation, errors, HTTP, persistence, interfaces, goroutines, or channels.
- Do not use third-party packages.
- Use the provided documentation and tutor hints; do not use outside AI-generated solution code.

## Required reading

- [A Tour of Go: maps](https://go.dev/tour/moretypes/19)
- [Standard library `maps` package](https://pkg.go.dev/maps)

## Commands

Run only this task while working:

```sh
go test ./exercises/go/01-foundations-testing/003-apply-stock-adjustments -v
```

Before requesting review:

```sh
gofmt -w exercises/go/01-foundations-testing/003-apply-stock-adjustments
npm run check
```

## Acceptance criteria

- All required behavior is implemented.
- Starter tests remain present.
- At least two meaningful tests are added and cover both listed cases.
- Formatting, vetting, and all repository tests pass.

## When you are done

Ask for review and include short answers:

1. Why would assigning the input map to another variable not create an independent copy?
2. Which test proves the returned map is independent?
3. Which documentation or hints did you use, including any outside AI assistance?
