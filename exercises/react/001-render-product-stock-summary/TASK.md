# REACT-001: Render a Product Stock Summary

Status: queued; GO-022 remains active  
Target time when activated: 15–25 minutes  
Primary capability: render supplied typed props as semantic JSX  
Test responsibility: none; the unfamiliar React test harness is supplied

## Concept

A React component is a function that receives one props object and returns a description
of UI. JSX is the HTML-like syntax used to write that description. React turns the JSX
into element objects and later renders them into the page.

Component names begin with a capital letter. JavaScript or TypeScript values appear inside
JSX braces:

```tsx
const exampleCount = 3;
const exampleMarkup = <strong>{exampleCount}</strong>;
```

When a component returns multiple nested elements, they must share one parent element.
Multiline JSX should be wrapped in parentheses after `return`.

## Architectural context

`ProductStockSummary` is specific to an inventory feature, so in a Bulletproof React
application it would belong under `features/inventory/components`. Its architectural
classification is supplied in this exercise; choosing boundaries is not part of the first
JSX task.

## Scenario

Implement the supplied `ProductStockSummary` component in
`product-stock-summary.tsx`. Replace `return null` with semantic JSX that:

- presents `productName` as an accessible level-two heading
- presents the exact text `<availableUnits> units available`
- reads both values from the supplied props rather than hardcoding either test case

The supplied tests render two different prop combinations to verify that the component
describes its inputs.

## Supplied infrastructure

- The readonly props type and component signature are supplied.
- React, JSX compilation, jsdom, React Testing Library, cleanup, and all tests are supplied.
- You do not need to import React with the configured JSX transform.

## Constraints

- Edit only `product-stock-summary.tsx`.
- Keep the exported type and function signature unchanged.
- Use semantic HTML that satisfies the heading contract.
- Do not add state, event handlers, conditional rendering, styling, another component, or
  the REACT-000 helper.
- Do not change or add tests.

## Required reading

- [React: Your First Component](https://react.dev/learn/your-first-component)
- [React: Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
- [React: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)

## Five-minute start

When this queued task becomes active:

1. Run the focused test before editing.
2. Open `product-stock-summary.tsx`.
3. Replace `return null` with a parent element containing a level-two heading and the
   availability text.

Focused test:

```sh
npx vitest run exercises/react/001-render-product-stock-summary
```

TypeScript/React acceptance check:

```sh
npm run check:typescript
```

## Acceptance criteria

- Both supplied test cases pass.
- Type-checking passes.
- The heading and availability text are derived from props.
- The component remains a pure description of UI with no excluded behavior added.
- Both verification commands pass.

When finished, request review and disclose any documentation, hints, or outside AI help.
