# REACT-024: Reset a Controlled Draft

Status: complete

Target time: 30–40 minutes

Primary capabilities: coordinate multiple state transitions and retrieve behavior-test
authorship

## Goal

Build a customer-note feature in which typing creates a controlled draft and a separate
button returns the feature to its empty state. Then author one behavior test proving the
complete `empty → drafted → empty` transition.

This is an integration task, not a new forms lesson. It combines event, state, conditional
rendering, feature composition, and testing capabilities you have already practiced.

## Mental model

The feature has one source of truth and two ways to change it:

```text
type in CustomerNoteField ── set current text ──┐
                                                ├── note state ── rendered UI
click ClearDraftButton ───── set "" ───────────┘
```

The input value, clear-button availability, and status message must all be derived from the
same `note` state. Do not store a separate `isEmpty` value: it would duplicate information
React can derive from `note === ""`.

The shared components own their markup and prop wiring. The feature owns the workflow:

```text
components/customers → controlled field and reusable button
features/customers   → state, transitions, and composition
app                  → supplied feature placement
```

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Declare string state with `useState` | demonstrated | REACT-015 through REACT-023 |
| Store `event.currentTarget.value` from a typed change event | demonstrated | REACT-022 and REACT-023 |
| Pass named callbacks through component props | demonstrated | REACT-011 through REACT-019 |
| Set state from a button click | demonstrated | REACT-015 through REACT-019 |
| Render one of two messages from state | demonstrated | REACT-017, REACT-022, and REACT-023 |
| Compose supplied components inside a feature | demonstrated | REACT-018, REACT-019, and REACT-023 |
| Query controls by accessible role and name | demonstrated | REACT-023 starter and learner test |
| Fire change/click events and assert value, text, and absence | demonstrated | Prior supplied tests and REACT-023 |
| Coordinate typing and clearing around one state invariant | new | This is the task's single difficulty increase |

Test ownership is **starter plus learner cases**. The environment, cleanup, initial-state
example, queries, and element types are supplied. You author one transition test.

## Your task

### 1. Implement the feature

Edit `src/features/customers/draft-customer-note-feature.tsx` and replace `return null`.

The feature must:

- own one string state value named for the note and initialized to `""`,
- define a named `ChangeEvent<HTMLInputElement>` handler that stores
  `event.currentTarget.value`,
- define a separate named clear handler that restores the note to `""`,
- render a section labelled by a level-two heading named `Draft customer note`,
- compose the supplied `CustomerNoteField` with the current note and change handler,
- compose the supplied `ClearDraftButton`, disabling it exactly when the note is empty,
- pass the clear handler to the button without calling it during render, and
- display `No note started.` when empty, otherwise `Draft note: <note>`.

Keep both handlers and the state in the feature. Do not define components in the feature
file.

### 2. Author one behavior test

Keep the supplied initial-state test in
`src/features/customers/draft-customer-note-feature.test.tsx` and add one new `it` case.

Your test must perform and prove this sequence:

1. Render a fresh feature.
2. Locate `Customer note` as a textbox and `Clear draft` as a button.
3. Change the textbox to `Call customer tomorrow.`
4. Verify the input and `Draft note: Call customer tomorrow.` reflect the draft.
5. Verify the clear button is enabled, then click it.
6. Verify the input is empty, the button is disabled, and `No note started.` is visible.
7. Verify the earlier draft message is no longer present.

Choose a test name that describes the user-visible transition. Test public behavior; do not
inspect hooks or call either feature handler directly.

## Scope

- Edit only the feature and its test file.
- Do not change the supplied components, app, browser entry, or HTML.
- Do not add another state value, component, form, validation, submission, async work,
  routing, store, effect, or styling.
- Keep the shared-component → feature → app dependency direction.

Your first three implementation edits should be identifiable from prior work:

1. Add the note state inside the supplied feature function.
2. Add the typed change handler and the no-argument clear handler.
3. Replace `return null` with the labelled section and wire both supplied components.

The likely stuck point is synchronizing all rendered behavior after clearing. Trace every
consumer back to the single `note` value rather than adding more state.

## Start and verify

Run the focused test before editing. The supplied initial-state test should fail because the
feature currently renders nothing:

```bash
npx vitest run exercises/react/01-fundamentals/024-reset-controlled-draft
```

Implement the feature until the starter test passes, then add your transition test. Run the
focused command again and confirm both tests pass.

Afterward, run:

```bash
npm run typecheck
npx vite build exercises/react/01-fundamentals/024-reset-controlled-draft
npx vitest run --exclude 'exercises/typescript/006-protect-worker-capacity/**'
```

Stop the previous development server, then start this exercise:

```bash
npx vite exercises/react/01-fundamentals/024-reset-controlled-draft --host 127.0.0.1
```

Open the printed local URL. Type the note, clear it, and verify that the input, button, and
message move together through the complete state transition.

## Documentation

- [React: Reacting to input with state](https://react.dev/learn/reacting-to-input-with-state)
- [React: Responding to events](https://react.dev/learn/responding-to-events)
- [React: State as a snapshot](https://react.dev/learn/state-as-a-snapshot)
- [Testing Library: `ByRole`](https://testing-library.com/docs/queries/byrole/)
- [Testing Library: firing events](https://testing-library.com/docs/dom-testing-library/api-events/)
- [Vitest `expect`](https://vitest.dev/api/expect.html)
- [Bulletproof React project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- One feature-owned state value drives the controlled input, button availability, and
  conditional message.
- Typing enters the drafted state and clearing returns every consumer to the empty state.
- The supplied starter test and your learner-authored transition test both pass.
- Typecheck, production build, stable suite, and browser verification pass.
- No out-of-scope files or behavior are changed.
