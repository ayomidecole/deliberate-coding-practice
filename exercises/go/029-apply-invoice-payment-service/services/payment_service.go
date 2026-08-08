package services

import (
	"errors"

	"example.com/deliberate-coding-practice/exercises/go/029-apply-invoice-payment-service/constants"
	"example.com/deliberate-coding-practice/exercises/go/029-apply-invoice-payment-service/models"
)

var (
	ErrInvoiceAlreadyPaid    = errors.New("invoice is already paid")
	ErrInvalidPayment        = errors.New("payment must be positive")
	ErrPaymentExceedsBalance = errors.New("payment exceeds balance")
)

type PaymentService struct{}

func NewPaymentService() *PaymentService {
	return &PaymentService{}
}

func (service *PaymentService) ApplyPayment(
	invoice models.Invoice,
	paymentCents int,
) (models.Invoice, error) {

	if invoice.Status == constants.StatusPaid {
		return invoice, ErrInvoiceAlreadyPaid
	}

	if paymentCents <= 0 {
		return invoice, ErrInvalidPayment
	}

	if paymentCents > invoice.BalanceCents {
		return invoice, ErrPaymentExceedsBalance
	}

	if invoice.BalanceCents > paymentCents {
		return models.Invoice{
			ID:           invoice.ID,
			Status:       constants.StatusOpen,
			BalanceCents: invoice.BalanceCents - paymentCents,
		}, nil
	}

	return models.Invoice{
		ID:           invoice.ID,
		Status:       constants.StatusPaid,
		BalanceCents: 0,
	}, nil
}
