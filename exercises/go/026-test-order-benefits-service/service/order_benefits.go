package service

import "errors"

var ErrInvalidOrderTotal = errors.New("order total cannot be negative")

type OrderBenefits struct {
	DiscountCents   int
	FinalTotalCents int
	FreeShipping    bool
}

type OrderBenefitsService struct{}

func NewOrderBenefitsService() *OrderBenefitsService {
	return &OrderBenefitsService{}
}

func (service *OrderBenefitsService) Calculate(
	orderTotalCents int,
	loyaltyMember bool,
) (OrderBenefits, error) {
	if orderTotalCents < 0 {
		return OrderBenefits{}, ErrInvalidOrderTotal
	}

	discountCents := 0
	if loyaltyMember {
		discountCents = orderTotalCents / 10
	}

	finalTotalCents := orderTotalCents - discountCents

	return OrderBenefits{
		DiscountCents:   discountCents,
		FinalTotalCents: finalTotalCents,
		FreeShipping:    finalTotalCents >= 5000,
	}, nil
}
