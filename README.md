# Deliberate Coding Practice

An adaptive deliberate-practice workspace for becoming a stronger software engineer with TypeScript, Go, and React.

Each exercise combines implementation and testing. An AI tutor reviews the result, checks understanding, and chooses the next task based on the evidence rather than following a fixed difficulty ladder.

## Working agreement

- Work on one active exercise at a time.
- Write the important implementation code yourself.
- Every coding exercise includes both implementation and test work.
- Official documentation is allowed and normally provided in `TASK.md`.
- Do not use another AI to generate an exercise solution.
- Ask the tutor for hints when needed. Hints progress from questions and conceptual nudges to more concrete help.
- Run the acceptance commands before requesting a review.
- During review, be ready to explain the code or make a small change.

## Repository layout

Exercises are grouped by language and numbered in the order they are assigned. The repository currently begins with `exercises/typescript/001-summarize-user-activity`. Go, React, and longer-project directories will be added when those tracks begin.

Small exercises stay flat inside their task folder. Larger assignments can introduce their own `src` layout when that structure becomes useful.

## Common TypeScript commands

```sh
npm test
npm run test:watch
npm run typecheck
npm run check
```

Each exercise's `TASK.md` contains its specific command and acceptance criteria.
