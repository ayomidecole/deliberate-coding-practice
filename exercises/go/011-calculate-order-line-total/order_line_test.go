package orderline

import "testing"

func TestCalculateLineTotalCents(t *testing.T) {
	line := OrderLine{
		SKU:            "keyboard",
		UnitPriceCents: 1250,
		Quantity:       3,
	}

	if got, want := CalculateLineTotalCents(line), 3750; got != want {
		t.Errorf("CalculateLineTotalCents() = %d; want %d", got, want)
	}
}

func TestCalculateLineTotalCentsWithZeroQuantity(t *testing.T) {
	line := OrderLine{
		SKU:            "monitor",
		UnitPriceCents: 25000,
		Quantity:       0,
	}

	if got, want := CalculateLineTotalCents(line), 0; got != want {
		t.Errorf("CalculateLineTotalCents() = %d; want %d", got, want)
	}
}

func TestCalculateLineTotalCentsDoesNotModifyCallerValue(t *testing.T) {
	line := OrderLine{
		SKU:            "mouse",
		UnitPriceCents: 4000,
		Quantity:       2,
	}
	before := line

	CalculateLineTotalCents(line)

	if line != before {
		t.Errorf("CalculateLineTotalCents() changed line to %+v; want %+v", line, before)
	}
}
