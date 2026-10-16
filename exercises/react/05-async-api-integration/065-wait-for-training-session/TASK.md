# REACT-065 — Wait for a training session

## Goal

Riverside's coaches click to load a training plan. While it is being retrieved,
they should see loading and disabled controls. Once the request finishes, they
should see the session, absence, or an error.

This task focuses on **when a requested value becomes available**. The browser API
waits about 1.2 seconds so you can observe the pending screen.

## Your file and first edit

Work only in `src/features/training/retrieve-training-session-feature.tsx`.
Inside `loadSession`'s `try`, replace this temporary placeholder:

```ts
let trainingSession: TrainingSession | null = null;
```

The placeholder keeps the starter valid TypeScript but does not make a request.
Your replacement must start loading, call the imported `getTrainingSession` using
`sessionId`, and obtain its resolved result in a variable named `trainingSession`.
Keep that name because the supplied outcome branches below use it.

Preserve those branches, their early return, the catch, state helpers, and JSX. The
client, domain, components, mock server, and all tests are supplied. No client repair
or branch construction is assigned here.

## Predict, then implement

Before editing, answer these briefly in chat or keep notes for review:

1. While the client request is pending, what should the screen display?
2. Does calling an async client immediately give you a session, or a Promise?
3. When is it valid for the supplied `if (!trainingSession)` branch to inspect the result?

An async function gives its caller a Promise. Awaiting it lets the current handler
continue with the resolved value. React can render the loading state while the
handler is waiting. The rest of the page remains responsive.

Your first edit: use the supplied loading state before starting the wait. Then
replace the placeholder with the client call and result handling needed to satisfy
the predictions. Choose the ordering yourself; do not copy the previous handler.

| Supplied name | Purpose |
|---|---|
| `setRequestState` | Changes the screen state |
| `requestStates.loading` | Named loading state; no object literal to write |
| `getTrainingSession(sessionId)` | Starts the request; returns `Promise<TrainingSession \| null>` |
| `trainingSession` | Must hold the resolved session or `null` before the supplied branches run |

Focus on distinguishing a pending operation from its result. If that is unclear,
bring your prediction before trying more syntax.

## Documentation

- [MDN: await — description](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#description): what the expression produces and what pauses.
- [React: connect event handlers to state](https://react.dev/learn/reacting-to-input-with-state#step-5-connect-the-event-handlers-to-set-the-state): state updates around an awaited request.
- [shadcn Button](https://ui.shadcn.com/docs/components/base/button): supplied controls.

The React example uses different state names; use our existing `requestStates` variable.
You do not need to learn Promise construction, `.then`, effects, timers, or testing
infrastructure for this task. The tests control request timing for you.

## Verify behavior

Run from `/Users/Ruffio/Desktop/Learn to code`:

```bash
npx vitest run exercises/react/05-async-api-integration/065-wait-for-training-session/src/features/training/retrieve-training-session-feature.test.tsx
npx vitest run exercises/react/05-async-api-integration/065-wait-for-training-session
npx tsc --noEmit -p exercises/react/05-async-api-integration/065-wait-for-training-session/tsconfig.json
```

Completion: **7 feature tests / 25 total tests pass**, with typecheck passing.
Verified starter: **16 passing, 9 failing tests**, typecheck passing.
The supplied loading test holds the request pending and checks that controls stay
disabled until resolution; a fast response cannot accidentally hide incorrect ordering.

The server is configured for 065. To restart, stop the old Vite process and run:

```bash
npx vite exercises/react/05-async-api-integration/065-wait-for-training-session --config exercises/react/05-async-api-integration/065-wait-for-training-session/vite.config.mjs --port 5173 --strictPort
```

At [localhost:5173](http://localhost:5173/), confirm **REACT-065** in the header.
The starter currently jumps to absence without requesting data. When finished:

1. Load Tuesday: observe loading, disabled buttons, then the training plan.
2. Load missing session: observe loading first, then absence.
3. Try service outage: observe loading, then the 503 error and enabled controls.
4. Load Tuesday again: the old error clears while loading, then the session returns.

## Review

Compare your predictions with the screen. Explain what the variable would contain
if you removed the wait, and why the outcome branches must run after resolution.
Tell me which references/help you used. A short implementation can pass this exercise;
your reasoning and the timing test provide the capability evidence.

Design lesson: starting a request and receiving its result are separate moments.
The feature owns what the user sees between them; the client owns HTTP decoding.

## Scope preflight

| Operation | Evidence / support |
|---|---|
| Named loading state and client argument | Known; used in 064; names supplied |
| Await client; use resolved result | Guided in 064; sole retrieval target |
| Absence/success branches, catch, rendering | Supplied; no additional learner responsibility |
| Tests and browser checks | Demonstrated workflow; controlled timing infrastructure supplied |
| HTTP/body/domain implementation | Supplied and tested |

No new operations or harness authorship. First three actions: predict pending behavior,
set loading, obtain a resolved result for the supplied branches. Likely stuck point:
treating the immediate return from an async call as the finished session. The controlled
pending test makes that distinction observable. Branch exits will be retrieved separately;
we choose later work from this review.
