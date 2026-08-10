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

## Curriculum arcs

Every language track is divided into **arcs**: coherent phases that group related
capabilities and show what larger engineering outcome the exercises are building toward.
An arc is not a timebox, a fixed number of tasks, or merely a folder for one syntax topic.

Every arc uses the same mastery progression:

```text
introduce → guided practice → retrieval → transfer → integration → independent rebuild
```

The tutor introduces and scaffolds unfamiliar boundaries, then reduces help as evidence
improves. Assisted completion schedules another retrieval task. An arc ends only after the
learner can implement, test, debug, and transfer its capabilities in a changed context;
finishing an arbitrary task count is not enough.

Arc roadmaps are provisional. Before entering the next arc, review the learner's evidence,
current goals, likely first edits, and likely stuck points. Rescope or reorder the roadmap
when that evidence supports a better progression.

## Repository layout

The target layout groups exercises by language, numbered arc, and assignment order:

```text
exercises/
  go/
    <numbered-arc>/
      <numbered-exercise>/
  react/
    01-fundamentals/
    02-data-boundaries/
    03-layered-integration/
  typescript/
    <numbered-arc>/
      <numbered-exercise>/
projects/
```

React already uses the arc layout. Go and TypeScript will adopt it after their respective
learning chats review the existing evidence and define appropriate arc boundaries.

Small exercises stay flat inside their task folder. Larger assignments can introduce their own `src` layout when that structure becomes useful.

## Common TypeScript commands

```sh
npm test
npm run test:watch
npm run typecheck
npm run check
```

Each exercise's `TASK.md` contains its specific command and acceptance criteria.

## Common Go commands

```sh
go test ./...
go vet ./...
gofmt -w exercises/go
```

Run `npm run check` for the full TypeScript and Go repository acceptance suite.
