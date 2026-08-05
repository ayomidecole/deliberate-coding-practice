# REACT-025: Restore a Controlled Draft to Its Baseline

Status: complete

Target time: 30–40 minutes

Primary capabilities: independently retrieve a multi-transition state workflow and its
behavior test

## Goal

Build an order feature that begins with an existing delivery instruction, lets the user
draft a change, and restores the original instruction on demand. Then author one behavior
test proving the complete `original → changed → original` transition.

REACT-024 cleared state back to an empty string. This task changes the invariant: “reset”
now means returning to a non-empty baseline. No new React API or architecture boundary is
introduced.

## Mental model

The supplied constant is the baseline, while feature state is the current draft:

```text
ORIGINAL_DELIVERY_INSTRUCTION ── initializes ── current instruction state
typing ──────────────────────────────────────── sets a different string
Restore original click ──────────────────────── sets the baseline string again
```

The feature has two visual states:

```text
instruction === baseline  → restore disabled → Original delivery instruction.
instruction !== baseline  → restore enabled  → Unsaved instruction: <instruction>
```

Keep only the instruction in state. Whether it has changed can be calculated during render,
so a separate `isModified` state value would duplicate information and could fall out of
sync.

The ownership direction remains:

```text
components/orders → field/button markup and prop wiring
features/orders   → state, transitions, and workflow composition
app               → supplied feature placement
```

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Initialize string state from a supplied constant | known | Same `useState` operation with a non-empty string |
| Store a typed input event value | demonstrated | REACT-022 through REACT-024 |
| Reset state from a no-argument callback | demonstrated | REACT-024 with structural guidance |
| Derive button state and a message from string equality | demonstrated | REACT-024 derived both from `note === ""` |
| Compose supplied UI components inside a feature | demonstrated | REACT-018, REACT-019, REACT-023, and REACT-024 |
| Label a region through its visible heading | demonstrated | REACT-023 and REACT-024 |
| Query controls by accessible role and name | demonstrated | REACT-023 and REACT-024 tests |
| Use `getByText` for presence and `queryByText` for absence | demonstrated | REACT-024 after guided clarification |
| Fire change/click events and assert the resulting state | demonstrated | REACT-023 and REACT-024 |

There are no unfamiliar operations. The learning challenge is independently translating
the empty-string reset into a non-empty baseline invariant.

Test ownership is **starter plus learner cases**: the environment and initial-state test
are supplied; you author the changed-and-restored transition test. This is the same test
responsibility level as REACT-024, not an increase.

## Your task

### 1. Implement the feature

Edit `src/features/orders/edit-delivery-instruction-feature.tsx` and replace `return null`.
Keep the supplied `ORIGINAL_DELIVERY_INSTRUCTION` unchanged.

The feature must:

- own one string state value initialized from `ORIGINAL_DELIVERY_INSTRUCTION`,
- define a named `ChangeEvent<HTMLInputElement>` handler that stores
  `event.currentTarget.value`,
- define a separate named restore handler that stores the original instruction,
- render a section labelled by a level-two heading named `Edit delivery instruction`,
- compose the supplied `DeliveryInstructionField` with the current instruction and change
  handler,
- compose one supplied `RestoreInstructionButton`,
- disable that button exactly when the current instruction equals the original,
- pass the restore handler as the button callback, and
- display `Original delivery instruction.` when unchanged, otherwise
  `Unsaved instruction: <instruction>`.

Do not define components inside the feature file.

### 2. Author one behavior test

Keep the supplied initial-state test in
`src/features/orders/edit-delivery-instruction-feature.test.tsx` and add one new `it` case.

Your test must prove this sequence:

1. Render a fresh feature.
2. Locate `Delivery instruction` as a textbox and `Restore original` as a button.
3. Change the textbox to `Call on arrival.`
4. Verify the input and `Unsaved instruction: Call on arrival.` reflect the change.
5. Verify the original-status message is absent and the restore button is enabled.
6. Click the restore button.
7. Verify the input contains `Leave at loading dock.` and the button is disabled.
8. Verify `Original delivery instruction.` is visible and the unsaved message is absent.

Choose a test name describing the user-visible transition. Use `getBy...` for content that
must exist and `queryBy...` for content that must be gone.

## Scope

- Edit only the feature and its test file.
- Do not change the supplied constant, components, app, browser entry, or HTML.
- Do not add another state value, component, form, validation, submission, async work,
  routing, store, effect, or styling.
- Keep the shared-component → feature → app dependency direction.

Your first three implementation edits should be:

1. Declare the instruction state inside the supplied feature function.
2. Add the typed change handler and no-argument restore handler.
3. Replace `return null` with the labelled section and wire both supplied components.

The likely stuck point is deriving unchanged versus changed. Trace every consumer to this
single question: does the current instruction equal `ORIGINAL_DELIVERY_INSTRUCTION`?

## Start and verify

Run the focused test before editing. It should fail because the feature renders nothing:

```bash
npx vitest run exercises/react/025-restore-controlled-draft
```

Implement the feature until the starter test passes, then author the transition test. Run
the focused command again and confirm both tests pass.

Afterward, run:

```bash
npm run typecheck
npx vite build exercises/react/025-restore-controlled-draft
npx vitest run --exclude 'exercises/typescript/006-protect-worker-capacity/**'
```

Stop the previous development server, then start this exercise:

```bash
npx vite exercises/react/025-restore-controlled-draft --host 127.0.0.1
```

Open the printed local URL. Change the instruction, restore it, and verify that the field,
button, and message all return to the supplied baseline.

## Documentation

- [React: Reacting to input with state](https://react.dev/learn/reacting-to-input-with-state)
- [React: Choosing the state structure](https://react.dev/learn/choosing-the-state-structure)
- [React: Responding to events](https://react.dev/learn/responding-to-events)
- [Testing Library: `ByRole`](https://testing-library.com/docs/queries/byrole/)
- [Testing Library: appearance and disappearance](https://testing-library.com/docs/guide-disappearance/)
- [Testing Library: firing events](https://testing-library.com/docs/dom-testing-library/api-events/)
- [Vitest `expect`](https://vitest.dev/api/expect.html)
- [Bulletproof React project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- One feature-owned state value drives the controlled field, button availability, and
  conditional message.
- Editing enters the changed state and restoring returns every consumer to the original
  state.
- The supplied starter test and your learner-authored transition test both pass.
- Typecheck, production build, stable suite, and browser verification pass.
- No out-of-scope files or behavior are changed.
