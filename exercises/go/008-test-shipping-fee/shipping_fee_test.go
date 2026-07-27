package shipping

import (
	"errors"
	"testing"
)

func TestShippingFeeChargesStandardFee(t *testing.T) {
	fee, err := ShippingFee(2500)

	if err != nil {
		t.Fatalf("ShippingFee() error = %v; want nil", err)
	}
	if got, want := fee, 500; got != want {
		t.Errorf("ShippingFee() fee = %d; want %d", got, want)
	}
}

func TestShippingFeeNotNegative(t *testing.T) {
	fee, err := ShippingFee(-3)

	if err == nil {
		t.Fatal("ShippingFee(-3) error = nil; want ErrInvalidSubtotal")
	}
	if !errors.Is(err, ErrInvalidSubtotal) {
		t.Fatalf("ShippingFee(-3) error = %v; want ErrInvalidSubtotal", err)
	}
	if got, want := fee, 0; got != want {
		t.Errorf("ShippingFee(-3) fee = %d; want %d", got, want)
	}
}

func TestGreatestSubtotalThatPaysShipping(t *testing.T) {
	fee, err := ShippingFee(4999)

	if err != nil {
		t.Fatalf("ShippingFee() error = %v; want nil", err)
	}
	if got, want := fee, 500; got != want {
		t.Errorf("ShippingFee() fee = %d; want %d", got, want)
	}
}

func TestSmallestSubtotalThatDoesNotPayShipping(t *testing.T) {
	fee, err := ShippingFee(5000)

	if err != nil {
		t.Fatalf("ShippingFee() error = %v; want nil", err)
	}

	if got, want := fee, 0; got != want {
		t.Errorf("ShippingFee() fee = %d; want %d", got, want)
	}
}
