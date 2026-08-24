# GO-037: Add a Portfolio Company

Target time: 50–70 minutes  
Primary focus: full-slice ownership with a guided `PUT` resource boundary

## API context

Implement one complete stateless boundary for a portfolio-company management API:

```text
PUT /funds/:fundID/portfolio-companies/:companyID

path + JSON → handler → service → model → handler response
```

The client already knows the fund and company IDs, so the URI identifies the exact
portfolio-company resource it wants to create. `PUT` is appropriate when a client asks the
server to create or replace the state at a known URI. This exercise covers the creation
case and returns `201 Created`; persistence will later distinguish creation from replacement.

The service validates the company profile and assigns its initial status. It does not store
the company yet—real storage, retrieval, and editing begin in the persistence arc.

## Contract

Request body for `PUT /funds/fund-305/portfolio-companies/company-805`:

```json
{
  "name": "Meridian Health",
  "sector": "healthtech",
  "headquartersCountry": "Portugal"
}
```

Successful response:

```json
{
  "id": "company-805",
  "fundId": "fund-305",
  "name": "Meridian Health",
  "sector": "healthtech",
  "headquartersCountry": "Portugal",
  "status": "active"
}
```

| Outcome | Response |
|---|---|
| malformed JSON | `400 Bad Request`, `{"error":"invalid request"}` |
| empty company name | `422 Unprocessable Entity`, `{"error":"company name is required"}` |
| success | `201 Created` with every field from the service result |

## Your task

Work in dependency order. The status constant, handler DTO scaffolding, route setup, and all
tests are supplied. You own the model, service, and handler behavior.

### 1. Model

In `models/portfolio_company.go`, define `PortfolioCompany` by translating the successful
response into idiomatic exported Go fields and types. Do not add JSON tags.

### 2. Service

In `services/portfolio_company_service.go`, define:

- `ErrInvalidCompanyName` as a package-level error;
- an empty `PortfolioCompanyService` type;
- `NewPortfolioCompanyService() *PortfolioCompanyService`;
- `RegisterPortfolioCompany(fundID, companyID, name, sector, headquartersCountry string) (models.PortfolioCompany, error)`.

The method must:

1. return an empty model and `ErrInvalidCompanyName` when `name == ""`;
2. otherwise return a complete model with `Status` set to
   `constants.PortfolioCompanyStatusActive`.

### 3. Handler

Implement the supplied `PutPortfolioCompany` method in
`handlers/portfolio_company_handler.go`:

1. bind the request DTO and return the documented `400` response on failure;
2. call the service with `fundID` and `companyID` from the path, followed by the three
   request fields;
3. translate `services.ErrInvalidCompanyName` with `errors.Is`, then return the documented
   `422` response;
4. return `201 Created` by projecting every field from the service result.

Do not validate the company name in the handler. The two IDs come from the path, the profile
comes from JSON, and the status comes from the service result.

## Scope preflight

- **Demonstrated:** model construction, service validation, package errors, Gin binding,
  path parameters, handler delegation, error mapping, and response projection.
- **Guided/new:** `PUT` resource semantics. The route and HTTP tests are supplied.
- **Held constant:** one endpoint, one error branch, familiar layers, supplied DTO
  scaffolding, and fully supplied tests.
- **Deferred:** persistence, collection retrieval, not-found behavior, partial-update DTOs,
  multi-endpoint coordination, interfaces, middleware, goroutines, and channels.

Decision: **pass**. One protocol operation changes while implementation mechanics remain
retrieved and scaffolded.

## First three milestones

1. Define the model from the successful response.
2. Implement the service contract.
3. Implement the handler after the service package compiles.

The likely data-source mistake is mixing boundaries: `fundID` and `companyID` come from the
path, profile fields come from JSON, and `status` comes from the service.

## Documentation

1. [RFC 9110: PUT](https://www.rfc-editor.org/rfc/rfc9110.html#name-put)
2. [A Tour of Go: structs](https://go.dev/tour/moretypes/2)
3. [A Tour of Go: methods](https://go.dev/tour/methods/1)
4. [Go: return and handle errors](https://go.dev/doc/tutorial/handle-errors)
5. [Gin routing](https://gin-gonic.com/en/docs/routing/)
6. [Gin path parameters](https://gin-gonic.com/en/docs/routing/param-in-path/)
7. [Gin binding](https://gin-gonic.com/en/docs/binding/binding-and-validation/)
8. [Gin `Context`](https://pkg.go.dev/github.com/gin-gonic/gin#Context)

## Verification

```sh
go test ./exercises/go/03-model-service-handler-reinforcement/037-add-portfolio-company/services -v
go test ./exercises/go/03-model-service-handler-reinforcement/037-add-portfolio-company/... -v
gofmt -w exercises/go/03-model-service-handler-reinforcement/037-add-portfolio-company/{constants,handlers,models,services}/*.go
npm run check:go
```

## Completion criteria

- You authored the model, service, and complete handler behavior.
- The service rejects an empty name and assigns the active status.
- The handler owns HTTP translation but no company business rules.
- Success uses every field from the service result.
- Focused and workspace-wide Go checks pass.

Ask for review when finished and disclose any documentation, old-code, or AI help used.
No written reflection is required.
