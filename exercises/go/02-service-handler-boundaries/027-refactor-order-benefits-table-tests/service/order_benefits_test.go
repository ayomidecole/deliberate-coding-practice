package service

import (
	"errors"
	"testing"
)

type calculateSuccessCase struct {
	name            string
	orderTotalCents int
	loyaltyMember   bool
	want            OrderBenefits
}

func TestCalculateRejectsNegativeTotal(t *testing.T) {
	service := NewOrderBenefitsService()

	got, err := service.Calculate(-1, false)

	if !errors.Is(err, ErrInvalidOrderTotal) {
		t.Fatalf("Calculate() error = %v; want %v", err, ErrInvalidOrderTotal)
	}
	if got != (OrderBenefits{}) {
		t.Errorf("Calculate() = %+v; want empty order benefits", got)
	}
}

func TestCalculateSuccessCases(t *testing.T) {
	cases := []calculateSuccessCase{
		{
			name:            "zero total is valid",
			orderTotalCents: 0,
			loyaltyMember:   false,
			want: OrderBenefits{
				DiscountCents:   0,
				FinalTotalCents: 0,
				FreeShipping:    false,
			},
		},
		{
			name:            "a non-member is below the free-shipping threshold",
			orderTotalCents: 4000,
			loyaltyMember:   false,
			want: OrderBenefits{
				DiscountCents:   0,
				FinalTotalCents: 4000,
				FreeShipping:    false,
			},
		},
		{
			name:            "a non-member is exactly at the threshold",
			orderTotalCents: 5000,
			loyaltyMember:   false,
			want: OrderBenefits{
				DiscountCents:   0,
				FinalTotalCents: 5000,
				FreeShipping:    true,
			},
		},
		{
			name:            "a loyalty member qualifies before the discount but not afterward",
			orderTotalCents: 5000,
			loyaltyMember:   true,
			want: OrderBenefits{
				DiscountCents:   500,
				FinalTotalCents: 4500,
				FreeShipping:    false,
			},
		},
		{
			name:            "a loyalty member still qualifies after the discount",
			orderTotalCents: 6000,
			loyaltyMember:   true,
			want: OrderBenefits{
				DiscountCents:   600,
				FinalTotalCents: 5400,
				FreeShipping:    true,
			},
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			svc := NewOrderBenefitsService()

			got, err := svc.Calculate(tc.orderTotalCents, tc.loyaltyMember)

			if err != nil {
				t.Fatalf("Calculate() error = %v; want nil", err)
			}

			if got != tc.want {
				t.Errorf("Calculate() = %+v; want %+v", got, tc.want)
			}
		})
	}
}
