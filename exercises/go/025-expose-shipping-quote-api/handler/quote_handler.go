package handler

import (
	"example.com/deliberate-coding-practice/exercises/go/025-expose-shipping-quote-api/service"
	"github.com/gin-gonic/gin"
)

type quoteRequestJSON struct {
	ShipmentID       string `json:"shipmentId"`
	DistanceMiles    int    `json:"distanceMiles"`
	RatePerMileCents int    `json:"ratePerMileCents"`
}

type quoteResponseJSON struct {
	ShipmentID       string `json:"shipmentId"`
	DistanceMiles    int    `json:"distanceMiles"`
	RatePerMileCents int    `json:"ratePerMileCents"`
	TotalCostCents   int    `json:"totalCostCents"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

type Handler struct {
	service *service.QuoteService
}

func (handler *Handler) createQuote(c *gin.Context) {
}
