package handlers

import (
	"example.com/deliberate-coding-practice/exercises/go/031-expose-job-admission-api/services"
	"github.com/gin-gonic/gin"
)

func NewRouter(service *services.AdmissionService) *gin.Engine {
	router := gin.New()
	handler := &AdmissionHandler{service: service}

	router.POST("/api/job-admission-decisions", handler.decideAdmission)

	return router
}
