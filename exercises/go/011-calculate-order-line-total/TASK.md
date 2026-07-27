# GO-011: Calculate an Order-Line Total

Target time: 20–35 minutes  
Primary focus: model related data with a struct and read its fields

## Scope preflight

- New, guided: define a named struct and access fields with `value.Field`.
- New, guided: pass a struct value into a function.
- Previously used: `string`, `int`, functions, multiplication, and returns.
- Supplied: exact public contract and all tests.
- Deferred: branches, errors, loops, slices, methods, pointers, interfaces, and test writing.

Decision: **pass**. Struct values are the only raised difficulty.

## Why this matters

A struct groups values that describe one domain concept. An order line is more coherent as
one value than as separate SKU, price, and quantity parameters. This becomes the foundation
for models passed between handlers, services, and persistence code later.

## Mental model

A struct is a named type containing fields:

```go
type Coordinate struct {
	X int
	Y int
}
```

Given a value named `point`, its fields are read as `point.X` and `point.Y`.

Capitalized names are exported, meaning other packages can use them. This task requires an
exported type and exported fields. `OrderLine` is passed into the function by value; the
function receives a copy. It only needs to read fields, so pointers are unnecessary.

## Your task

Work only in `order_line.go`.

Define an exported struct named `OrderLine` with these exported fields:

| Field | Type | Meaning |
|---|---|---|
| `SKU` | `string` | Product identifier |
| `UnitPriceCents` | `int` | Price of one unit |
| `Quantity` | `int` | Number of units |

Then implement:

```go
func CalculateLineTotalCents(line OrderLine) int
```

Return the unit price multiplied by the quantity. Assume price and quantity are
non-negative. The SKU identifies the line but does not affect its total.

## Constraints

- Do not change or add tests.
- Do not use separate price and quantity parameters.
- Do not use branches, errors, methods, pointers, loops, slices, or helpers.
- Do not mutate the received struct.

## Documentation

- [A Tour of Go: structs](https://go.dev/tour/moretypes/2)
- [A Tour of Go: struct fields](https://go.dev/tour/moretypes/3)
- [A Tour of Go: struct literals](https://go.dev/tour/moretypes/5) — used by the tests

## Commands

Start here:

```sh
go test ./exercises/go/011-calculate-order-line-total -v
```

Before review:

```sh
gofmt -w exercises/go/011-calculate-order-line-total
npm run check:go
```

## Done when

All checks pass and you can explain why these fields belong in one struct and why this
function does not need a pointer.

When requesting review, report documentation, hints, previous-solution lookup, and outside
AI assistance.
