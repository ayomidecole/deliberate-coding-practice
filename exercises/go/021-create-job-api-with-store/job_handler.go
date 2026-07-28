package jobapi

import (
	"net/http"

	"errors"
	jobstore "example.com/deliberate-coding-practice/exercises/go/020-build-in-memory-job-store"
	"github.com/gin-gonic/gin"
)

type createJobRequestJSON struct {
	ID              string `json:"id"`
	RequiredWorkers int    `json:"requiredWorkers"`
}

type jobResponseJSON struct {
	ID              string `json:"id"`
	RequiredWorkers int    `json:"requiredWorkers"`
}

type errorResponse struct {
	Error string `json:"error"`
}

type JobHandler struct {
	store *jobstore.JobStore
}

func NewRouter(store *jobstore.JobStore) *gin.Engine {
	router := gin.New()
	handler := &JobHandler{store: store}

	router.POST("/api/jobs", handler.createJob)

	return router
}

func (handler *JobHandler) createJob(c *gin.Context) {
	var body createJobRequestJSON
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Error: "invalid request"})
		return
	}

	job := jobstore.Job{
		ID:              body.ID,
		RequiredWorkers: body.RequiredWorkers,
	}

	err := handler.store.Add(job)

	if errors.Is(err, jobstore.ErrDuplicateJob) {
		c.JSON(http.StatusConflict, errorResponse{Error: "job already exists"})
		return
	}

	c.JSON(
		http.StatusCreated, jobResponseJSON{job.ID, job.RequiredWorkers},
	)
}
