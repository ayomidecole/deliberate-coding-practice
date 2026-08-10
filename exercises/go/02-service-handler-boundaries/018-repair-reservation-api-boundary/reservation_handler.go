package reservationapi

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

type reservationRequestJSON struct {
	AvailableStock    int `json:"availableStock"`
	RequestedQuantity int `json:"requestedQuantity"`
}

type reservationResponseJSON struct {
	RemainingStock int `json:"remainingStock"`
}

type errorResponse struct {
	Error string `json:"error"`
}

func NewRouter() *gin.Engine {
	router := gin.New()
	router.POST("/api/inventory-reservations", reserveInventory)
	return router
}

func reserveInventory(c *gin.Context) {
	var body reservationRequestJSON
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Error: "invalid request"})
		return
	}

	res, err := ReserveStock(body.AvailableStock, body.RequestedQuantity)

	if errors.Is(err, ErrInvalidQuantity) {
		c.JSON(
			http.StatusBadRequest, errorResponse{Error: "invalid quantity"})
		return
	}

	if errors.Is(err, ErrInsufficientStock) {
		c.JSON(
			http.StatusConflict, errorResponse{Error: "insufficient stock"})
		return
	}

	c.JSON(
		http.StatusCreated, reservationResponseJSON{RemainingStock: res},
	)
}
