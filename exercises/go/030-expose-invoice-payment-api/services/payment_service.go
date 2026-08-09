package services

import (
	"errors"

	"example.com/deliberate-coding-practice/exercises/go/030-expose-invoice-payment-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/030-expose-invoice-payment-api/models"
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

	invoice.BalanceCents -= paymentCents
	if invoice.BalanceCents == 0 {
		invoice.Status = constants.StatusPaid
	}

	return invoice, nil
}
