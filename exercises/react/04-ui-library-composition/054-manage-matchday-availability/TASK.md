# REACT-054: Manage Matchday Availability

Status: active

Target time: 150–210 minutes. This is intentionally a longer integration task; use the
checkpoints rather than treating it as one sitting.

Primary capability: independently reconnect a wire contract, domain decoder, multiple
business components, and a stateful feature while authoring a shadcn Table for the first
time

## Goal

Build the first-team matchday availability desk for **Riverside Athletic vs Harbour City**.
The medical staff need to see the whole squad, inspect a player who still requires review,
and clear that player to play. The summary and table must immediately reflect the decision.

This is the integration transfer task for the current UI arc. You are building one complete
production path rather than studying another component in isolation.

## Ownership

You own every target implementation file:

- `src/types/matchday-squad-api.ts`
- `src/domain/matchday-squad.ts`
- `src/components/matchday/matchday-squad-summary.tsx`
- `src/components/matchday/player-availability-table.tsx`
- `src/components/matchday/player-review-sheet.tsx`
- `src/features/matchday/manage-matchday-availability-feature.tsx`

Routine imports, component prop contracts, application mounting, fixtures, styles, shadcn
source, and the complete test suite are supplied. The two `Record<string, unknown>` aliases
in the API file are compilation placeholders, not completed types. Do not edit the tests or
supplied infrastructure.

## How to use this task

Treat this as four connected milestones, not one large coding session:

- [ ] wire contract compiles against its supplied contract check,
- [ ] domain decoder tests pass,
- [ ] each business component test passes, and
- [ ] the feature workflow and full verification pass.

Finish a milestone before debugging the next one. The component and feature tests construct
the domain object, so an unfinished decoder can make every later test fail before React even
renders. In that situation, return to the domain checkpoint instead of debugging JSX.

The requirements below define inputs, outputs, visible behavior, and ownership. Unless an
exact string, semantic element, or library prop is part of the contract, choose your own
variable names and implementation structure.

Start with the JSON payload in Boundary 1 open beside the API type file. Your first three
steps are to author the player record, author the containing squad record, and then run the
supplied contract check. Do not open the fixture or domain file until that check passes.

## Scope preflight

| Operation | Capability evidence | Treatment here |
|---|---|---|
| Model a readonly snake_case wire contract | retrieved | author both shapes from supplied JSON |
| Decode nested API records into readonly domain objects | retrieved | independent retrieval |
| Pass domain values through business components | integrated | transfer |
| Derive rows and counts from state during render | retrieved | transfer |
| Coordinate several controlled components in a feature | retrieved | transfer |
| Control a Sheet from feature state | guided in REACT-053 | changed-context retrieval |
| Assemble shadcn Table parts | **new** | anatomy and reference supplied below |
| Author test infrastructure | not in scope | all tests supplied |

There is one new operation: assembling the Table. The task is longer because familiar
boundaries are being reconnected from scratch, not because several new protocols are
stacked together.

## System flow

```text
snake_case API record
        ↓
readonly domain objects
        ↓
feature-owned review state + derived rows
        ↓
summary + availability table + review Sheet
        ↓
user clears player → feature state changes → summary and table re-render
```

The domain object remains unchanged. A medical clearance made during this browser session
is workflow state, so the feature owns it.

## Business contract

The fixture starts with four players:

- two are `cleared`,
- Leon Okafor is `review_required`, and
- one is `unavailable`.

Only a `review_required` player can be opened for review. Clearing Leon changes his
effective availability to `cleared`, closes the Sheet, and changes the summary from
`2 of 4 players cleared` to `3 of 4 players cleared`.

## Boundary 1: author the API contract

Imagine that the backend returned this abridged JSON response. One representative player
is shown; the supplied runtime fixture contains four players with the same record shape.

```json
{
  "fixture_id": "fixture-riv-har-2049",
  "team_name": "Riverside Athletic",
  "opponent_name": "Harbour City",
  "competition": "Premier Division",
  "kickoff_label": "Saturday · 17:30",
  "players": [
    {
      "player_id": "player-mateo-silva",
      "display_name": "Mateo Silva",
      "shirt_number": 1,
      "position": "GK",
      "availability": "cleared",
      "medical_note": "Completed the full goalkeeper session."
    }
  ]
}
```

