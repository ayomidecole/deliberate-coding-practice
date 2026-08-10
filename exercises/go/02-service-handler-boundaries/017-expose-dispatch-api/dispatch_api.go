package dispatchapi

import (
	"errors"
	"net/http"

	dispatch "example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/016-plan-job-dispatch"
	"github.com/gin-gonic/gin"
)

type dispatchRequestJSON struct {
	JobID            string `json:"jobId"`
	RequiredWorkers  int    `json:"requiredWorkers"`
	AvailableWorkers int    `json:"availableWorkers"`
	Attempts         int    `json:"attempts"`
	MaxAttempts      int    `json:"maxAttempts"`
}

type dispatchPlanJSON struct {
	JobID            string `json:"jobId"`
	Status           string `json:"status"`
	WorkersAssigned  int    `json:"workersAssigned"`
	RemainingWorkers int    `json:"remainingWorkers"`
	Attempt          int    `json:"attempt"`
}

type errorResponse struct {
	Error string `json:"error"`
}

func NewRouter() *gin.Engine {
	router := gin.New()
	router.POST("/api/dispatch-plans", createDispatchPlan)
	return router
}

func createDispatchPlan(c *gin.Context) {
	var body dispatchRequestJSON
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Error: "invalid request"})
		return
	}

	request := body.toDomain()

	plan, err := dispatch.PlanDispatch(request)

	if errors.Is(err, dispatch.ErrAttemptsExhausted) {
		c.JSON(
			http.StatusConflict,
			errorResponse{Error: "attempts exhausted"},
		)
		return
	}
	if errors.Is(err, dispatch.ErrInsufficientWorkers) {
		c.JSON(
			http.StatusServiceUnavailable,
			errorResponse{Error: "insufficient workers"},
		)
		return
	}

	c.JSON(http.StatusCreated, newDispatchPlanJSON(plan))
}

func (body dispatchRequestJSON) toDomain() dispatch.DispatchRequest {
	return dispatch.DispatchRequest{
		JobID:            body.JobID,
		RequiredWorkers:  body.RequiredWorkers,
		AvailableWorkers: body.AvailableWorkers,
		Attempts:         body.Attempts,
		MaxAttempts:      body.MaxAttempts,
	}
}

func newDispatchPlanJSON(plan dispatch.DispatchPlan) dispatchPlanJSON {
	return dispatchPlanJSON{
		JobID:            plan.JobID,
		Status:           plan.Status,
		WorkersAssigned:  plan.WorkersAssigned,
		RemainingWorkers: plan.RemainingWorkers,
		Attempt:          plan.Attempt,
	}
}
