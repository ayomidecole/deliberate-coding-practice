package handler

import (
	"example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/025-expose-shipping-quote-api/service"
	"github.com/gin-gonic/gin"
)

func NewRouter(service *service.QuoteService) *gin.Engine {
	router := gin.New()
	handler := &Handler{service: service}

	router.POST("/api/shipping-quotes", handler.createQuote)

	return router
}