Input: this external JSON payload.

Output: two explicit readonly object types describing exactly what arrives over the wire.

Delete the permissive `Record<string, unknown>` placeholders and author both type aliases
from scratch in `src/types/matchday-squad-api.ts`. Preserve the JSON's snake_case field names.
Use its values to infer ordinary `string` and `number` fields, with these schema rules that
one response example cannot prove:

- position is `'GK' | 'DEF' | 'MID' | 'FWD'`,
- availability is `'cleared' | 'review_required' | 'unavailable'`, and
- `players` is a readonly array of `MatchdayPlayerApiRecord`.

Do not import domain types here. The API contract describes the external wire shape; the
domain boundary will translate it later.

Checkpoint:

```bash
npx tsc --noEmit -p exercises/react/04-ui-library-composition/054-manage-matchday-availability/tsconfig.contract.json
npx vitest run exercises/react/04-ui-library-composition/054-manage-matchday-availability/src/types
```

The first command is the meaningful type check. The contract-check file is supplied and is
not yours to edit. Before you implement the aliases, its two expected failures say
`Type 'false' does not satisfy the constraint 'true'`; both disappear when the shapes match.

## Boundary 2: build the domain boundary

Input: an `unknown` wire value.

Output: a validated `MatchdaySquad` whose application-facing properties are readonly and
camelCase.

Complete both constructors in `matchday-squad.ts` using only the supplied readers.

- `MatchdayPlayer` validates one unknown player record and translates its snake_case fields
  into the supplied camelCase properties.
- `MatchdaySquad` validates the fixture record, translates its scalar fields, and uses
  `readArray` to construct one `MatchdayPlayer` per wire player.
- Use the supplied literal unions as the allowed values for position and availability.
- Remove the placeholder throws and temporary `void` statements.

Do not mutate the incoming record or use type assertions to bypass runtime validation.

Checkpoint:

```bash
npx vitest run exercises/react/04-ui-library-composition/054-manage-matchday-availability/src/domain
```

## Boundary 3: build the business components

Work in the order below. Each component receives prepared values and reports intent; none
owns the medical-review workflow.

### Browser component previews

Once the domain checkpoint passes, start the exercise in the browser:

```bash
npx vite exercises/react/04-ui-library-composition/054-manage-matchday-availability --host 127.0.0.1
```

Use the supplied preview that matches the component you are currently building:

- `http://127.0.0.1:5173/?preview=summary`
- `http://127.0.0.1:5173/?preview=table`
- `http://127.0.0.1:5173/?preview=sheet`

The preview passes fixed domain values into one component so its UI appears as you author
it. Its callbacks intentionally do not change workflow state. Do not edit `src/app/app.tsx`;
the ordinary URL still mounts your real feature for Boundary 4 and final verification.

### MatchdaySquadSummary

Build a semantic header using the supplied `fixture-summary` styles:

- competition text,
- an `h3` named `{teamName} vs {opponentName}`,
- kickoff text,
- a Badge reading `{clearedCount} of {total players} players cleared`.

Use the Badge's `default` variant only when everyone is cleared; otherwise use `secondary`.

Checkpoint:

```bash
npx vitest run exercises/react/04-ui-library-composition/054-manage-matchday-availability/src/components/matchday/matchday-squad-summary.test.tsx
```

### PlayerAvailabilityTable — new Table protocol

The shadcn components preserve normal HTML table structure:

```text
Table
├── TableCaption
├── TableHeader
│   └── TableRow
│       └── TableHead × 5
└── TableBody
    └── rows.map(...)
        └── TableRow
            └── TableCell × 5
```

The five columns are **Player**, **Shirt**, **Position**, **Availability**, and **Action**.
Use `player.id` as each row key. Give the Table `aria-label="Player availability"`, and use
`Matchday player availability` as its caption.

Presentation mapping:

| Availability | Visible Badge text | Badge variant | Action cell |
|---|---|---|---|
| `cleared` | `Cleared` | `default` | `—` |
| `review_required` | `Review required` | `secondary` | outline Button named `Review {player name}` |
| `unavailable` | `Unavailable` | `destructive` | `—` |

The review Button reports `player.id` through `onReviewPlayer`. The table owns no state and
does not change a player.

Checkpoint:

