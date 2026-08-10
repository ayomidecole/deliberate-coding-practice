package handlers

import (
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/031-expose-job-admission-api/services"
	"github.com/gin-gonic/gin"
)

type admissionRequestJSON struct {
	JobID            string `json:"jobId"`
	RequiredWorkers  int    `json:"requiredWorkers"`
	AvailableWorkers int    `json:"availableWorkers"`
}

type admissionResponseJSON struct {
	JobID            string `json:"jobId"`
	RequiredWorkers  int    `json:"requiredWorkers"`
	AvailableWorkers int    `json:"availableWorkers"`
	Status           string `json:"status"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

type AdmissionHandler struct {
	service *services.AdmissionService
}

func (handler *AdmissionHandler) decideAdmission(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, errorResponseJSON{Error: "not implemented"})
}
