package handling

import (
	"errors"
	"testing"
)

func TestCalculateHandlingFeeWaivesFeeForSmallOrder(t *testing.T) {
	fee, err := CalculateHandlingFee(1)

	if err != nil {
		t.Fatalf("CalculateHandlingFee(1) error = %v; want nil", err)
	}
	if got, want := fee, 0; got != want {
		t.Errorf("CalculateHandlingFee(1) fee = %d; want %d", got, want)
	}
}

func TestCalculateNoHandlingFeeForNegativeItemCount(t *testing.T) {
	fee, err := CalculateHandlingFee(-1)

	if err == nil {
		t.Fatalf("CalculateHandlingFee(-1) error = %v; want ErrInvalidItemCount", err)
	}

	if !errors.Is(err, ErrInvalidItemCount) {
		t.Fatalf("CalculateHandlingFee(-1) error = %v; want ErrInvalidItemCount", err)
	}

	if got, want := fee, 0; got != want {
		t.Errorf("CalculateHandlingFee() fee = %d; want %d", got, want)
	}

}

func TestLowestPossibleItemCountWithHandlingFee(t *testing.T) {
	fee, err := CalculateHandlingFee(3)

	if err != nil {
		t.Fatalf("CalculateHandlingFee(3) error = %v; want nil", err)
	}

	if got, want := fee, 600; got != want {
		t.Errorf("CalculateHandlingFee(3) fee = %d; want %d", got, want)
	}
}

func TestCalculateHandlingFeeForTwoItemsBoundary(t *testing.T) {
	fee, err := CalculateHandlingFee(2)

	if err != nil {
		t.Fatalf("CalculateHandlingFee(2) error = %v; want nil", err)
	}

	if got, want := fee, 0; got != want {
		t.Errorf("CalculateHandlingFee(2) fee = %d; want %d", got, want)
	}
}

func TestHandlingFeeForFourItems(t *testing.T) {
	fee, err := CalculateHandlingFee(4)

	if err != nil {
		t.Fatalf("CalculateHandlingFee(4) error = %v; want nil", err)
	}

	if got, want := fee, 800; got != want {
		t.Errorf("CalculateHandlingFee(4) fee = %d; want %d", got, want)
	}
}

func TestCalculateHandlingFeeZeroItems(t *testing.T) {
	fee, err := CalculateHandlingFee(0)

	if err == nil {
		t.Fatalf("CalculateHandlingFee(0) error = %v; want ErrInvalidItemCount", err)
	}

	if !errors.Is(err, ErrInvalidItemCount) {
		t.Fatalf("CalculateHandlingFee(0) error = %v; want ErrInvalidItemCount", err)
	}

	if got, want := fee, 0; got != want {
		t.Errorf("CalculateHandlingFee(0) fee = %d; want %d", got, want)
	}
}
