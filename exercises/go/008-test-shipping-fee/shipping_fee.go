package shipping

import "errors"

var ErrInvalidSubtotal = errors.New("subtotal cannot be negative")

func ShippingFee(subtotalCents int) (int, error) {
	if subtotalCents < 0 {
		return 0, ErrInvalidSubtotal
	}
	if subtotalCents >= 5000 {
		return 0, nil
	}
	return 500, nil
}
