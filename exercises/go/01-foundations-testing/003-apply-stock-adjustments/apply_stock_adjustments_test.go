package inventory

import (
	"maps"
	"testing"
)

func TestApplyStockAdjustmentsValidBatch(t *testing.T) {
	stock := map[string]int{
		"keyboard": 10,
		"mouse":    5,
	}
	adjustments := []StockAdjustment{
		{ProductID: "keyboard", Delta: -2},
		{ProductID: "mouse", Delta: 3},
	}

	got := ApplyStockAdjustments(stock, adjustments)

	want := map[string]int{
		"keyboard": 8,
		"mouse":    8,
	}
	if !maps.Equal(got, want) {
		t.Errorf("ApplyStockAdjustments(valid batch) = %v; want %v", got, want)
	}

}

func TestApplyStockAdjustmentsDoesNotMutateInput(t *testing.T) {
	stock := map[string]int{
		"keyboard": 10,
		"mouse":    5,
	}
	original := maps.Clone(stock)
	adjustments := []StockAdjustment{
		{ProductID: "keyboard", Delta: -2},
	}

	ApplyStockAdjustments(stock, adjustments)

	if !maps.Equal(stock, original) {
		t.Errorf("input stock after ApplyStockAdjustments = %v; want unchanged %v", stock, original)
	}
}

func TestMultipleAdjustmentsToOneProduct(t *testing.T) {
	stock := map[string]int{
		"keyboard": 10,
		"mouse":    5,
	}
	adjustments := []StockAdjustment{
		{ProductID: "keyboard", Delta: 1},
		{ProductID: "keyboard", Delta: 1},
		{ProductID: "keyboard", Delta: 1},
	}

	got := ApplyStockAdjustments(stock, adjustments)

	want := map[string]int{
		"keyboard": 13,
		"mouse":    5,
	}

	if !maps.Equal(got, want) {
		t.Errorf("ApplyStockAdjustments(valid batch) = %v; want %v", got, want)
	}
}

func TestEmptyAdjustmentsReturnIndependentCopy(t *testing.T) {
	stock := map[string]int{
		"keyboard": 10,
		"mouse":    5,
	}
	adjustments := []StockAdjustment{}

	got := ApplyStockAdjustments(stock, adjustments)

	if !maps.Equal(got, stock) {
		t.Errorf("ApplyStockAdjustments(empty adjustment) = %v; want %v", got, stock)
	}

	got["keyboard"] = 999

	if stock["keyboard"] != 10 {
		t.Errorf("mutating returned map also changed input: got %v; input %v", got, stock)
	}

}
