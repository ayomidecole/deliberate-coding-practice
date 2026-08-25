# GO-038: Get a Portfolio Company by ID

Target time: 50–70 minutes  
Primary focus: retrieve a nested resource through the model/service/handler layers

## API context

Implement one read endpoint for the portfolio-company management API:

```text
GET /funds/:fundID/portfolio-companies/:companyID

path IDs → handler → service lookup → model → handler response
```

Both path values identify the requested resource. A matching `companyID` under a different
fund is not a match. `GET` reads and returns a representation; it must not modify the
supplied company slice.

For this retrieval exercise, the service receives a read-only slice through its constructor.
That slice is temporary learning scaffolding, not our final persistence architecture. A
later arc will replace it with an explicit persistence dependency.

## Contract

Successful request:

```text
GET /funds/fund-305/portfolio-companies/company-805
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
| no company matches both path IDs | `404 Not Found`, `{"error":"portfolio company not found"}` |
| match | `200 OK` with every field from the service result |

## Your task

Work in dependency order. The status constant, handler DTO scaffolding, route setup, and all
tests are supplied. You own the model, service, and handler behavior.

### 1. Model

In `models/portfolio_company.go`, define `PortfolioCompany` from the successful response
using idiomatic exported Go fields and types. Do not add JSON tags.

### 2. Service

In `services/portfolio_company_service.go`, define:

- `ErrPortfolioCompanyNotFound` as a package-level error;
- `PortfolioCompanyService` with a private `companies []models.PortfolioCompany` field;
- `NewPortfolioCompanyService(companies []models.PortfolioCompany) *PortfolioCompanyService`;
- `FindPortfolioCompany(fundID, companyID string) (models.PortfolioCompany, error)` using a
  pointer receiver.

The lookup must:

1. inspect the supplied companies with one `range` loop;
2. return the complete company and `nil` only when both `FundID` and `ID` match;
3. return an empty model and `ErrPortfolioCompanyNotFound` after the loop when none match.

Do not mutate the slice or create hard-coded company records inside the service.

### 3. Handler

Implement the supplied `GetPortfolioCompany` method in
`handlers/portfolio_company_handler.go`:

1. read `fundID` and `companyID` from the path;
2. call the service once with those IDs;
3. translate `services.ErrPortfolioCompanyNotFound` with `errors.Is`, return the documented
   `404`, and stop execution;
4. return `200 OK` by projecting every field from the service result.

The handler must not search the slice or reproduce the service's matching rule.

## Scope preflight

- **Known:** structs, constructors, pointer receivers, slices, `range`, sentinel errors,
  Gin `GET`, path parameters, `404` mapping, and response DTOs.
- **Demonstrated:** GET lookup in GO-006, slice-backed lookup in GO-020, dependency injection
  in GO-021, and complete layered ownership through GO-037.
- **New operations:** none.
- **Raised dimension:** composite lookup using both fund and company identity.
- **Held constant:** one endpoint, one loop, one error branch, supplied DTO scaffolding,
  and fully supplied tests.
- **Deferred:** mutation, persistence interfaces, collection responses, query parameters,
  multiple endpoints, learner-authored tests, and `PATCH`.

Decision: **pass**. This retrieves demonstrated collection lookup inside the familiar
layered architecture.

## First three milestones

1. Define the model from the successful response.
2. Define the service field, error, and constructor.
3. Implement the lookup before writing the handler.

The likely lookup bug is checking only `companyID`. The not-found return belongs after the
loop so every candidate has a chance to match.

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
go test ./exercises/go/03-model-service-handler-reinforcement/038-get-portfolio-company-by-id/services -v
go test ./exercises/go/03-model-service-handler-reinforcement/038-get-portfolio-company-by-id/... -v
gofmt -w exercises/go/03-model-service-handler-reinforcement/038-get-portfolio-company-by-id/{constants,handlers,models,services}/*.go
npm run check:go
```

## Completion criteria

- You authored the model, service, lookup loop, and complete handler behavior.
- The service matches both path identities and returns the documented not-found error.
- The handler owns HTTP translation but no lookup rule.
- The supplied slice remains unchanged.
- Focused and workspace-wide Go checks pass.

Ask for review when finished and disclose any documentation, old-code, or AI help used.
No written reflection is required.
