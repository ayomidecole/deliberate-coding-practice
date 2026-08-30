# GO-047: Compose an Account Support API

Target time: 80–110 minutes  
Primary focus: author and compose multiple service/handler pairs

## Scenario

Build a small customer-support API for a SaaS company. One feature retrieves an account;
a separate feature lists support tickets belonging to an account.

You own both vertical slices:

```text
Account model → AccountService → AccountHandler
Ticket model  → TicketService  → TicketHandler
                                  ↓
                         newRouter composes both
```

The services do not call each other. Each service owns one business capability, each
handler owns its HTTP translation, and `newRouter` owns application construction.

## API contract

### Retrieve an account

```text
GET /accounts/:accountID
```

Success:

```json
{
  "id": "account-2101",
  "companyName": "Northstar Analytics",
  "plan": "enterprise",
  "status": "active"
}
```

Missing account:

```text
404 Not Found
{"error":"account not found"}
```

### List an account's tickets

```text
GET /accounts/:accountID/tickets
```

Success returns matching tickets in source order:

```json
[
  {
    "id": "ticket-8101",
    "accountId": "account-2101",
    "subject": "Export job is timing out",
    "priority": "high",
    "status": "open"
  }
]
```

No matching tickets is a successful empty collection: `200 OK` with `[]`.

## Your task

Work in dependency order. Do not combine the two services or handlers.

### 1. Models

Define `Account` in `models/account.go` and `Ticket` in `models/ticket.go` from the JSON
contracts above. Use exported Go fields without JSON tags.

### 2. Account service

In `services/account_service.go`, define:

```go
type AccountService struct {
    // private accounts slice
}

func NewAccountService(accounts []models.Account) *AccountService

func (service *AccountService) FindAccount(
    accountID string,
) (models.Account, error)
```

Retain the constructor input. Return the account whose `ID` matches, or an empty account
with the supplied `ErrAccountNotFound`. Do not mutate the source slice.

### 3. Ticket service

In `services/ticket_service.go`, define:

```go
type TicketService struct {
    // private tickets slice
}

func NewTicketService(tickets []models.Ticket) *TicketService

func (service *TicketService) ListTickets(accountID string) []models.Ticket
```

Retain the constructor input. Return tickets whose `AccountID` matches, preserving source
order. Return a non-nil empty slice when nothing matches. Do not mutate the source slice.

### 4. Account handler

In `handlers/account_handler.go`, define `AccountHandler`, its constructor, and:

```go
func (handler *AccountHandler) GetAccount(c *gin.Context)
```

Read `accountID` and call the account service once. Map `ErrAccountNotFound` to the
documented `404` and return. Guard any other non-nil error with `500 Internal Server
Error` and return. On success, use `newAccountResponseJSON` and return `200 OK`.

### 5. Ticket handler

In `handlers/ticket_handler.go`, define `TicketHandler`, its constructor, and:

```go
func (handler *TicketHandler) ListTickets(c *gin.Context)
```

Read `accountID`, call the ticket service once, map the result with
`newTicketCollectionResponseJSON`, and return `200 OK`.

### 6. Composition root

In `cmd/api/main.go`, define:

```go
func newRouter(
    accounts []models.Account,
    tickets []models.Ticket,
) *gin.Engine
```

Inside it:

1. construct `AccountService` and inject it into `AccountHandler`;
2. construct `TicketService` and inject it into `TicketHandler`;
3. create one engine with `gin.Default()`;
4. register both exact GET routes with the correct handler methods;
5. return the engine.

`main` is supplied. Routine imports, constants, the sentinel error, response mapping, seed
data, and all test infrastructure are supplied.

## Scope preflight

- **Known:** model definition, service-owned slices, lookup, filtering, sentinel errors,
  path parameters, DTO mapping, handler returns, GET registration, and `newRouter`.
- **Demonstrated:** item and collection flows; multiple methods on one feature pair.
- **New composition demand:** author two complete feature pairs and connect both to one
  application.
- **Held constant:** GET only; one item route and one collection route; no request body,
  mutation, query, persistence, interfaces, middleware authorship, route groups, or
  learner-authored test harness.
- **Supplied:** lifecycle code, imports, constants, error declaration, DTO mapping, seed
  data, and tests. No target model, service, or handler implementation is supplied.

First-three-edit simulation: define both models; build `AccountService`; build
`TicketService`. The likely stuck point is keeping each handler paired with the correct
service while wiring both into `newRouter`.

Decision: **pass**. Application breadth is the single raised dimension.

## What follows in this arc

GO-047 is not the arc exit. Later tasks will separately retrieve runnable POST, full
replacement with PUT, partial update with PATCH, and DELETE behavior before an independent
multi-verb API. They will be scoped from evidence rather than bundled into this task.

## Documentation

1. [Go module organization](https://go.dev/doc/modules/layout)
2. [A Tour of Go: range](https://go.dev/tour/moretypes/16)
3. [Go `append`](https://pkg.go.dev/builtin#append)
4. [Go `errors.Is`](https://pkg.go.dev/errors#Is)
5. [Gin routing](https://gin-gonic.com/en/docs/routing/)
6. [Gin path parameters](https://gin-gonic.com/en/docs/routing/param-in-path/)
7. [Gin testing](https://gin-gonic.com/en/docs/testing/)

## Verification

```sh
go test ./exercises/go/04-runnable-api-construction/047-compose-account-support-api/services -v
go test ./exercises/go/04-runnable-api-construction/047-compose-account-support-api/... -v
gofmt -w exercises/go/04-runnable-api-construction/047-compose-account-support-api/{cmd/api,constants,handlers,models,services}/*.go
npm run check:go
```

Then run:

```sh
go run ./exercises/go/04-runnable-api-construction/047-compose-account-support-api/cmd/api
```

Check:

```text
GET http://localhost:8080/accounts/account-2101
GET http://localhost:8080/accounts/missing
GET http://localhost:8080/accounts/account-2101/tickets
```

Confirm the outcomes are `200`, `404`, and `200`, then stop the server with `Ctrl+C`.

## Completion criteria

- You authored both models, both services, both handlers, and the complete `newRouter`.
- Account lookup returns the matching account or the documented error.
- Ticket listing filters by account and returns `[]` when empty.
- The router constructs and registers both independent feature pairs.
- Focused and workspace checks pass.
- Both features work through the live server.

Ask for review when finished and disclose documentation, old-code, or AI help used. No
written reflection is required.
