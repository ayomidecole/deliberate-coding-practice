package inventory

import "errors"

var (
	ErrInvalidQuantity   = errors.New("requested quantity must be positive")
	ErrInsufficientStock = errors.New("insufficient stock")
)

// ReserveStock returns the remaining stock or leaves it unchanged when the request fails.
func ReserveStock(available, requested int) (int, error) {

	if requested <= 0 {
		return available, ErrInvalidQuantity
	}

	if requested > available {
		return available, ErrInsufficientStock
	}

	available = available - requested

	return available, nil
}
