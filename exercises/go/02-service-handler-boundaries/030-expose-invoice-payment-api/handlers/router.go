package handlers

import (
	"example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/030-expose-invoice-payment-api/services"
	"github.com/gin-gonic/gin"
)

func NewRouter(service *services.PaymentService) *gin.Engine {
	router := gin.New()
	handler := &PaymentHandler{service: service}

	router.POST("/api/invoice-payment-previews", handler.previewPayment)

	return router
}
