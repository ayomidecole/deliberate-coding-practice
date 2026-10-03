# Learning Workspace Instructions

## Learning philosophy and ownership

Apply these principles across TypeScript, Go, and React. The learner owns the reasoning
and implementation central to the learning target; they need not type every line.
Reuse established code and evolve working projects. Use isolated exercises or independent
rebuilds when evidence calls for transfer practice.

- Define tasks through the problem, observable contract, learning target, learner/AI
  ownership, focused guidance, and verification. Specify behavior precisely; leave
  implementation choices the learner is equipped to make. Explain unfamiliar operations
  without prescribing every step of a familiar algorithm.
- AI may supply setup, supporting code, and familiar repetition within the declared scope.
  Keep the target implementation learner-authored unless they request help completing it.
  The learner owns scoped decisions, meaningful test cases, review of generated code,
  execution, and diagnosis; scaffold these responsibilities when unfamiliar.
- Vary implementation, extension, and bounded review/debugging tasks. Reviewing generated
  solutions alone is insufficient evidence for a capability never implemented by the learner.
- Record assisted completion separately from independent capability. Retrieve the central
  concept later through a small changed problem. Judge progress by implementation, change,
  testing, and diagnosis; require no post-task written reflection or quiz.
- Pilot the task format and assistance balance in an evolving TypeScript/Hono API for
  roughly 3–5 meaningful changes. Evaluate ability to start, make decisions, modify prior
  work with less help, select tests, and diagnose failures, alongside learner experience.
  This is a methodology review window, not a mastery deadline. Go/React adopt the principles
  now; retain current assignments and defer broader redesign until pilot evidence exists.

## Exercise scope gates

For any work that creates, changes, reviews, or advances an exercise:

1. Use the `build-by-learning` skill and read `.build-by-learning-state.md` first.
2. Before assigning a task, report a scope preflight that lists every required operation
   as known, demonstrated, or new.
3. Reject or rescope a task with more than one unfamiliar, undemonstrated operation.
4. For a learner's first use of a protocol or framework, explain the mental model and
   relevant operations in `TASK.md`, link official documentation, provide minimal annotated
   snippets or partial scaffolding, and supply all unfamiliar test infrastructure.
   Do not provide a near-identical solution that reduces the task to literal copying.
5. Do not combine a new implementation boundary with new test-harness authorship.
6. Apply the five-minute start gate: the first edit must be identifiable from established
   knowledge or supplied guidance.
7. Apply a learning-value gate: completing the target must require at least one meaningful
   translation, choice, prediction, or debugging step. Pure copying is a walkthrough, not
   an exercise and not capability evidence.
8. Treat confusion before a meaningful attempt as task-design evidence, not learner
   failure. Pause and audit scope before escalating hints.
9. Keep the learner as author of target implementation code unless they explicitly ask
   Codex to implement it.
10. Classify every prerequisite using the capability ledger, not merely as familiar or new.
    A task with one new operation may use only retrieved capabilities or guided operations
    that are explicitly scaffolded. Otherwise, retrieve the guided capability without
    introducing another operation.
11. Count input states, branches, data transformations, side-effect boundaries, test
    responsibility, ambiguity, and scaffolding reduction as difficulty dimensions. Counting
    named methods or syntax alone is not a valid scope measure.
12. Before assignment, simulate the learner's first three edits and likely stuck point.
    Reject a task that raises more than one major dimension even if each operation has
    appeared before.
13. Optimize for mastery before novelty. Guided capabilities receive retrieval in a
    different task mode or context before another concept is added. Do not treat steady
    exposure to new topics as progress without delayed independent evidence.
14. From-scratch implementation is core practice, not a scope violation. Do not substitute
    repair tasks merely because a construction task was poorly designed; choose task mode
    from capability evidence and apply the same scope gates to every mode.
15. Scope debugging by defect interaction, not defect count. Until independent diagnosis
    is demonstrated, use one defect or independently observable failures; coupled defects
    require explicit tracing scaffolds.
16. Framework work requires a foundation checkpoint: independently reason about value
    types, function inputs/outputs, branches/returns, and basic compiler or test failures.
    Pause the framework when those prerequisites remain guided or produce repeated stalls.
17. When several fundamentals need work, sequence them into separate implementation and
    retrieval tasks. Never bundle a learner's list of weak capabilities into one capstone.
18. Distinguish learner context from curriculum direction. A diagnostic list informs the
    evidence audit but does not prescribe the next exercise unless the learner explicitly
    asks for those items to determine the reconstruction.
19. Vary test ownership deliberately: fully supplied tests, a starter test plus learner
    cases, learner-authored tests, and test-first tasks are all valid. Supply unfamiliar
    harness or boundary infrastructure. Treat increased test responsibility as a difficulty
    dimension and do not pair it with another major unfamiliar dimension.
20. Every exercise conclusion must include one concrete, task-specific system-design lesson
    connecting the local concept to boundaries, contracts, components, data flow,
    reliability, or ownership. This reflection does not expand implementation scope.

These gates are mandatory. Concision, passing tests, or a single topic label do not
override them.
