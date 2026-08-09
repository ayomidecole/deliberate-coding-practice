package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/030-expose-invoice-payment-api/models"
	"example.com/deliberate-coding-practice/exercises/go/030-expose-invoice-payment-api/services"
	"github.com/gin-gonic/gin"
)

type paymentRequestJSON struct {
	InvoiceID     string `json:"invoiceId"`
	InvoiceStatus string `json:"invoiceStatus"`
	BalanceCents  int    `json:"balanceCents"`
	PaymentCents  int    `json:"paymentCents"`
}

type paymentResponseJSON struct {
	InvoiceID    string `json:"invoiceId"`
	Status       string `json:"status"`
	BalanceCents int    `json:"balanceCents"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

type PaymentHandler struct {
	service *services.PaymentService
}

func (handler *PaymentHandler) previewPayment(c *gin.Context) {

	var body paymentRequestJSON

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, errorResponseJSON{Error: "invalid request"})
		return
	}

	invoice := models.Invoice{
		ID:           body.InvoiceID,
		Status:       body.InvoiceStatus,
		BalanceCents: body.BalanceCents,
	}

	payment, err := handler.service.ApplyPayment(invoice, body.PaymentCents)

	if errors.Is(err, services.ErrInvoiceAlreadyPaid) {
		c.JSON(http.StatusConflict, errorResponseJSON{Error: "invoice already paid"})
		return
	}
	if errors.Is(err, services.ErrInvalidPayment) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{Error: "invalid payment"})
		return
	}
	if errors.Is(err, services.ErrPaymentExceedsBalance) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{Error: "invalid payment"})
		return
	}

	c.JSON(http.StatusOK, paymentResponseJSON{
		InvoiceID:    payment.ID,
		Status:       payment.Status,
		BalanceCents: payment.BalanceCents,
	})
}
