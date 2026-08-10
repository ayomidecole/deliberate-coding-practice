package retry

import "errors"

var ErrInvalidAttempt = errors.New("attempt must be positive")

func CalculateRetryDelay(attempt int) (int, error) {

	if attempt <= 0 {
		return 0, ErrInvalidAttempt
	}

	if attempt >= 1 && attempt <= 3 {
		return attempt * 2, nil
	}

	return 6, nil
}
