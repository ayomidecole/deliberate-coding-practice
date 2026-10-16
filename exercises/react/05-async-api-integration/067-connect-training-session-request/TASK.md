# REACT-067 — Connect the training-session request

## Goal

Riverside's coaches need Thursday's pressing plan. Build the feature handler that
shows loading while the client works, then displays the session or absence. The
supplied catch displays failures so coaches can try another request.

This brings together the waiting from 065 and the outcome paths from 066. You own
the complete `try` block. No new API behavior or component is introduced.

## Your file

Open `src/features/training/retrieve-training-session-feature.tsx`.
Replace the single `void sessionId;` statement inside `loadSession`'s existing `try`
block with your implementation. Preserve the catch and everything outside that block.

The imported client, state declaration, named states, domain, components, mock API,
and tests are supplied. You do not implement fetching/decoding in this task.

## Behavior contract

`getTrainingSession(sessionId)` returns `Promise<TrainingSession | null>` and may
reject. After resolving it, the feature has either a model or `null`.

| Moment / outcome | State to pass to `setRequestState` |
|---|---|
| A request starts | `requestStates.loading` |
| The client resolves to `null` | `requestStates.notFound` |
| The client resolves to a model | `requestStates.success(theReturnedSession)` |
| The client rejects | Supplied catch handles it |

`theReturnedSession` describes your local variable, not a supplied identifier. Choose
your own variable name and a branch structure that fits the contract. The supplied
UI renders the state; it disables request controls while loading and clears old data
or errors when loading replaces the previous state.

**Start here:** set loading inside the `try` block. Then call the imported client
with the handler's `sessionId` and obtain the result before using it. Complete the
absence and success paths so each request reaches exactly one resolved outcome.

Before writing, predict the order for (a) a delayed existing session and (b) a delayed
missing session. After implementation, trace both through your own code. No extra
state variables, effects, imports, state objects, or test authorship required.

Try the first attempt from this contract. Official documentation and syntax references
are welcome; tell me what you consulted. If the value or execution flow becomes
unclear, bring that reasoning rather than repeatedly trying punctuation.

## Documentation

- [React: connect handlers to state](https://react.dev/learn/reacting-to-input-with-state#step-5-connect-the-event-handlers-to-set-the-state) — updates around an awaited request; use our supplied named states.
- [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#description) — Promise versus resolved result.
- [MDN: return](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return) — ending the current handler.
- [MDN: if…else](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) — alternative branch structure.
- [shadcn Button](https://ui.shadcn.com/docs/components/base/button) — supplied UI.

## Verify

From `/Users/Ruffio/Desktop/Learn to code`:

```bash
npx vitest run exercises/react/05-async-api-integration/067-connect-training-session-request/src/features/training/retrieve-training-session-feature.test.tsx
npx vitest run exercises/react/05-async-api-integration/067-connect-training-session-request
npx tsc --noEmit -p exercises/react/05-async-api-integration/067-connect-training-session-request/tsconfig.json
```

Completion: **7 feature tests / 25 total tests pass**, with typecheck passing. Tests
hold a request pending and change the returned model, so correct timing and data flow
matter even when the browser's example data looks familiar.

Verified starter: **16 passing, 9 failing tests**, typecheck passing.

The browser server is configured for 067. To restart, stop the previous Vite process:

```bash
npx vite exercises/react/05-async-api-integration/067-connect-training-session-request --config exercises/react/05-async-api-integration/067-connect-training-session-request/vite.config.mjs --port 5173 --strictPort
```

At [localhost:5173](http://localhost:5173/), confirm **REACT-067** in the header.
The starter buttons do nothing. Verify loading, Thursday's session, absence, the
deliberate 503 error, then recovery by loading Thursday again. Reload and repeat.

## Review

Tell me which help/references you used. In your code, identify when you have a Promise
versus a resolved model/null, and explain why absence cannot continue into success.
We will choose the next task from this implementation and explanation. One successful
attempt is useful evidence; delayed retrieval remains part of mastery.

Design lesson: the feature translates request progress and client outcomes into UI
state. Correct sequencing and exclusive branches make that contract reliable.

## Scope preflight

| Operation | Capability evidence / support |
|---|---|
| Loading and awaited client call | Correct after clarification in 065; client/signature/docs supplied |
| Model/null branches and state payload | Correct code in 066; explanation prompted; names/table retained |
| Exclusive resolved outcomes | Practised in 066; choose branch structure here |
| Catch, client, domain, components, server | Supplied |
| Tests and browser checks | Demonstrated workflow; harness supplied |

No new operation. Increased dimension: combine two previously isolated parts in one
handler. No additional branches, test ownership, or infrastructure work. First three
edits: loading, resolved client result, exclusive outcome handling. Likely stuck point:
using a pending value or letting absence reach success; predictions and focused tests
make those observable. Supply error handling rather than adding another responsibility.
