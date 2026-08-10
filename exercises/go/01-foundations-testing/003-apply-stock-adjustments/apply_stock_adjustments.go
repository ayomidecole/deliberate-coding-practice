package inventory

import "maps"

// StockAdjustment changes the stock level for one existing product.
type StockAdjustment struct {
	ProductID string
	Delta     int
}

// ApplyStockAdjustments applies a batch of inventory changes.
func ApplyStockAdjustments(stock map[string]int, adjustments []StockAdjustment) map[string]int {

	newStock := maps.Clone(stock)

	for _, adjustment := range adjustments {
		newStock[adjustment.ProductID] += adjustment.Delta
	}

	return newStock
}
