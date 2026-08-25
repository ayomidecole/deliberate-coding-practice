# GO-039: Get a Portfolio Company Contact

Target time: 45–65 minutes  
Primary focus: independently retrieve constructor-owned slice lookup

## Why this task exists

GO-038 correctly stretched your understanding of receiver methods, constructor-owned slice
state, and `range`, but that service lookup required substantial scaffolding. This task
retrieves the same mechanism once through a different resource before another difficulty
dimension is added.

The business domain stays consistent while the resource and field shape change. A contact
belongs to a portfolio company, so the nested route expresses real ownership:

```text
GET /portfolio-companies/:companyID/contacts/:contactID

path IDs → handler → service lookup → model → handler response
```

## Contract

Successful request:

```text
GET /portfolio-companies/company-305/contacts/contact-805
```

Successful response:

```json
{
  "id": "contact-805",
  "companyId": "company-305",
  "fullName": "Elena Costa",
  "role": "Chief Executive Officer",
  "email": "elena@example.com",
  "status": "active"
}
```

| Outcome | Response |
|---|---|
| no contact matches both path IDs | `404 Not Found`, `{"error":"company contact not found"}` |
| match | `200 OK` with every field from the service result |

## Your task

The status constant, handler DTO scaffolding, route setup, and tests are supplied. You own
the model, service, and handler behavior. Work in dependency order.

### 1. Model

In `models/company_contact.go`, define `CompanyContact` from the successful response using
idiomatic exported Go fields and types. Do not add JSON tags.

### 2. Service

In `services/company_contact_service.go`, define:

- `ErrCompanyContactNotFound` as a package-level error;
- `CompanyContactService` with a private `contacts []models.CompanyContact` field;
- `NewCompanyContactService(contacts []models.CompanyContact) *CompanyContactService`;
- `FindCompanyContact(companyID, contactID string) (models.CompanyContact, error)` using a
  pointer receiver.

The method must inspect the constructor-supplied contacts with one `range` loop, return a
complete contact only when both IDs match, and return the empty model plus the sentinel
error after the loop when no contact matches. Do not mutate the slice or hard-code records.

### 3. Handler

Implement `GetCompanyContact` in `handlers/company_contact_handler.go`:

1. read both IDs from their named path parameters;
2. call the service once;
3. use `errors.Is` to translate the not-found error into the documented `404`, then return;
4. return `200 OK` by projecting every service-result field into the supplied response DTO.

The handler must not search contacts or reproduce the composite matching rule.

## Scope preflight

- **Retrieved:** model translation, sentinel errors, Gin `GET`, path parameters, `404`
  mapping, response projection, and full handler flow.
- **Guided:** receiver, constructor-owned slice, and `range` lookup from GO-038.
- **New operations:** none.
- **Changed:** resource, fields, and identity names.
- **Held constant:** one endpoint, one loop, one error branch, supplied DTOs/tests, and no
  test-ownership increase.
- **Deferred:** collection responses, multiple business errors/statuses, reduced
  scaffolding, persistence, multiple endpoints, and `PATCH`.

Decision: **pass as one targeted retrieval**. Independent completion unlocks a later task
that raises another dimension.

## First three milestones

1. Define the model from the successful response.
2. Define the error, private service state, and constructor.
3. Implement the service lookup before the handler.

If you stall, identify which value represents the complete slice and which represents one
current contact. Consult the documentation before requesting a code scaffold.

## Documentation

1. [A Tour of Go: range](https://go.dev/tour/moretypes/16)
2. [A Tour of Go: slices](https://go.dev/tour/moretypes/7)
3. [A Tour of Go: methods](https://go.dev/tour/methods/1)
4. [Go: return and handle errors](https://go.dev/doc/tutorial/handle-errors)
5. [Gin routing](https://gin-gonic.com/en/docs/routing/)
6. [Gin path parameters](https://gin-gonic.com/en/docs/routing/param-in-path/)
7. [Gin `Context`](https://pkg.go.dev/github.com/gin-gonic/gin#Context)

## Verification

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/039-get-portfolio-company-contact/services -v
go test ./exercises/go/03-model-service-handler-reinforcement/039-get-portfolio-company-contact/... -v
gofmt -w exercises/go/03-model-service-handler-reinforcement/039-get-portfolio-company-contact/{constants,handlers,models,services}/*.go
npm run check:go
```

## Completion criteria

- You authored the model, service state/constructor, lookup loop, and handler behavior.
- The service matches both IDs and returns the documented sentinel error after the loop.
- The handler translates HTTP without owning lookup rules.
- Focused and workspace-wide Go checks pass.

Ask for review when finished and disclose any documentation, old-code, or AI help used.
No written reflection is required.
