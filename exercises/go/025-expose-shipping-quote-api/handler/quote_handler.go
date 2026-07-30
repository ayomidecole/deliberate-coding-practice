package handler

import (
	"errors"
	"net/http"

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
	var body quoteRequestJSON

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, errorResponseJSON{Error: "invalid request"})
		return
	}

	quote, err := handler.service.BuildQuote(
		body.ShipmentID,
		body.DistanceMiles,
		body.RatePerMileCents,
	)

	if errors.Is(err, service.ErrInvalidDistance) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{Error: "invalid distance"})
		return
	}

	c.JSON(http.StatusOK, quoteResponseJSON{
		ShipmentID:       quote.ShipmentID,
		DistanceMiles:    quote.DistanceMiles,
		RatePerMileCents: quote.RatePerMileCents,
		TotalCostCents:   quote.TotalCostCents,
	})
}
