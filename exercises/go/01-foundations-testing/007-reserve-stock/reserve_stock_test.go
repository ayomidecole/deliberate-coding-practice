package inventory

import (
	"errors"
	"testing"
)

func TestReserveStockReturnsRemainingStock(t *testing.T) {
	remaining, err := ReserveStock(10, 3)

	if err != nil {
		t.Fatalf("ReserveStock() error = %v; want nil", err)
	}
	if got, want := remaining, 7; got != want {
		t.Errorf("ReserveStock() remaining = %d; want %d", got, want)
	}
}

func TestReserveStockAllowsExactReservation(t *testing.T) {
	remaining, err := ReserveStock(4, 4)

	if err != nil {
		t.Fatalf("ReserveStock() error = %v; want nil", err)
	}
	if got, want := remaining, 0; got != want {
		t.Errorf("ReserveStock() remaining = %d; want %d", got, want)
	}
}

func TestReserveStockRejectsInvalidQuantity(t *testing.T) {
	remaining, err := ReserveStock(10, 0)

	if !errors.Is(err, ErrInvalidQuantity) {
		t.Errorf("ReserveStock() error = %v; want %v", err, ErrInvalidQuantity)
	}
	if got, want := remaining, 10; got != want {
		t.Errorf("ReserveStock() remaining = %d; want unchanged %d", got, want)
	}
}

func TestReserveStockRejectsInsufficientStock(t *testing.T) {
	remaining, err := ReserveStock(2, 3)

	if !errors.Is(err, ErrInsufficientStock) {
		t.Errorf("ReserveStock() error = %v; want %v", err, ErrInsufficientStock)
	}
	if got, want := remaining, 2; got != want {
		t.Errorf("ReserveStock() remaining = %d; want unchanged %d", got, want)
	}
}
