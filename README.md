# Deliberate Coding Practice

An adaptive deliberate-practice workspace for becoming a stronger software engineer with TypeScript, Go, and React.

Tasks develop implementation, design, testing, and debugging through focused changes to
working systems. An AI tutor scopes and reviews the work using evidence of increasing
independence.

## Working agreement

- Keep one active task per track.
- Each task states its problem, contract, learning target, ownership, guidance, and checks.
- Write the central learning target; reuse familiar code and use AI for declared supporting
  work. Ask for hints or completion help when needed; assistance informs later practice.
- Own scoped decisions, review generated code, and run/debug acceptance checks. Test
  authorship varies with the learning target and unfamiliar infrastructure is supplied.
- Use focused official documentation in `TASK.md`. No mandatory written reflections or quizzes.

The TypeScript track is moving to an evolving Hono API design project. Its learning goals
and curriculum will be defined before assignment, beginning with a focused Hono introduction.
The first roughly 3–5 meaningful changes will pilot this task format and assistance balance.
Existing Go and React assignments stay in place. See [AGENTS.md](AGENTS.md) for scope gates;
the local `.build-by-learning-state.md` records current evidence and next actions.

## Curriculum arcs

Every language track is divided into **arcs**: coherent phases that group related
capabilities and show what larger engineering outcome the exercises are building toward.
An arc is not a timebox, a fixed number of tasks, or merely a folder for one syntax topic.

Capabilities generally progress through:

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
```

Go and React use the arc layout. Existing TypeScript exercises remain in place while the
Hono project's structure is decided. Evolving projects need not be copied into a new folder
for every task.

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
