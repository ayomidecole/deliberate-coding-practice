# REACT-066 — Separate training-session outcomes

## Goal

Riverside's coaches load a training plan. When it exists, show it. When it does not,
show absence. A single request must finish in exactly one of those outcomes.

This retrieves **branch control after an awaited request**. The loading update,
awaited client call, catch, named states, UI, domain, and tests are supplied.
You own only the two resolved-outcome paths in the feature.

## Predict before editing

After the supplied client call finishes, `trainingSession` is either a validated
`TrainingSession` or `null`. Work through these two cases:

| Resolved value | Required final screen | Should success run? |
|---|---|---|
| `null` | Missing-session message | Predict |
| A session instance | Session title, focus, summary | Predict |

Changing React state requests a new render. It does not change where JavaScript
continues executing inside the current handler. Your branches must control which
state update can run.

## Your implementation

In `src/features/training/retrieve-training-session-feature.tsx`, find the supplied
awaited call inside `loadSession` and replace this placeholder immediately below it:

```ts
void trainingSession;
```

Replace that single statement with your outcome-handling code. It currently does
nothing with the returned value, so the starter screen stays loading.

Use the already supplied names:

| Condition | Value to pass to `setRequestState` |
|---|---|
| `trainingSession` is `null` | `requestStates.notFound` |
| A session was returned | `requestStates.success(trainingSession)` |

Choose a branch structure that makes these paths exclusive. You may use an early
exit or an `else` branch. Both are valid; explain your choice at review.

First edit: write the condition that identifies a missing session. Complete its
state update, then ensure the existing-session path receives an actual model.
The supplied loading update and awaited call should stay where they are. Preserve
the catch, client, helpers, components, fixtures, and tests. No object literals,
imports, async mechanics, or test authorship are assigned.

## Documentation

- [MDN: return](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return) — how an early exit affects the containing function.
- [MDN: if…else](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) — selecting an alternative path.
- [React: handlers and state](https://react.dev/learn/reacting-to-input-with-state#step-5-connect-the-event-handlers-to-set-the-state) — state changes around a request.
- [shadcn Button](https://ui.shadcn.com/docs/components/base/button) — supplied controls.

References are welcome. Try reasoning through the two values before opening a
previous completed handler; tell me which references/help you used.

## Check the behavior

Run from `/Users/Ruffio/Desktop/Learn to code`:

```bash
npx vitest run exercises/react/05-async-api-integration/066-separate-training-session-outcomes/src/features/training/retrieve-training-session-feature.test.tsx
npx vitest run exercises/react/05-async-api-integration/066-separate-training-session-outcomes
npx tsc --noEmit -p exercises/react/05-async-api-integration/066-separate-training-session-outcomes/tsconfig.json
```

Completion: **7 feature tests / 25 total tests pass**, with typecheck passing.
Verified starter: **17 passing, 8 failing tests**, typecheck passing.
Supplied tests check both fresh and repeated requests, so an earlier session cannot
remain on screen after a later missing-session result. The error catch remains supplied.

At [localhost:5173](http://localhost:5173/), check the header says **REACT-066**.
The server is configured for this task. To restart, stop the earlier Vite process:

```bash
npx vite exercises/react/05-async-api-integration/066-separate-training-session-outcomes --config exercises/react/05-async-api-integration/066-separate-training-session-outcomes/vite.config.mjs --port 5173 --strictPort
```

After implementation:

1. Load Tuesday: loading, then the session.
2. Load missing session: loading, then `No training session was found.` with no old session.
3. Try service outage: loading, then the 503 error.
4. Load Tuesday again: the session returns and the error clears. Reload and repeat.

## Review and design lesson

Trace the missing-session path statement by statement. Point out exactly why it
cannot run the success update. Then trace an existing-session result.

Explain why setting `notFound` alone would not stop a later success update if both
were reachable. The goal is reasoning about execution, not memorizing one layout.

Design lesson: mutually exclusive user outcomes require mutually exclusive execution
paths. A state setter changes the next render; your branch structure governs the handler.

## Scope preflight

| Operation | Evidence / support |
|---|---|
| Inspect resolved model or null | Guided in 064; call/await supplied |
| Choose named state and pass model | Used in 064; helpers and contract supplied |
| Keep absence/success paths exclusive | Guided in 064; sole retrieval target |
| Loading, awaited request, catch | Supplied; preserves 065's learning |
| Tests, browser, infrastructure | Known workflow; all harness authorship supplied |

No new operations. First three edits: missing-value condition, absence update,
exclusive success path. Likely stuck point: assuming a state update ends execution.
The two-case prediction and focused tests make that observable. Awaiting and decoding
are supplied rather than combined with this retrieval. Later work depends on evidence.
