# REACT-021: Mount the App in the Browser

**Status:** Complete  
**Target time:** 25–35 minutes

## Goal

Connect the application tree from REACT-020 to a real browser page. You will
implement the small runtime entry point that hands one HTML element to React and
asks React to render `App` inside it.

## Mental Model

The browser first loads `index.html`. Vite then loads `main.tsx` as a JavaScript
module. The entry point forms a boundary between two trees:

```text
index.html: <div id="root">
              ↓ DOM element
main.tsx:   create a React root, then render <App />
              ↓ component tree
App → features → shared components
```

The browser owns the `div`. After a React root is created for that element,
React owns the UI rendered inside it. A fully React application normally creates
this root once during startup; state changes inside features update the existing
tree rather than creating more roots.

The HTML file, Vite dependency, DOM lookup, null guard, application tree, and test
infrastructure are supplied. The guard matters because `getElementById` can return
`null`, while React requires a real DOM element.

## Your Task

Edit only `src/main.tsx`:

1. Use the supplied `createRoot` import with `rootElement` to create a React root.
2. Use the returned root to render the supplied `<App />` component.

Pass the DOM element to `createRoot`, and pass JSX to the root's render operation.
Do not call `App` as a regular function.

## Scope

- Do not edit `index.html`, `App`, features, shared components, or the test.
- Do not add styling, routing, providers, `StrictMode`, or another root.
- Test ownership is **fully supplied** because browser mounting and its test
  boundary are both new. You only own the two mount operations in `main.tsx`.

Your first three edits should be identifiable: call `createRoot` with the guarded
element, save its returned root, then call that root's render operation with JSX.
The most likely type obstacle—the possibly missing DOM element—is already handled.

## Start and Verify

Run the focused test first. Its initial failure is intentional: the HTML root is
present, but the application has not been rendered into it.

```bash
npx vitest run exercises/react/01-fundamentals/021-mount-app-in-browser
```

After implementing the entry point, run:

```bash
npm run typecheck
npx vite build exercises/react/01-fundamentals/021-mount-app-in-browser
npx vitest run --exclude 'exercises/typescript/006-protect-worker-capacity/**'
```

Then start the development server:

```bash
npx vite exercises/react/01-fundamentals/021-mount-app-in-browser --host 127.0.0.1
```

Open `http://127.0.0.1:5173` and verify that you can:

- see the `Customer workspace` heading,
- reveal the delivery note, and
- change the current rating to `2`.

Keep the server running when you return for review so we can inspect the page in
the browser together.

## Documentation

- [React `createRoot`](https://react.dev/reference/react-dom/client/createRoot)
- [Vite: Getting Started](https://vite.dev/guide/)
- [Bulletproof React project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done When

- `main.tsx` creates one React root from `rootElement`.
- That root renders `<App />`.
- The focused test, typecheck, production build, and stable suite pass.
- The page and both existing feature interactions work in the browser.
