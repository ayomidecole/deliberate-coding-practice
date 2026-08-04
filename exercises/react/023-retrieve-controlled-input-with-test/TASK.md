# REACT-023: Retrieve a Controlled Input and Test It

Status: active

Target time: 30–40 minutes

Primary capabilities: retrieve feature-owned input state and author a behavior test

## Goal

Build a customer-contact feature from the controlled-input pattern you just learned, then
add a React behavior test that protects how the feature responds to successive edits.

This task introduces no new React implementation concept. The new responsibility is
authoring one test inside a supplied React Testing Library harness.

## Mental model

The ownership flow remains unchanged:

```text
ContactEmailField component → markup and prop wiring
EditContactEmailFeature     → state, event handler, and rendered workflow
App                         → feature composition
```

The feature receives a `ChangeEvent<HTMLInputElement>`, stores the input's current string,
and returns that state to the supplied controlled component.

The test observes the same contract as a user:

```text
arrange → render the feature
act     → edit the labeled input
assert  → inspect the input and visible workflow text
```

Test the public behavior rather than implementation details. Do not inspect hooks, call the
handler directly, or assert function names. The supplied starter test demonstrates the
environment, cleanup, render, accessible query, element type, and assertion style.

## Your task

### 1. Implement the feature

Edit `src/features/customers/edit-contact-email-feature.tsx` and replace `return null`.

The feature must:

- own one string state value initialized to `""`,
- define a named handler with a `ChangeEvent<HTMLInputElement>` parameter,
- store `event.currentTarget.value`,
- render a section labelled by a level-two heading named `Edit contact email`,
- compose the supplied `ContactEmailField` with the current email and handler, and
- display `No contact email entered.` when empty, otherwise `Draft email: <email>`.

### 2. Author one behavior test

Edit `src/features/customers/edit-contact-email-feature.test.tsx`. Keep the supplied test
and add one new `it` case proving that the latest edit wins:

- render a fresh feature,
- locate `Contact email` through its accessible `textbox` role,
- change it first to `first@example.com`, then to `latest@example.com`,
- verify the controlled input contains the latest address,
- verify `Draft email: latest@example.com` is visible, and
- verify the earlier draft text is no longer present.

Choose a clear test name and arrange the operations yourself using the supplied imports.

## Scope

- Edit only the feature and its test file.
- Do not change the supplied shared component, app, browser entry, or HTML.
- Do not define another component inside the feature.
- Do not add validation, submission, normalization, async work, routing, hooks, stores, or
  styling.
- Test ownership is **starter plus learner cases**: the harness and initial-state example
  are supplied; the successive-edit behavior case is yours.

The implementation operations are retrieved from REACT-022. The only new difficulty is
writing a React behavior test. If the test interaction is the likely stuck point, use the
official `fireEvent.change` documentation below before requesting a hint.

## Start and verify

Run the focused test before editing. The supplied starter test should initially fail because
the feature renders nothing.

```bash
npx vitest run exercises/react/023-retrieve-controlled-input-with-test
```

Implement the feature until the starter test passes, then add your successive-edit test.
Run the focused command again and confirm that both tests pass.

Afterward, run:

```bash
npm run typecheck
npx vite build exercises/react/023-retrieve-controlled-input-with-test
npx vitest run --exclude 'exercises/typescript/006-protect-worker-capacity/**'
```

Stop the previous development server, then start this exercise:

```bash
npx vite exercises/react/023-retrieve-controlled-input-with-test --host 127.0.0.1
```

Open `http://127.0.0.1:5173`, enter an email, replace it with another address, and verify
that the input and draft summary both show the latest value.

## Documentation

- [React TypeScript: DOM Events](https://react.dev/learn/typescript#typing-dom-events)
- [React: Controlling an input with state](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)
- [React Testing Library introduction](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library: `fireEvent.change`](https://testing-library.com/docs/dom-testing-library/api-events/#fireeventchange)
- [Vitest `expect`](https://vitest.dev/api/expect.html)
- [Bulletproof React project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- The feature owns the state and DOM event handler while composing the supplied component.
- The supplied starter test and your successive-edit test both pass.
- Your test proves the latest controlled value and visible summary without inspecting
  implementation details.
- Typecheck, production build, stable suite, and browser verification pass.
- No out-of-scope files or behaviors are changed.
