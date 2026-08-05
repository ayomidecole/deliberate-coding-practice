# REACT-027: Own a Validation Rule in Domain

Status: active

Target time: 25–35 minutes

Primary capability: introduce domain ownership for a stable validation invariant

## Goal

Implement a shipment-reference rule in the new `src/domain` boundary and add three focused
unit-test cases. A supplied React feature will consume the rule and turn its boolean result
into user-visible validation feedback.

This is our first React exercise using `domain`. The published Bulletproof React structure
emphasizes one-way dependencies from shared code into features and then the app. Our
team-aligned variant names stable business rules `domain` rather than placing them in a
generic `utils` or `types` folder.

## Mental model

The domain owns the meaning of a valid shipment reference:

```text
raw reference → remove surrounding whitespace → count characters → valid or invalid
```

The dependency and data flow are:

```text
components/shipments  → reusable input markup and callback prop
domain/shipments      → pure shipment-reference invariant
features/shipments    → input state + domain decision + visible feedback
app                   → feature placement
```

`domain` does not import React, components, or features. It receives a value and returns a
decision. The feature may depend on both the shared component and the domain rule.

The feature keeps only the raw reference in state. Validity is calculated during render by
calling the domain function, so there is no second state value that could become stale.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Receive a typed string and return a boolean | known | TypeScript function work throughout both tracks |
| Remove surrounding whitespace with `trim()` | demonstrated | TS-002 normalization |
| Read a string's `.length` | demonstrated | REACT-007 and later string work |
| Combine inclusive minimum/maximum comparisons | demonstrated | TS-004 boundary validation |
| Express a general invariant rather than enumerate examples | demonstrated | TS-004 |
| Add `it` cases with direct boolean assertions | demonstrated | TypeScript tests and REACT-026 |
| Select lower, upper, and just-outside boundary inputs | demonstrated | TS-004's boundary partitions |
| Put a reusable business rule in `domain` | **new** | Mental model, dependency diagram, supplied signature and consumer |
| Connect the rule to controlled React UI | supplied | Feature, component, app, and behavior tests are complete |

The only unfamiliar operation is deciding ownership at the new `domain` boundary. String
normalization, range validation, React state, and the testing mechanics have already been
demonstrated.

Test ownership is **starter plus learner cases**. The imports, suite, and one below-minimum
case are supplied; you add three boundary cases. This keeps testing in your workflow while
the new architecture boundary remains the only major difficulty increase.

## Your task

### 1. Implement the domain invariant

Edit `src/domain/shipments/is-valid-shipment-reference.ts` and replace the `false`
placeholder.

`isValidShipmentReference(reference)` must return `true` exactly when the reference:

- contains at least 6 characters after surrounding whitespace is removed, and
- contains at most 12 characters after surrounding whitespace is removed.

Both 6 and 12 are valid. Do not modify the original string; normalization is only for the
decision.

### 2. Add three unit-test cases

Keep the supplied harness and starter case in
`src/domain/shipments/is-valid-shipment-reference.test.ts`. Add exactly three `it` cases
proving:

1. the 6-character lower boundary is accepted even with surrounding whitespace,
2. the 12-character upper boundary is accepted, and
3. a 13-character reference is rejected.

Choose the concrete reference strings and descriptive test names yourself. Assert the
function's returned boolean directly.

## Scope

- Edit only the domain implementation and its unit-test file.
- Do not change the function signature, supplied starter case, component, feature, app,
  feature tests, browser entry, or HTML.
- Do not store validity in React state or move the rule into the component or feature.
- Do not use regular expressions, loops, arrays, throwing, coercion, mutation, dependencies,
  forms, submission, async work, routing, effects, stores, or styling.
- Preserve `domain → feature → app`: the domain file must not import from higher layers.

Your first three edits should be:

1. Create a local normalized reference inside the supplied domain function.
2. Replace `return false` with the inclusive 6-through-12 decision.
3. Add the three learner-owned boundary cases to the supplied test suite.

The likely stuck point is applying the boundaries to the normalized value. For every case,
predict `reference.trim().length` before predicting the returned boolean.

## Start and verify

Run the focused tests before editing:

```bash
npx vitest run exercises/react/027-own-domain-validation-rule
```

The supplied tests should fail because the placeholder rejects every reference. Implement
the domain rule first, then add your three cases and rerun the focused command.

Afterward, run:

```bash
npm run typecheck
npx vite build exercises/react/027-own-domain-validation-rule
npx vitest run --exclude 'exercises/typescript/006-protect-worker-capacity/**'
```

For the browser check, stop the previous development server and run:

```bash
npx vite exercises/react/027-own-domain-validation-rule --host 127.0.0.1
```

Open the printed local URL. Try a short reference, a valid reference with surrounding
spaces, and a long reference. The raw input should remain exactly as typed while the feature
uses the normalized domain decision.

## Documentation

- [Bulletproof React: project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- [React: choosing the state structure](https://react.dev/learn/choosing-the-state-structure)
- [MDN: `String.prototype.trim()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim)
- [Vitest: `expect`](https://vitest.dev/api/expect)

## Done when

- The domain function represents the normalized inclusive 6-through-12 invariant.
- The supplied below-minimum case and your three boundary cases pass.
- The supplied feature tests prove the domain decision reaches user-visible React behavior.
- The domain layer remains pure and has no upward imports.
- Focused tests, typecheck, production build, stable suite, and browser checks pass.
- No out-of-scope file or behavior is changed.
