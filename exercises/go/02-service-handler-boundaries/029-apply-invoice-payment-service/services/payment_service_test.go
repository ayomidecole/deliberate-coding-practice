package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/029-apply-invoice-payment-service/constants"
	"example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/029-apply-invoice-payment-service/models"
)

func TestApplyPaymentRejectsPaidInvoiceBeforeAmountValidation(t *testing.T) {
	service := NewPaymentService()
	invoice := models.Invoice{ID: "invoice-101", Status: constants.StatusPaid, BalanceCents: 0}

	got, err := service.ApplyPayment(invoice, 0)

	if !errors.Is(err, ErrInvoiceAlreadyPaid) {
		t.Fatalf("ApplyPayment() error = %v; want %v", err, ErrInvoiceAlreadyPaid)
	}
	if got != invoice {
		t.Errorf("ApplyPayment() = %+v; want unchanged %+v", got, invoice)
	}
}

func TestApplyPaymentRejectsNonPositiveAmount(t *testing.T) {
	service := NewPaymentService()
	invoice := models.Invoice{ID: "invoice-102", Status: constants.StatusOpen, BalanceCents: 5000}

	got, err := service.ApplyPayment(invoice, -1)

	if !errors.Is(err, ErrInvalidPayment) {
		t.Fatalf("ApplyPayment() error = %v; want %v", err, ErrInvalidPayment)
	}
	if got != invoice {
		t.Errorf("ApplyPayment() = %+v; want unchanged %+v", got, invoice)
	}
}
func TestApplyPaymentRejectsZeroAmount(t *testing.T) {
	service := NewPaymentService()
	invoice := models.Invoice{ID: "invoice-102", Status: constants.StatusOpen, BalanceCents: 5000}

	got, err := service.ApplyPayment(invoice, 0)

	if !errors.Is(err, ErrInvalidPayment) {
		t.Fatalf("ApplyPayment() error = %v; want %v", err, ErrInvalidPayment)
	}
	if got != invoice {
		t.Errorf("ApplyPayment() = %+v; want unchanged %+v", got, invoice)
	}
}

func TestApplyPaymentRejectsAmountAboveBalance(t *testing.T) {
	service := NewPaymentService()
	invoice := models.Invoice{ID: "invoice-103", Status: constants.StatusOpen, BalanceCents: 5000}

	got, err := service.ApplyPayment(invoice, 5001)

	if !errors.Is(err, ErrPaymentExceedsBalance) {
		t.Fatalf("ApplyPayment() error = %v; want %v", err, ErrPaymentExceedsBalance)
	}
	if got != invoice {
		t.Errorf("ApplyPayment() = %+v; want unchanged %+v", got, invoice)
	}
}

func TestApplyPaymentAppliesPartialPayment(t *testing.T) {
	service := NewPaymentService()
	invoice := models.Invoice{ID: "invoice-104", Status: constants.StatusOpen, BalanceCents: 5000}
	original := invoice

	got, err := service.ApplyPayment(invoice, 2000)

	if err != nil {
		t.Fatalf("ApplyPayment() error = %v; want nil", err)
	}
	want := models.Invoice{ID: "invoice-104", Status: constants.StatusOpen, BalanceCents: 3000}
	if got != want {
		t.Errorf("ApplyPayment() = %+v; want %+v", got, want)
	}
	if invoice != original {
		t.Errorf("ApplyPayment() changed caller to %+v; want %+v", invoice, original)
	}
}

func TestApplyPaymentMarksInvoicePaidAtZeroBalance(t *testing.T) {
	service := NewPaymentService()
	invoice := models.Invoice{ID: "invoice-105", Status: constants.StatusOpen, BalanceCents: 5000}

	got, err := service.ApplyPayment(invoice, 5000)

	if err != nil {
		t.Fatalf("ApplyPayment() error = %v; want nil", err)
	}
	want := models.Invoice{ID: "invoice-105", Status: constants.StatusPaid, BalanceCents: 0}
	if got != want {
		t.Errorf("ApplyPayment() = %+v; want %+v", got, want)
	}
}
