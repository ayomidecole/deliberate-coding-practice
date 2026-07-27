package retry

import (
	"errors"
	"testing"
)

func TestCalculateRetryDelayRejectsInvalidAttempt(t *testing.T) {
	delay, err := CalculateRetryDelay(0)

	if !errors.Is(err, ErrInvalidAttempt) {
		t.Fatalf("CalculateRetryDelay(0) error = %v; want %v", err, ErrInvalidAttempt)
	}
	if got, want := delay, 0; got != want {
		t.Errorf("CalculateRetryDelay(0) delay = %d; want %d", got, want)
	}
}

func TestCalculateRetryDelayCalculatesFirstAttempt(t *testing.T) {
	delay, err := CalculateRetryDelay(1)

	if err != nil {
		t.Fatalf("CalculateRetryDelay(1) error = %v; want nil", err)
	}
	if got, want := delay, 2; got != want {
		t.Errorf("CalculateRetryDelay(1) delay = %d; want %d", got, want)
	}
}

func TestCalculateRetryDelayCalculatesLastAttemptBeforeCap(t *testing.T) {
	delay, err := CalculateRetryDelay(3)

	if err != nil {
		t.Fatalf("CalculateRetryDelay(3) error = %v; want nil", err)
	}
	if got, want := delay, 6; got != want {
		t.Errorf("CalculateRetryDelay(3) delay = %d; want %d", got, want)
	}
}

func TestCalculateRetryDelayCapsFourthAttempt(t *testing.T) {
	delay, err := CalculateRetryDelay(4)

	if err != nil {
		t.Fatalf("CalculateRetryDelay(4) error = %v; want nil", err)
	}
	if got, want := delay, 6; got != want {
		t.Errorf("CalculateRetryDelay(4) delay = %d; want %d", got, want)
	}
}

func TestCalculateRetryDelayKeepsLaterAttemptsCapped(t *testing.T) {
	delay, err := CalculateRetryDelay(10)

	if err != nil {
		t.Fatalf("CalculateRetryDelay(10) error = %v; want nil", err)
	}
	if got, want := delay, 6; got != want {
		t.Errorf("CalculateRetryDelay(10) delay = %d; want %d", got, want)
	}
}
