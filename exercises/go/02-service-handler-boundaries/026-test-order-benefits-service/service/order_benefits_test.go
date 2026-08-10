package service

import (
	"errors"
	"testing"
)

func TestCalculateInvalidOrderTotal(t *testing.T) {
	order := NewOrderBenefitsService()

	got, err := order.Calculate(-1, true)

	if !errors.Is(err, ErrInvalidOrderTotal) {
		t.Fatalf("Calculate() error = %v; want %v", err, ErrInvalidOrderTotal)
	}

	if got != (OrderBenefits{}) {
		t.Errorf("Calculate() = %+v; want empty order benefits", got)
	}
}

func TestCalculateZeroOrderTotal(t *testing.T) {
	order := NewOrderBenefitsService()

	got, err := order.Calculate(0, false)

	want := OrderBenefits{
		DiscountCents:   0,
		FinalTotalCents: 0,
		FreeShipping:    false,
	}

	if err != nil {
		t.Fatalf("Calculate() error = %v; want nil", err)
	}

	if got != want {
		t.Errorf("Calculate() = %+v; want %+v", got, want)
	}
}

func TestCalculateNonMemberBelowFreeShipping(t *testing.T) {
	order := NewOrderBenefitsService()

	got, err := order.Calculate(4999, false)

	want := OrderBenefits{
		DiscountCents:   0,
		FinalTotalCents: 4999,
		FreeShipping:    false,
	}

	if err != nil {
		t.Fatalf("Calculate() error = %v; want nil", err)
	}

	if got != want {
		t.Errorf("Calculate() = %+v; want %+v", got, want)
	}
}

func TestCalculateNonMemberGetsFreeShipping(t *testing.T) {
	order := NewOrderBenefitsService()

	got, err := order.Calculate(5000, false)

	want := OrderBenefits{
		DiscountCents:   0,
		FinalTotalCents: 5000,
		FreeShipping:    true,
	}

	if err != nil {
		t.Fatalf("Calculate() error = %v; want nil", err)
	}

	if got != want {
		t.Errorf("Calculate() = %+v; want %+v", got, want)
	}
}

func TestCalculateLoyaltyMemberNoFreeShipping(t *testing.T) {
	order := NewOrderBenefitsService()

	got, err := order.Calculate(5000, true)

	want := OrderBenefits{
		DiscountCents:   500,
		FinalTotalCents: 4500,
		FreeShipping:    false,
	}

	if err != nil {
		t.Fatalf("Calculate() error = %v; want nil", err)
	}

	if got != want {
		t.Errorf("Calculate() = %+v; want %+v", got, want)
	}

}

func TestCalculateLoyaltyMemberWithFreeShipping(t *testing.T) {
	order := NewOrderBenefitsService()

	got, err := order.Calculate(6000, true)

	want := OrderBenefits{
		DiscountCents:   600,
		FinalTotalCents: 5400,
		FreeShipping:    true,
	}

	if err != nil {
		t.Fatalf("Calculate() error = %v; want nil", err)
	}

	if got != want {
		t.Errorf("Calculate() = %+v; want %+v", got, want)
	}
}
