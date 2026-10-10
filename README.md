# Deliberate Coding Practice

An adaptive deliberate-practice workspace for becoming a stronger software engineer with TypeScript, Go, and React.

Each exercise combines implementation and testing. An AI tutor provides guidance and
reviews the result, choosing the next task from evidence rather than a fixed difficulty ladder.

## Working agreement

- Keep one active task per track.
- Write the exercise implementation yourself; ask the tutor for explanations, hints,
  or a worked example when needed. Record assistance without treating it as independent mastery.
- Practice individual parts before combining them. Add difficulty from demonstrated readiness.
- Each task defines behavior, focused guidance, official docs, and acceptance commands.
- Run and inspect tests. Vary test authorship; unfamiliar test infrastructure is supplied.
- Keep tests beside the code they exercise. No mandatory written reflections or quizzes.

The TypeScript API-design track lives in [api-design/](api-design/README.md), with isolated
tooling and arc/exercise folders. The first two API-design exercises are complete.
Hono returns to focused exercises on individual parts before integrating a runnable API.
Existing Go and React assignments stay in place. See [AGENTS.md](AGENTS.md) for scope gates;
the local `.build-by-learning-state.md` records current evidence and next actions.

## Curriculum arcs

Every language track is divided into **arcs**: coherent phases that group related
capabilities and show what larger engineering outcome the exercises are building toward.
An arc is not a timebox, a fixed number of tasks, or merely a folder for one syntax topic.

Every arc uses the same mastery progression:

```text
introduce → guided practice → retrieval → transfer → integration → independent rebuild
```

The tutor scaffolds unfamiliar boundaries, then reduces help as evidence improves.
Assisted completion schedules focused retrieval. Closing an arc does not establish mastery
of unfinished or assisted work; carry those evidence gaps forward explicitly.

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
api-design/
  <numbered-arc>/
    <numbered-exercise>/
```

Go and React use the arc layout. Earlier TypeScript exercises remain in place; TS-008 is
paused. Evolving APIs reuse working code rather than copying an application for every task.

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

The separate API-design track uses `cd api-design && npm run check`; its unfinished
exercise tests do not run in the older tracks' suite.
