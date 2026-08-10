package jobcostapi

import (
	"errors"
	"net/http"

	jobstore "example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/020-build-in-memory-job-store"
	jobcost "example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/023-estimate-stored-job-cost"
	"github.com/gin-gonic/gin"
)

type jobCostRequestJSON struct {
	JobID              string `json:"jobId"`
	CostPerWorkerCents int    `json:"costPerWorkerCents"`
	BudgetCents        int    `json:"budgetCents"`
}

type jobCostResponseJSON struct {
	JobID           string `json:"jobId"`
	RequiredWorkers int    `json:"requiredWorkers"`
	TotalCostCents  int    `json:"totalCostCents"`
	WithinBudget    bool   `json:"withinBudget"`
}

type errorResponse struct {
	Error string `json:"error"`
}

type JobCostHandler struct {
	store *jobstore.JobStore
}

func NewRouter(store *jobstore.JobStore) *gin.Engine {
	router := gin.New()
	handler := &JobCostHandler{store: store}

	router.POST("/api/job-cost-estimates", handler.estimateJobCost)

	return router
}

func (handler *JobCostHandler) estimateJobCost(c *gin.Context) {
	var body jobCostRequestJSON

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Error: "invalid request"})
		return
	}

	estimate, err := jobcost.EstimateJobCost(
		handler.store,
		body.JobID,
		body.CostPerWorkerCents,
		body.BudgetCents,
	)

	if errors.Is(err, jobstore.ErrJobNotFound) {
		c.JSON(http.StatusNotFound, errorResponse{Error: "job not found"})
		return
	}

	c.JSON(http.StatusOK, newJobCostResponse(estimate))

}

func newJobCostResponse(estimate jobcost.CostEstimate) jobCostResponseJSON {
	return jobCostResponseJSON{
		JobID:           estimate.JobID,
		RequiredWorkers: estimate.RequiredWorkers,
		TotalCostCents:  estimate.TotalCostCents,
		WithinBudget:    estimate.WithinBudget,
	}
}
