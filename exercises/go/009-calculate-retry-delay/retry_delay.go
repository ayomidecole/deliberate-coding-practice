package retry

import "errors"

var ErrInvalidAttempt = errors.New("attempt must be positive")

func CalculateRetryDelay(attempt int) (int, error) {
	// TODO: implement the retry-delay contract.
	return 0, nil
}
