package handling

import "errors"

var ErrInvalidItemCount = errors.New("item count must be positive")

func CalculateHandlingFee(itemCount int) (int, error) {
	if itemCount <= 0 {
		return 0, ErrInvalidItemCount
	}
	if itemCount <= 2 {
		return 0, nil
	}
	return itemCount * 200, nil
}
