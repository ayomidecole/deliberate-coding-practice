package reservationapi

import "errors"

var (
	ErrInvalidQuantity   = errors.New("requested quantity must be positive")
	ErrInsufficientStock = errors.New("insufficient stock")
)

func ReserveStock(available, requested int) (int, error) {
	if requested <= 0 {
		return available, ErrInvalidQuantity
	}

	if requested > available {
		return available, ErrInsufficientStock
	}

	return available - requested, nil
}