```bash
npx vitest run exercises/react/04-ui-library-composition/054-manage-matchday-availability/src/components/matchday/player-availability-table.test.tsx
```

### PlayerReviewSheet

This retrieves the controlled Sheet protocol in a different arrangement: the trigger is
the review Button in the Table, so this Sheet has **no `SheetTrigger`**.

- Return `null` when there is no player to present.
- Otherwise render the supplied controlled `Sheet` and `onOpenChange` contract.
- The right-side content has title `Review {player name}` and description
  `Confirm the final medical decision for this player.`
- Present shirt number, position, and medical note in a `dl` using
  `className="player-review-details"`.
- Its footer contains a Button named `Clear to play` that reports `onClearPlayer`.

Remove the temporary `void` statements from all three components.

Checkpoint:

```bash
npx vitest run exercises/react/04-ui-library-composition/054-manage-matchday-availability/src/components/matchday/player-review-sheet.test.tsx
```

## Boundary 4: feature coordination

Input: one immutable `MatchdaySquad` domain object.

Output: a coordinated workspace whose summary, table, and Sheet agree after every action.

`ManageMatchdayAvailabilityFeature` owns the workflow. The following are business-state
requirements, not prescribed handler or variable names.

State starts as:

- no active player (`string | null`), and
- no additional cleared player ids (`readonly string[]`).

During each render, derive:

- one `PlayerAvailabilityRow` per domain player; a player included in the additional-clearance
  state has effective availability `cleared`, otherwise retain the domain value,
- the active player with `find`, and
- the cleared count from the derived rows.

Coordinate these user events:

- reviewing a row stores that player's id,
- a Sheet close request clears the active id,
- clearing the active player adds its id to the clearance state and clears the active id.

Compose the existing outer section in this shape:

```text
ManageMatchdayAvailabilityFeature
├── existing h2
├── MatchdaySquadSummary
├── div.availability-panel
│   └── PlayerAvailabilityTable
└── PlayerReviewSheet
```

Do not mutate the domain objects, duplicate component markup in the feature, or store the
derived rows, active player object, or cleared count in state.

Checkpoint:

```bash
npx vitest run exercises/react/04-ui-library-composition/054-manage-matchday-availability/src/features
```

If this fails, identify which boundary produced the wrong value: decoded domain data,
derived feature data, rendered component output, or an event callback. Avoid changing
multiple layers at once.

## Full verification

Before running everything, all four milestone checkboxes near the top should be accounted
for. The full run verifies their integration; it is not the best place to diagnose the
first unfinished boundary.

```bash
npx vitest run exercises/react/04-ui-library-composition/054-manage-matchday-availability
npx tsc --noEmit -p exercises/react/04-ui-library-composition/054-manage-matchday-availability/tsconfig.contract.json
npx tsc --noEmit -p exercises/react/04-ui-library-composition/054-manage-matchday-availability/tsconfig.json
npm run typecheck
npx vite build exercises/react/04-ui-library-composition/054-manage-matchday-availability
npx vite exercises/react/04-ui-library-composition/054-manage-matchday-availability --host 127.0.0.1
```

In the browser, review Leon Okafor and clear him. Confirm the Sheet closes, his table row
changes to `Cleared`, the review action disappears, and the summary becomes `3 of 4 players
cleared`.

## Documentation map

- **Usage guide:** [shadcn Table](https://ui.shadcn.com/docs/components/base/table) —
  component anatomy and ordinary composition
- **Local wrapper source:** `src/components/ui/table.tsx` — the exact Table exports available
  in this exercise
- **Usage guide:** [shadcn Sheet](https://ui.shadcn.com/docs/components/base/sheet) — Sheet
  composition and `side`
- **Underlying behavior/API:** [Base UI Dialog state](https://base-ui.com/react/components/dialog#state) —
  controlled `open` and `onOpenChange`
- **Local wrapper source:** `src/components/ui/badge.tsx` and `button.tsx` — available variants
- **React mental model:** [Choosing state structure](https://react.dev/learn/choosing-the-state-structure)

## Completion

Report what help or references you used. Completion requires the supplied tests, both
exercise typechecks, workspace typecheck, production build, and browser workflow to pass.
When requesting review, include the last checkpoint that passed so any failure can be
traced from the correct boundary.
